namespace CubotTravels.Application.Common.Auth;

/// <summary>Configuracion del JWT propio de CUBOT.travels (seccion "Jwt").</summary>
public sealed class JwtSettings
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "CubotTravels";
    public string Audience { get; set; } = "CubotTravels";
    public string SigningKey { get; set; } = string.Empty;
    public int AccessTokenMinutes { get; set; } = 60;
}
