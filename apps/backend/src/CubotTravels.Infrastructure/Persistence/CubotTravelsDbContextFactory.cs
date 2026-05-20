using CubotTravels.Application.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CubotTravels.Infrastructure.Persistence;

/// <summary>
/// Factory para herramientas de diseno (dotnet ef). Permite crear el DbContext sin levantar
/// la aplicacion. La cadena real se toma de la variable de entorno CUBOT_DB_CONNECTION;
/// el fallback es solo un placeholder local (sin secreto real) suficiente para generar migraciones.
/// </summary>
public sealed class CubotTravelsDbContextFactory : IDesignTimeDbContextFactory<CubotTravelsDbContext>
{
    public CubotTravelsDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("CUBOT_DB_CONNECTION")
            ?? "Host=localhost;Port=5434;Database=cubot_travels_dev;Username=cubot;Password=postgres";

        var options = new DbContextOptionsBuilder<CubotTravelsDbContext>()
            .UseNpgsql(connectionString)
            .UseSnakeCaseNamingConvention()
            .Options;

        return new CubotTravelsDbContext(options, new DesignTimeTenantContext());
    }

    private sealed class DesignTimeTenantContext : ITenantContext
    {
        public Guid? TenantId => null;
        public Guid? UserId => null;
    }
}
