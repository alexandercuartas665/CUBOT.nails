using CubotTravels.Domain.Common;

namespace CubotTravels.Domain.Entities;

/// <summary>
/// Configuracion de Evolution API de un tenant (modulo 1.3). Entidad TENANT-SCOPED.
/// El token se guarda cifrado (ApiTokenEncrypted) y nunca se expone completo ni se loggea.
/// </summary>
public class TenantEvolutionConfig : TenantEntity
{
    public string BaseUrl { get; set; } = null!;
    public string InstanceName { get; set; } = null!;
    public string ApiTokenEncrypted { get; set; } = null!;
    public string? WebhookUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset? LastValidatedAt { get; set; }
}
