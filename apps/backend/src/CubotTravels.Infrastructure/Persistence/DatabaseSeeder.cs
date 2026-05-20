using CubotTravels.Application.Common.Auth;
using CubotTravels.Domain.Entities;
using CubotTravels.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CubotTravels.Infrastructure.Persistence;

/// <summary>
/// Siembra datos iniciales de desarrollo de forma idempotente: un Super Admin, un plan,
/// una agencia demo con su administrador y una suscripcion. Solo crea si la base esta vacia.
/// </summary>
public sealed class DatabaseSeeder
{
    public const string SuperAdminEmail = "admin@cubot.travels";
    public const string SuperAdminPassword = "Admin123*";
    public const string TenantAdminEmail = "demo-admin@cubot.travels";
    public const string TenantAdminPassword = "Demo123*";

    private readonly CubotTravelsDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(CubotTravelsDbContext db, IPasswordHasher hasher, ILogger<DatabaseSeeder> logger)
    {
        _db = db;
        _hasher = hasher;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _db.PlatformUsers.IgnoreQueryFilters().AnyAsync(cancellationToken))
        {
            return;
        }

        var superAdmin = new PlatformUser
        {
            Email = SuperAdminEmail,
            EmailVerified = true,
            DisplayName = "Super Admin",
            Status = PlatformUserStatus.Active,
            PlatformRole = PlatformRole.SuperAdmin,
            PasswordHash = _hasher.Hash(SuperAdminPassword)
        };

        var plan = new SaasPlan
        {
            Name = "Plan Inicial",
            Description = "Plan de arranque para agencias pequenas.",
            MonthlyPrice = 99000m,
            YearlyPrice = 990000m,
            Currency = "COP",
            IsActive = true,
            Limits =
            [
                new SaasPlanLimit { LimitKey = "max_users", LimitValue = 10, LimitUnit = "users", EnforcementMode = LimitEnforcementMode.Hard },
                new SaasPlanLimit { LimitKey = "max_whatsapp_lines", LimitValue = 2, LimitUnit = "lines", EnforcementMode = LimitEnforcementMode.Hard },
                new SaasPlanLimit { LimitKey = "max_ai_tokens_monthly", LimitValue = 100000, LimitUnit = "tokens", EnforcementMode = LimitEnforcementMode.Soft }
            ]
        };

        var tenant = new Tenant
        {
            Name = "Agencia Demo",
            LegalName = "Agencia Demo SAS",
            TaxId = "900123456-7",
            Country = "CO",
            Currency = "COP",
            Status = TenantStatus.Active,
            Kind = TenantKind.Demo
        };

        var tenantAdmin = new PlatformUser
        {
            Email = TenantAdminEmail,
            EmailVerified = true,
            DisplayName = "Administrador Agencia Demo",
            Status = PlatformUserStatus.Active,
            PasswordHash = _hasher.Hash(TenantAdminPassword)
        };

        _db.PlatformUsers.AddRange(superAdmin, tenantAdmin);
        _db.SaasPlans.Add(plan);
        _db.Tenants.Add(tenant);

        _db.TenantSubscriptions.Add(new TenantSubscription
        {
            TenantId = tenant.Id,
            PlanId = plan.Id,
            Status = SubscriptionStatus.Active,
            BillingFrequency = BillingFrequency.Monthly,
            StartsAt = DateTimeOffset.UtcNow,
            CurrentPeriodEndsAt = DateTimeOffset.UtcNow.AddMonths(1)
        });

        _db.TenantUsers.Add(new TenantUser
        {
            TenantId = tenant.Id,
            PlatformUserId = tenantAdmin.Id,
            Email = TenantAdminEmail,
            TenantRole = TenantRole.Owner,
            Status = PlatformUserStatus.Active
        });

        _db.TenantConfigurations.AddRange(
            new TenantConfiguration { TenantId = tenant.Id, ConfigKey = "tono", ConfigValue = "cordial" },
            new TenantConfiguration { TenantId = tenant.Id, ConfigKey = "horario", ConfigValue = "8-18" });

        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogWarning(
            "Seed inicial creado. Super Admin: {SuperAdmin} / {SuperPass}. Admin agencia: {TenantAdmin} / {TenantPass}",
            SuperAdminEmail, SuperAdminPassword, TenantAdminEmail, TenantAdminPassword);
    }
}
