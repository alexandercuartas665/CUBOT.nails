using CubotTravels.Domain.Enums;

namespace CubotTravels.Application.Admin;

public interface ISubscriptionAdminService
{
    /// <summary>Devuelve null si el tenant o el plan no existen.</summary>
    Task<SubscriptionDetail?> AssignAsync(AssignSubscriptionRequest request, Guid actorUserId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Cambio de plan en autoservicio (lo solicita el cliente). Aplica de inmediato: crea una
    /// suscripcion activa con el nuevo plan y recalcula el periodo. El cobro/prorrateo real
    /// (Wompi) se difiere a una fase posterior. Devuelve null si el tenant o el plan no existen.
    /// </summary>
    Task<SubscriptionDetail?> ChangePlanAsync(Guid tenantId, Guid planId, BillingFrequency frequency, Guid actorUserId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<SubscriptionDetail>> ListByTenantAsync(Guid tenantId, CancellationToken cancellationToken = default);
}
