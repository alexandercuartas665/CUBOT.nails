using CubotNails.Application.Common;
using CubotNails.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CubotNails.Application.Tenancy;

public sealed record ServiceImageDto(Guid Id, string Url, string? FileName, int SortOrder);
public sealed record ServiceDto(Guid Id, string Name, int DurationMinutes, decimal Price, string? Category, string? Color, bool IsActive, string? Description = null, IReadOnlyList<ServiceImageDto>? Images = null);
public sealed record SaveServiceRequest(string Name, int DurationMinutes, decimal Price, string? Category, string? Color, string? Description = null);

/// <summary>Catalogo de servicios del salon (Servicios). Tenant-scoped CRUD. Las imagenes (archivos en
/// wwwroot/uploads/services) las sube la UI; aqui solo se guarda la URL.</summary>
public interface IServiceCatalogService
{
    Task<IReadOnlyList<ServiceDto>> ListAsync(bool includeInactive = false, CancellationToken cancellationToken = default);
    Task<ServiceDto?> GetAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ServiceDto?> CreateAsync(SaveServiceRequest request, Guid actorUserId, CancellationToken cancellationToken = default);
    Task<ServiceDto?> UpdateAsync(Guid id, SaveServiceRequest request, Guid actorUserId, CancellationToken cancellationToken = default);
    Task<bool> SetActiveAsync(Guid id, bool isActive, Guid actorUserId, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, Guid actorUserId, CancellationToken cancellationToken = default);

    Task<ServiceImageDto?> AddImageAsync(Guid serviceId, string url, string? fileName, Guid actorUserId, CancellationToken cancellationToken = default);
    Task<bool> RemoveImageAsync(Guid imageId, Guid actorUserId, CancellationToken cancellationToken = default);
}

public sealed class ServiceCatalogService : IServiceCatalogService
{
    private readonly IApplicationDbContext _db;
    private readonly ITenantContext _tenantContext;
    private readonly IAuditWriter _audit;

    public ServiceCatalogService(IApplicationDbContext db, ITenantContext tenantContext, IAuditWriter audit)
    {
        _db = db; _tenantContext = tenantContext; _audit = audit;
    }

    public async Task<IReadOnlyList<ServiceDto>> ListAsync(bool includeInactive = false, CancellationToken cancellationToken = default)
    {
        var services = await _db.Services.AsNoTracking()
            .Where(s => includeInactive || s.IsActive)
            .OrderBy(s => s.Name)
            .ToListAsync(cancellationToken);
        if (services.Count == 0) { return new List<ServiceDto>(); }
        var ids = services.Select(s => s.Id).ToList();
        var images = await _db.ServiceImages.AsNoTracking()
            .Where(i => ids.Contains(i.ServiceId)).OrderBy(i => i.SortOrder).ToListAsync(cancellationToken);
        var byService = images.GroupBy(i => i.ServiceId).ToDictionary(g => g.Key, g => (IEnumerable<ServiceImage>)g);
        return services.Select(s => Map(s, byService.TryGetValue(s.Id, out var im) ? im : Enumerable.Empty<ServiceImage>())).ToList();
    }

    public async Task<ServiceDto?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var s = await _db.Services.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (s is null) { return null; }
        var images = await _db.ServiceImages.AsNoTracking()
            .Where(i => i.ServiceId == id).OrderBy(i => i.SortOrder).ToListAsync(cancellationToken);
        return Map(s, images);
    }

    public async Task<ServiceDto?> CreateAsync(SaveServiceRequest request, Guid actorUserId, CancellationToken cancellationToken = default)
    {
        if (_tenantContext.TenantId is not Guid tenantId) { return null; }
        var name = (request.Name ?? string.Empty).Trim();
        if (name.Length == 0) { return null; }

        var entity = new Service
        {
            TenantId = tenantId,
            Name = name,
            Description = Clean(request.Description),
            DurationMinutes = Math.Max(0, request.DurationMinutes),
            Price = Math.Max(0m, request.Price),
            Category = Clean(request.Category),
            Color = Clean(request.Color),
            IsActive = true
        };
        _db.Services.Add(entity);
        _audit.Write(actorUserId, "service.create", nameof(Service), entity.Id, null, new { entity.Name, entity.Price }, tenantId);
        await _db.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<ServiceDto?> UpdateAsync(Guid id, SaveServiceRequest request, Guid actorUserId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Services.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null) { return null; }
        var name = (request.Name ?? string.Empty).Trim();
        if (name.Length == 0) { return null; }

        entity.Name = name;
        entity.Description = Clean(request.Description);
        entity.DurationMinutes = Math.Max(0, request.DurationMinutes);
        entity.Price = Math.Max(0m, request.Price);
        entity.Category = Clean(request.Category);
        entity.Color = Clean(request.Color);
        _audit.Write(actorUserId, "service.update", nameof(Service), entity.Id, null, new { entity.Name, entity.Price }, entity.TenantId);
        await _db.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> SetActiveAsync(Guid id, bool isActive, Guid actorUserId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Services.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null) { return false; }
        entity.IsActive = isActive;
        _audit.Write(actorUserId, "service.set-active", nameof(Service), entity.Id, null, new { isActive }, entity.TenantId);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, Guid actorUserId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Services.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null) { return false; }
        var links = await _db.ResourceServiceLinks.Where(l => l.ServiceId == id).ToListAsync(cancellationToken);
        _db.ResourceServiceLinks.RemoveRange(links);
        _db.ServiceImages.RemoveRange(await _db.ServiceImages.Where(i => i.ServiceId == id).ToListAsync(cancellationToken));
        _db.Services.Remove(entity);
        _audit.Write(actorUserId, "service.delete", nameof(Service), entity.Id, new { entity.Name }, null, entity.TenantId);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<ServiceImageDto?> AddImageAsync(Guid serviceId, string url, string? fileName, Guid actorUserId, CancellationToken cancellationToken = default)
    {
        if (_tenantContext.TenantId is not Guid tenantId) { return null; }
        if (!await _db.Services.AnyAsync(s => s.Id == serviceId, cancellationToken)) { return null; }
        var next = (await _db.ServiceImages.Where(i => i.ServiceId == serviceId).Select(i => (int?)i.SortOrder).MaxAsync(cancellationToken) ?? -1) + 1;
        var img = new ServiceImage { TenantId = tenantId, ServiceId = serviceId, Url = url.Trim(), FileName = fileName, SortOrder = next };
        _db.ServiceImages.Add(img);
        await _db.SaveChangesAsync(cancellationToken);
        return new ServiceImageDto(img.Id, img.Url, img.FileName, img.SortOrder);
    }

    public async Task<bool> RemoveImageAsync(Guid imageId, Guid actorUserId, CancellationToken cancellationToken = default)
    {
        var img = await _db.ServiceImages.FirstOrDefaultAsync(i => i.Id == imageId, cancellationToken);
        if (img is null) { return false; }
        _db.ServiceImages.Remove(img);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static string? Clean(string? s) => string.IsNullOrWhiteSpace(s) ? null : s.Trim();
    private static ServiceDto Map(Service s, IEnumerable<ServiceImage>? images = null) =>
        new(s.Id, s.Name, s.DurationMinutes, s.Price, s.Category, s.Color, s.IsActive, s.Description,
            (images ?? Enumerable.Empty<ServiceImage>()).OrderBy(i => i.SortOrder)
                .Select(i => new ServiceImageDto(i.Id, i.Url, i.FileName, i.SortOrder)).ToList());
}
