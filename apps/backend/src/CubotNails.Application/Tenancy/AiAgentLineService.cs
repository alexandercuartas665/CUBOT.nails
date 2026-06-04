using CubotNails.Application.Common;
using CubotNails.Domain.Entities;
using CubotNails.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CubotNails.Application.Tenancy;

/// <summary>Una linea del salon vista desde la config de un agente: estado del binding con ESTE agente.</summary>
public sealed record AgentLineDto(
    Guid LineId,
    string InstanceName,
    string? PhoneNumber,
    WhatsAppLineStatus LineStatus,
    bool Connected,        // este agente esta atendiendo la linea
    bool AutoConfirm,      // autonomo (true) vs sugerencia (false)
    string? OtherAgentName // si otra agente atiende la linea, su nombre
);

/// <summary>Entrada de la bitacora de atencion del agente.</summary>
public sealed record AgentRunLogEntryDto(DateTimeOffset OccurredAt, AiAgentRunLogKind Kind, string Title, string? Content, string? Response);

/// <summary>Conversacion atendida por un agente (para el listado de la bitacora).</summary>
public sealed record AgentConversationDto(Guid ConversationId, string? ContactName, string ContactPhone, string? LineLabel, DateTimeOffset? LastActivityAt, int Events);

/// <summary>
/// Gestiona el vinculo entre agentes de IA y lineas de WhatsApp (conectar/desconectar, modo autonomo)
/// y expone la bitacora de atencion. Todo tenant-scoped.
/// </summary>
public interface IAiAgentLineService
{
    Task<IReadOnlyList<AgentLineDto>> ListLinesForAgentAsync(Guid agentId, CancellationToken cancellationToken = default);
    Task SetConnectedAsync(Guid agentId, Guid lineId, bool connected, Guid actorUserId, CancellationToken cancellationToken = default);
    Task SetAutoConfirmAsync(Guid agentId, Guid lineId, bool autoConfirm, Guid actorUserId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AgentConversationDto>> ListAttendedConversationsAsync(int take = 50, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AgentRunLogEntryDto>> GetConversationLogAsync(Guid conversationId, CancellationToken cancellationToken = default);
}

public sealed class AiAgentLineService : IAiAgentLineService
{
    private readonly IApplicationDbContext _db;
    private readonly ITenantContext _tenant;
    private readonly IAuditWriter _audit;

    public AiAgentLineService(IApplicationDbContext db, ITenantContext tenant, IAuditWriter audit)
    {
        _db = db;
        _tenant = tenant;
        _audit = audit;
    }

    public async Task<IReadOnlyList<AgentLineDto>> ListLinesForAgentAsync(Guid agentId, CancellationToken cancellationToken = default)
    {
        var lines = await _db.WhatsAppLines.AsNoTracking().OrderBy(l => l.InstanceName).ToListAsync(cancellationToken);
        var bindings = await _db.AiAgentLineBindings.AsNoTracking().ToListAsync(cancellationToken);
        var agentNames = await _db.AiAgents.AsNoTracking().ToDictionaryAsync(a => a.Id, a => a.Name, cancellationToken);

        return lines.Select(l =>
        {
            var b = bindings.FirstOrDefault(x => x.WhatsAppLineId == l.Id);
            var mine = b is not null && b.AgentId == agentId;
            string? other = b is not null && b.AgentId != agentId && agentNames.TryGetValue(b.AgentId, out var n) ? n : null;
            return new AgentLineDto(l.Id, l.InstanceName, l.PhoneNumber, l.Status,
                mine && b!.IsConnected, mine && b!.AutoConfirm, other);
        }).ToList();
    }

    public async Task SetConnectedAsync(Guid agentId, Guid lineId, bool connected, Guid actorUserId, CancellationToken cancellationToken = default)
    {
        if (_tenant.TenantId is not Guid tenantId) { return; }
        var binding = await _db.AiAgentLineBindings.FirstOrDefaultAsync(b => b.WhatsAppLineId == lineId, cancellationToken);
        if (binding is null)
        {
            binding = new AiAgentLineBinding
            {
                TenantId = tenantId,
                AgentId = agentId,
                WhatsAppLineId = lineId,
                IsConnected = connected,
                AutoConfirm = false // por defecto modo sugerencia
            };
            _db.AiAgentLineBindings.Add(binding);
        }
        else
        {
            // Conectar a este agente reasigna la linea (una linea = a lo sumo un agente).
            binding.AgentId = agentId;
            binding.IsConnected = connected;
        }
        _audit.Write(actorUserId, connected ? "agent.line.connect" : "agent.line.disconnect", nameof(AiAgentLineBinding), binding.Id, null, new { agentId, lineId }, tenantId);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task SetAutoConfirmAsync(Guid agentId, Guid lineId, bool autoConfirm, Guid actorUserId, CancellationToken cancellationToken = default)
    {
        if (_tenant.TenantId is not Guid tenantId) { return; }
        var binding = await _db.AiAgentLineBindings.FirstOrDefaultAsync(b => b.WhatsAppLineId == lineId && b.AgentId == agentId, cancellationToken);
        if (binding is null) { return; }
        binding.AutoConfirm = autoConfirm;
        _audit.Write(actorUserId, "agent.line.autoconfirm", nameof(AiAgentLineBinding), binding.Id, null, new { autoConfirm }, tenantId);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<AgentConversationDto>> ListAttendedConversationsAsync(int take = 50, CancellationToken cancellationToken = default)
    {
        // Conversaciones que tienen actividad de bitacora, mas recientes primero.
        var grouped = await _db.AiAgentRunLogs.AsNoTracking()
            .GroupBy(l => l.ConversationId)
            .Select(g => new { ConversationId = g.Key, Last = g.Max(x => x.OccurredAt), Events = g.Count() })
            .OrderByDescending(g => g.Last)
            .Take(take)
            .ToListAsync(cancellationToken);
        if (grouped.Count == 0) { return Array.Empty<AgentConversationDto>(); }

        var convIds = grouped.Select(g => g.ConversationId).ToList();
        var convs = await _db.Conversations.AsNoTracking().Where(c => convIds.Contains(c.Id)).ToListAsync(cancellationToken);
        var lineLabels = await _db.WhatsAppLines.AsNoTracking()
            .ToDictionaryAsync(l => l.Id, l => string.IsNullOrWhiteSpace(l.PhoneNumber) ? l.InstanceName : l.PhoneNumber!, cancellationToken);

        return grouped.Select(g =>
        {
            var c = convs.FirstOrDefault(x => x.Id == g.ConversationId);
            string? lineLabel = c?.WhatsAppLineId is Guid lid && lineLabels.TryGetValue(lid, out var lbl) ? lbl : null;
            return new AgentConversationDto(g.ConversationId, c?.ContactName, c?.ContactPhone ?? "?", lineLabel, g.Last, g.Events);
        }).ToList();
    }

    public async Task<IReadOnlyList<AgentRunLogEntryDto>> GetConversationLogAsync(Guid conversationId, CancellationToken cancellationToken = default)
        => await _db.AiAgentRunLogs.AsNoTracking()
            .Where(l => l.ConversationId == conversationId)
            .OrderBy(l => l.OccurredAt)
            .Select(l => new AgentRunLogEntryDto(l.OccurredAt, l.Kind, l.Title, l.Content, l.Response))
            .ToListAsync(cancellationToken);
}
