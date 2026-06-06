using CubotNails.Domain.Common;

namespace CubotNails.Domain.Entities;

/// <summary>
/// Servicio del catalogo del salon (manicure, pedicure, acrilicas...). Entidad TENANT-SCOPED.
/// La duracion define cuanto ocupa la cita; el precio es el precio base (un asesor de imagen
/// puede sobreescribirlo via <see cref="ResourceServiceLink"/>).
/// </summary>
public class Service : TenantEntity
{
    public string Name { get; set; } = null!;
    /// <summary>Descripcion del servicio (que es, en que consiste). Opcional.</summary>
    public string? Description { get; set; }
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public string? Currency { get; set; }
    public string? Category { get; set; }
    public string? Color { get; set; }
    public bool IsActive { get; set; } = true;
}
