using CubotTravels.Domain.Enums;

namespace CubotTravels.Application.Admin;

public sealed record EvolutionMasterDto(
    string? BaseUrl,
    string? ApiKeyMasked,
    bool HasApiKey,
    EvolutionIntegrationStatus Status,
    DateTimeOffset? LastValidatedAt);

public sealed record SaveEvolutionMasterRequest(string? BaseUrl, string? ApiKey);

public sealed record EvolutionValidationResult(bool Ok, string Message);

/// <summary>Resultado de comprobar la conexion contra un servidor Evolution API.</summary>
public sealed record EvolutionPingResult(bool Reachable, bool Authenticated, int? StatusCode, string? Detail);

/// <summary>Cliente HTTP del servidor Evolution API. Implementacion en Infrastructure.</summary>
public interface IEvolutionApiClient
{
    /// <summary>Comprueba que el servidor responde y que la API key es valida (GET /instance/fetchInstances).</summary>
    Task<EvolutionPingResult> CheckAsync(string baseUrl, string apiKey, CancellationToken cancellationToken = default);
}

public interface IEvolutionMasterConfigService
{
    Task<EvolutionMasterDto?> GetAsync(CancellationToken cancellationToken = default);
    Task<EvolutionMasterDto> SaveAsync(SaveEvolutionMasterRequest request, Guid actorUserId, CancellationToken cancellationToken = default);

    /// <summary>Valida contra el servidor real (reachability + API key). Null si no hay config.</summary>
    Task<EvolutionValidationResult?> ValidateAsync(Guid actorUserId, CancellationToken cancellationToken = default);
}
