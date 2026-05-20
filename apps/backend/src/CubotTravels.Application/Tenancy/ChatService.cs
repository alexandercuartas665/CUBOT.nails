using CubotTravels.Application.Common;
using CubotTravels.Domain.Entities;
using CubotTravels.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CubotTravels.Application.Tenancy;

public sealed class ChatService : IChatService
{
    private readonly IApplicationDbContext _db;
    private readonly TimeProvider _timeProvider;

    public ChatService(IApplicationDbContext db, TimeProvider timeProvider)
    {
        _db = db;
        _timeProvider = timeProvider;
    }

    public async Task<IReadOnlyList<ConversationDto>> ListConversationsAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Conversations
            .AsNoTracking()
            .OrderByDescending(c => c.LastMessageAt)
            .Select(c => new ConversationDto(c.Id, c.ContactPhone, c.ContactName, c.LeadId, c.LastMessageAt))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<MessageDto>> ListMessagesAsync(Guid conversationId, CancellationToken cancellationToken = default)
    {
        return await _db.Messages
            .AsNoTracking()
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.SentAt)
            .Select(m => new MessageDto(m.Id, m.ConversationId, m.Direction, m.Body, m.MessageType, m.SentAt))
            .ToListAsync(cancellationToken);
    }

    public async Task<MessageDto?> SendAsync(Guid conversationId, string body, Guid actorUserId, CancellationToken cancellationToken = default)
    {
        var conversation = await _db.Conversations.FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);
        if (conversation is null)
        {
            return null;
        }

        var now = _timeProvider.GetUtcNow();
        var message = new Message
        {
            TenantId = conversation.TenantId,
            ConversationId = conversation.Id,
            Direction = MessageDirection.Outbound,
            Body = body,
            MessageType = "text",
            SentAt = now
        };
        _db.Messages.Add(message);
        conversation.LastMessageAt = now;

        await _db.SaveChangesAsync(cancellationToken);
        return new MessageDto(message.Id, message.ConversationId, message.Direction, message.Body, message.MessageType, message.SentAt);
    }
}
