using CubotTravels.Domain.Common;
using CubotTravels.Domain.Enums;

namespace CubotTravels.Domain.Entities;

/// <summary>
/// Usuario de plataforma (identidad). Puede operar uno o varios tenants via TenantUser
/// y/o ser operador del SaaS via PlatformRole. Entidad global. Ver Notas dev sec.1.5.
/// </summary>
public class PlatformUser : BaseEntity
{
    public string Email { get; set; } = null!;
    public bool EmailVerified { get; set; }
    public string? DisplayName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? GoogleSubject { get; set; }
    public string AuthProvider { get; set; } = "local";
    public PlatformUserStatus Status { get; set; } = PlatformUserStatus.Invited;
    public PlatformRole? PlatformRole { get; set; }
    public DateTimeOffset? LastLoginAt { get; set; }
}
