using CubotTravels.Domain.Common;
using CubotTravels.Domain.Enums;

namespace CubotTravels.Domain.Entities;

/// <summary>
/// Mensaje de una conversacion (modulo 2.3). Entidad TENANT-SCOPED. ExternalId (id de Evolution)
/// da idempotencia a la ingesta entrante: indice unico (TenantId, ExternalId).
/// </summary>
public class Message : TenantEntity
{
    public Guid ConversationId { get; set; }
    public Conversation? Conversation { get; set; }
    public MessageDirection Direction { get; set; }
    public string? ExternalId { get; set; }
    public string Body { get; set; } = null!;
    public string MessageType { get; set; } = "text";
    public DateTimeOffset SentAt { get; set; }
}
