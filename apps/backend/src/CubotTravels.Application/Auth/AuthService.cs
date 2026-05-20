using CubotTravels.Application.Common;
using CubotTravels.Application.Common.Auth;
using CubotTravels.Domain.Entities;
using CubotTravels.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CubotTravels.Application.Auth;

public sealed class AuthService : IAuthService
{
    // Estados de tenant que permiten operar/iniciar sesion. Suspended/Blocked/Closing/Archived no.
    private static readonly TenantStatus[] OperableStatuses =
    [
        TenantStatus.Trial,
        TenantStatus.Active,
        TenantStatus.PendingPayment,
        TenantStatus.PastDue
    ];

    private readonly IApplicationDbContext _db;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _tokenService;

    public AuthService(IApplicationDbContext db, IPasswordHasher passwordHasher, IJwtTokenService tokenService)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<TokenResponse?> AuthenticateAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var email = Normalize(request.Email);

        var user = await _db.PlatformUsers
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

        if (user is null
            || user.Status != PlatformUserStatus.Active
            || string.IsNullOrEmpty(user.PasswordHash)
            || !_passwordHasher.Verify(user.PasswordHash, request.Password))
        {
            return null;
        }

        var memberships = await GetMembershipsAsync(user.Id, cancellationToken);

        // Si pidio un tenant explicito, debe pertenecer a el.
        if (request.TenantId is Guid requestedTenant)
        {
            var match = memberships.FirstOrDefault(m => m.TenantId == requestedTenant);
            return match is null ? null : BuildToken(user, match);
        }

        return memberships.Count switch
        {
            1 => BuildToken(user, memberships[0]),
            > 1 => BuildToken(user, membership: null, tenantSelectionRequired: true),
            _ => BuildToken(user, membership: null)
        };
    }

    public async Task<TokenResponse?> SwitchTenantAsync(Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        var user = await _db.PlatformUsers.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user is null || user.Status != PlatformUserStatus.Active)
        {
            return null;
        }

        var memberships = await GetMembershipsAsync(userId, cancellationToken);
        var match = memberships.FirstOrDefault(m => m.TenantId == tenantId);
        return match is null ? null : BuildToken(user, match);
    }

    public async Task<MeResponse?> GetMeAsync(Guid userId, Guid? currentTenantId, CancellationToken cancellationToken = default)
    {
        var user = await _db.PlatformUsers.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user is null)
        {
            return null;
        }

        var memberships = await GetMembershipsAsync(userId, cancellationToken);
        var tenants = memberships
            .Select(m => new TenantSummary(m.TenantId, m.Name, m.TenantRole.ToString()))
            .ToList();

        return new MeResponse(
            user.Id,
            user.Email,
            user.DisplayName,
            user.PlatformRole?.ToString(),
            currentTenantId,
            tenants);
    }

    private async Task<List<Membership>> GetMembershipsAsync(Guid userId, CancellationToken cancellationToken)
    {
        // IgnoreQueryFilters: resolver las agencias del usuario es una operacion cross-tenant legitima
        // que ocurre antes de fijar el tenant activo.
        return await _db.TenantUsers
            .IgnoreQueryFilters()
            .Where(tu => tu.PlatformUserId == userId && tu.Status == PlatformUserStatus.Active)
            .Join(
                _db.Tenants.Where(t => OperableStatuses.Contains(t.Status)),
                tu => tu.TenantId,
                t => t.Id,
                (tu, t) => new Membership(t.Id, t.Name, tu.TenantRole))
            .ToListAsync(cancellationToken);
    }

    private TokenResponse BuildToken(PlatformUser user, Membership? membership, bool tenantSelectionRequired = false)
    {
        var claims = new TokenClaims(
            UserId: user.Id,
            Email: user.Email,
            DisplayName: user.DisplayName,
            TenantId: membership?.TenantId,
            PlatformRole: user.PlatformRole?.ToString(),
            TenantRole: membership?.TenantRole.ToString(),
            Permissions: []);

        var issued = _tokenService.Create(claims);
        return new TokenResponse(issued.AccessToken, issued.ExpiresAt, membership?.TenantId, tenantSelectionRequired);
    }

    private static string Normalize(string email) => email.Trim().ToLowerInvariant();

    private sealed record Membership(Guid TenantId, string Name, TenantRole TenantRole);
}
