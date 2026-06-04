using CubotNails.Application.Common;
using CubotNails.Domain.Entities;
using CubotNails.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CubotNails.Application.Tenancy;

/// <summary>
/// Orquesta la atencion REAL de un agente de IA sobre una conversacion de WhatsApp (linea + contacto).
/// Reconstruye la conversacion como turnos, ejecuta al agente (con sus herramientas de agenda), persiste
/// la bitacora de atencion y envia la respuesta por la linea. La sesion de cache es la conversacion, asi
/// que los datos de un cliente nunca se mezclan con los de otro. Se ejecuta en un scope con el TenantId
/// fijado por el despachador (atencion disparada por webhook, sin usuario autenticado).
/// </summary>
public interface IAgentConversationService
{
    Task RunAsync(Guid conversationId, CancellationToken cancellationToken = default);
}

public sealed class AgentConversationService : IAgentConversationService
{
    private readonly IApplicationDbContext _db;
    private readonly IAiInferenceService _inference;
    private readonly IChatService _chat;
    private readonly IAgentAssetReader _assets;

    // Cuantos mensajes recientes se reconstruyen como contexto del agente.
    private const int MaxTurns = 30;

    public AgentConversationService(IApplicationDbContext db, IAiInferenceService inference, IChatService chat, IAgentAssetReader assets)
    {
        _db = db;
        _inference = inference;
        _chat = chat;
        _assets = assets;
    }

    public async Task RunAsync(Guid conversationId, CancellationToken cancellationToken = default)
    {
        // El TenantId lo fija el despachador en el scope; el query filter resuelve el tenant correcto.
        var conv = await _db.Conversations.AsNoTracking().FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);
        if (conv?.WhatsAppLineId is not Guid lineId) { return; }

        // Hay un agente conectado a esta linea?
        var binding = await _db.AiAgentLineBindings.AsNoTracking()
            .FirstOrDefaultAsync(b => b.WhatsAppLineId == lineId && b.IsConnected, cancellationToken);
        if (binding is null) { return; }

        var agent = await _db.AiAgents.AsNoTracking().FirstOrDefaultAsync(a => a.Id == binding.AgentId && a.IsActive, cancellationToken);
        if (agent is null) { return; }

        // Reconstruimos la conversacion como turnos (lo mas reciente al final).
        var messages = await _db.Messages.AsNoTracking()
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.SentAt)
            .Take(MaxTurns)
            .ToListAsync(cancellationToken);
        messages.Reverse();
        if (messages.Count == 0) { return; }

        // Si el ultimo mensaje ya es nuestro (saliente), no hay nada nuevo que responder.
        if (messages[^1].Direction == MessageDirection.Outbound) { return; }

        var turns = messages.Select(m => new AiChatTurn(
            m.Direction == MessageDirection.Inbound ? "user" : "model",
            string.IsNullOrWhiteSpace(m.Body) ? (m.MediaType == MessageMediaType.None ? "(mensaje vacio)" : "(adjunto)") : m.Body))
            .ToList();

        // Actor del sistema (el agente actua de forma autonoma); la auditoria queda sin usuario humano.
        var actor = Guid.Empty;

        var result = await _inference.RespondAsync(agent.Id, conversationId, turns, binding.AutoConfirm, actor, cancellationToken);

        // Bitacora: mensaje recibido + prompts/herramientas + respuesta.
        await LogAsync(conv.TenantId, conversationId, agent.Id, AiAgentRunLogKind.Inbound,
            "Mensaje recibido", messages[^1].Body, null, cancellationToken);

        if (result.DebugPrompts is not null)
        {
            foreach (var d in result.DebugPrompts)
            {
                var kind = d.Title.StartsWith("Herramienta", StringComparison.OrdinalIgnoreCase)
                    || d.Title.StartsWith("IA solicito", StringComparison.OrdinalIgnoreCase)
                    ? AiAgentRunLogKind.Tool : AiAgentRunLogKind.Prompt;
                await LogAsync(conv.TenantId, conversationId, agent.Id, kind, d.Title, d.Content, d.Response, cancellationToken);
            }
        }

        if (!result.Ok)
        {
            await LogAsync(conv.TenantId, conversationId, agent.Id, AiAgentRunLogKind.Error,
                "El agente no respondio", result.Error, null, cancellationToken);
            return;
        }

        // Enviar la respuesta por la linea (persiste el saliente y lo difunde).
        if (!string.IsNullOrWhiteSpace(result.Text))
        {
            await _chat.SendViaLineAsync(conversationId, lineId, result.Text!, actor, cancellationToken);
        }

        if (result.Attachments is { Count: > 0 })
        {
            foreach (var a in result.Attachments)
            {
                await SendAttachmentAsync(conversationId, lineId, a, actor, cancellationToken);
            }
        }

        await LogAsync(conv.TenantId, conversationId, agent.Id, AiAgentRunLogKind.Reply,
            "Respuesta enviada", result.Text, AttachmentSummary(result.Attachments), cancellationToken);
    }

    private async Task SendAttachmentAsync(Guid conversationId, Guid lineId, AiChatAttachment a, Guid actor, CancellationToken ct)
    {
        switch (a.ResourceType)
        {
            case AgentResourceType.Text:
                if (!string.IsNullOrWhiteSpace(a.Detail)) { await _chat.SendViaLineAsync(conversationId, lineId, a.Detail!, actor, ct); }
                break;
            case AgentResourceType.Location:
                var parts = (a.Detail ?? "").Split(',');
                if (parts.Length == 2
                    && double.TryParse(parts[0], System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var lat)
                    && double.TryParse(parts[1], System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var lng))
                {
                    await _chat.SendLocationViaLineAsync(conversationId, lineId, lat, lng, a.Name, actor, ct);
                }
                break;
            default:
                var b64 = await _assets.ReadBase64Async(a.FileUrl, ct);
                if (!string.IsNullOrEmpty(b64))
                {
                    var mt = a.ResourceType switch
                    {
                        AgentResourceType.Image => MessageMediaType.Image,
                        AgentResourceType.Video => MessageMediaType.Video,
                        AgentResourceType.Audio => MessageMediaType.Audio,
                        _ => MessageMediaType.Document
                    };
                    await _chat.SendMediaViaLineAsync(conversationId, lineId, mt, b64!, a.FileUrl ?? "", null, a.FileName, a.Detail, actor, ct);
                }
                break;
        }
    }

    private async Task LogAsync(Guid tenantId, Guid conversationId, Guid agentId, AiAgentRunLogKind kind, string title, string? content, string? response, CancellationToken ct)
    {
        _db.AiAgentRunLogs.Add(new AiAgentRunLog
        {
            TenantId = tenantId,
            ConversationId = conversationId,
            AgentId = agentId,
            OccurredAt = DateTimeOffset.UtcNow,
            Kind = kind,
            Title = title.Length > 300 ? title[..300] : title,
            Content = content,
            Response = response
        });
        await _db.SaveChangesAsync(ct);
    }

    private static string? AttachmentSummary(IReadOnlyList<AiChatAttachment>? attachments)
        => attachments is { Count: > 0 } ? "Recursos: " + string.Join(", ", attachments.Select(a => $"{a.Name} ({a.ResourceType})")) : null;
}
