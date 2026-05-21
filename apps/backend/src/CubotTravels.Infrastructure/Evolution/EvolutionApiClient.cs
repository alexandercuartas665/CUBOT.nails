using CubotTravels.Application.Admin;

namespace CubotTravels.Infrastructure.Evolution;

/// <summary>
/// Cliente HTTP del servidor Evolution API. Por ahora solo comprueba conexion + API key
/// (GET /instance/fetchInstances). Se ampliara con crear instancia, QR y envio de mensajes.
/// </summary>
public sealed class EvolutionApiClient : IEvolutionApiClient
{
    private readonly HttpClient _http;

    public EvolutionApiClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<EvolutionPingResult> CheckAsync(string baseUrl, string apiKey, CancellationToken cancellationToken = default)
    {
        var url = $"{baseUrl.TrimEnd('/')}/instance/fetchInstances";
        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.TryAddWithoutValidation("apikey", apiKey);
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(10));

            using var response = await _http.SendAsync(request, cts.Token);
            var code = (int)response.StatusCode;
            if (response.IsSuccessStatusCode)
            {
                return new EvolutionPingResult(Reachable: true, Authenticated: true, code, "OK");
            }
            if (code is 401 or 403)
            {
                return new EvolutionPingResult(Reachable: true, Authenticated: false, code, "Unauthorized");
            }
            return new EvolutionPingResult(Reachable: true, Authenticated: false, code, $"HTTP {code}");
        }
        catch (Exception ex)
        {
            return new EvolutionPingResult(Reachable: false, Authenticated: false, null, ex.GetType().Name);
        }
    }
}
