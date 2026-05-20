using CubotTravels.Domain.Enums;

namespace CubotTravels.Application.Tenancy;

public sealed record ConversationDto(
    Guid Id,
    string ContactPhone,
    string? ContactName,
    Guid? LeadId,
    DateTimeOffset? LastMessageAt);

public sealed record MessageDto(
    Guid Id,
    Guid ConversationId,
    MessageDirection Direction,
    string Body,
    string MessageType,
    DateTimeOffset SentAt);

/// <summary>Payload normalizado del webhook entrante (lo produce el Evolution Connector).</summary>
public sealed record IngestMessageRequest(
    string ContactPhone,
    string? ContactName,
    string ExternalMessageId,
    string Body,
    string? MessageType = null,
    DateTimeOffset? SentAt = null);

public sealed record SendMessageRequest(string Body);
