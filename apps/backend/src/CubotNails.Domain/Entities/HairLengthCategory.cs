using CubotNails.Domain.Common;

namespace CubotNails.Domain.Entities;

/// <summary>
/// Categoria de largo de cabello DEFINIDA POR EL SALON (modulo Medidas de cabello, capa 2). TENANT-SCOPED.
/// El salon arma su propia escala (los nombres y cuantas quiera) y sube imagenes de referencia que
/// "le ensenan" a la IA que es cada largo, para luego clasificar la foto de una clienta.
/// </summary>
public class HairLengthCategory : TenantEntity
{
    public string Name { get; set; } = null!;

    /// <summary>Descripcion del largo (referencia para la IA y el equipo): "hasta los hombros", etc.</summary>
    public string? Description { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

/// <summary>Imagen de referencia de una categoria de largo (archivo en wwwroot/uploads/hair). TENANT-SCOPED.
/// NO son fotos de clientas: son ejemplos del largo, por eso pueden ser publicas.</summary>
public class HairLengthReferenceImage : TenantEntity
{
    public Guid CategoryId { get; set; }
    public HairLengthCategory? Category { get; set; }
    public string Url { get; set; } = null!;
    public string? FileName { get; set; }
    public int SortOrder { get; set; }
}
