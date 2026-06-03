using CubotNails.Application.Common;
using CubotNails.Domain.Entities;
using CubotNails.Domain.Enums;
using CubotNails.Infrastructure.Persistence;
using CubotNails.Infrastructure.Persistence.Interceptors;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;
using Xunit;

namespace CubotNails.Integration.Tests;

/// <summary>
/// Hito critico del producto (Modulo 2.3): el motor de agenda NUNCA permite overbooking.
/// La garantia real es el indice unico parcial UNIQUE(tenant, recurso, fecha, hora) sobre citas
/// NO canceladas. Estos tests prueban que (a) dos reservas simultaneas en el mismo cupo dejan
/// exactamente una cita, y (b) cancelar libera el cupo para volver a reservar.
/// </summary>
public sealed class AppointmentOverbookingTests : IAsyncLifetime
{
    private readonly PostgreSqlContainer _db = new PostgreSqlBuilder("postgres:16-alpine").Build();

    public async Task InitializeAsync()
    {
        await _db.StartAsync();
        await using var ctx = CreateContext(null);
        await ctx.Database.MigrateAsync();
    }

    public async Task DisposeAsync() => await _db.DisposeAsync();

    [Fact]
    public async Task TwoConcurrentBookings_OnSameSlot_OnlyOneSucceeds()
    {
        var (tenant, resourceId) = await SeedTenantWithResourceAsync();
        var date = new DateOnly(2026, 6, 10);
        var time = new TimeOnly(9, 0);

        async Task<bool> TryBookAsync()
        {
            await using var ctx = CreateContext(tenant);
            ctx.Appointments.Add(new Appointment
            {
                TenantId = tenant, ResourceId = resourceId, AppointmentDate = date, StartTime = time,
                DurationMinutes = 45, Status = AppointmentStatus.Scheduled
            });
            try { await ctx.SaveChangesAsync(); return true; }
            catch (DbUpdateException) { return false; } // 23505 unique_violation -> el cupo ya se ocupo
        }

        // Cinco recepcionistas/clientes/IA intentando el MISMO cupo a la vez.
        var results = await Task.WhenAll(TryBookAsync(), TryBookAsync(), TryBookAsync(), TryBookAsync(), TryBookAsync());

        Assert.Equal(1, results.Count(ok => ok));

        await using var verify = CreateContext(tenant);
        var rows = await verify.Appointments.CountAsync(a => a.ResourceId == resourceId && a.AppointmentDate == date && a.StartTime == time);
        Assert.Equal(1, rows);
    }

    [Fact]
    public async Task CancellingAppointment_FreesTheSlot_ForRebooking()
    {
        var (tenant, resourceId) = await SeedTenantWithResourceAsync();
        var date = new DateOnly(2026, 6, 11);
        var time = new TimeOnly(10, 0);

        Guid firstId;
        await using (var ctx = CreateContext(tenant))
        {
            var a = new Appointment { TenantId = tenant, ResourceId = resourceId, AppointmentDate = date, StartTime = time, DurationMinutes = 45, Status = AppointmentStatus.Scheduled };
            ctx.Appointments.Add(a);
            await ctx.SaveChangesAsync();
            firstId = a.Id;
        }

        // Reservar el MISMO cupo mientras la primera sigue activa debe fallar.
        await using (var ctx = CreateContext(tenant))
        {
            ctx.Appointments.Add(new Appointment { TenantId = tenant, ResourceId = resourceId, AppointmentDate = date, StartTime = time, DurationMinutes = 45, Status = AppointmentStatus.Scheduled });
            await Assert.ThrowsAsync<DbUpdateException>(() => ctx.SaveChangesAsync());
        }

        // Cancelar la primera libera el cupo (el indice unico es parcial: excluye Cancelled).
        await using (var ctx = CreateContext(tenant))
        {
            var a = await ctx.Appointments.FirstAsync(x => x.Id == firstId);
            a.Status = AppointmentStatus.Cancelled;
            await ctx.SaveChangesAsync();
        }

        // Ahora si se puede volver a reservar el mismo cupo.
        await using (var ctx = CreateContext(tenant))
        {
            ctx.Appointments.Add(new Appointment { TenantId = tenant, ResourceId = resourceId, AppointmentDate = date, StartTime = time, DurationMinutes = 45, Status = AppointmentStatus.Scheduled });
            await ctx.SaveChangesAsync();
        }

        await using (var verify = CreateContext(tenant))
        {
            var active = await verify.Appointments.CountAsync(a => a.ResourceId == resourceId && a.AppointmentDate == date && a.StartTime == time && a.Status != AppointmentStatus.Cancelled);
            Assert.Equal(1, active);
        }
    }

    private async Task<(Guid tenant, Guid resourceId)> SeedTenantWithResourceAsync()
    {
        var tenant = Guid.CreateVersion7();
        var resourceId = Guid.CreateVersion7();
        await using (var ctx = CreateContext(null))
        {
            ctx.Tenants.Add(new Tenant { Id = tenant, Name = "Bella Nails Studio" });
            await ctx.SaveChangesAsync();
        }
        await using (var ctx = CreateContext(tenant))
        {
            ctx.Resources.Add(new Resource { Id = resourceId, TenantId = tenant, Name = "Ana Maria Reyes", Kind = ResourceKind.Image });
            await ctx.SaveChangesAsync();
        }
        return (tenant, resourceId);
    }

    private CubotNailsDbContext CreateContext(Guid? tenantId)
    {
        var tenantContext = new FixedTenantContext(tenantId);
        var options = new DbContextOptionsBuilder<CubotNailsDbContext>()
            .UseNpgsql(_db.GetConnectionString())
            .UseSnakeCaseNamingConvention()
            .AddInterceptors(new AuditableTenantInterceptor(tenantContext, TimeProvider.System))
            .Options;
        return new CubotNailsDbContext(options, tenantContext);
    }

    private sealed class FixedTenantContext(Guid? tenantId) : ITenantContext
    {
        public Guid? TenantId { get; } = tenantId;
        public Guid? UserId => null;
    }
}
