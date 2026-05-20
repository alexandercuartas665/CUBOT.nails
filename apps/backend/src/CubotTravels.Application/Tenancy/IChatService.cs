namespace CubotTravels.Application.Tenancy;

/// <summary>Lectura y envio de chat para asesores autenticados del tenant activo (modulo 2.3).</summary>
public interface IChatService
{
    Task<IReadOnlyList<ConversationDto>> ListConversationsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<MessageDto>> ListMessagesAsync(Guid conversationId, CancellationToken cancellationToken = default);

    /// <summary>Persiste un mensaje saliente. El envio real via Evolution Connector queda diferido. Null si la conversacion no existe en el tenant.</summary>
    Task<MessageDto?> SendAsync(Guid conversationId, string body, Guid actorUserId, CancellationToken cancellationToken = default);
}
