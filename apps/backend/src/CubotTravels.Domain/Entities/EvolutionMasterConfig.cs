using CubotTravels.Domain.Common;
using CubotTravels.Domain.Enums;

namespace CubotTravels.Domain.Entities;

/// <summary>
/// Servidor Evolution API maestro de la plataforma (Super Admin SaaS). GLOBAL y singleton:
/// las agencias pueden usar este servidor compartido o configurar uno propio. La API key se
/// guarda cifrada (ISecretProtector) y nunca se expone completa ni se loggea.
/// </summary>
public class EvolutionMasterConfig : BaseEntity
{
    /// <summary>URL base del servidor Evolution API (p.ej. https://evo.cubot.com.co).</summary>
    public string? BaseUrl { get; set; }

    /// <summary>API key global del servidor (AUTHENTICATION_API_KEY) cifrada en reposo.</summary>
    public string? ApiKeyEncrypted { get; set; }

    public EvolutionIntegrationStatus Status { get; set; } = EvolutionIntegrationStatus.NotConfigured;
    public DateTimeOffset? LastValidatedAt { get; set; }
}
