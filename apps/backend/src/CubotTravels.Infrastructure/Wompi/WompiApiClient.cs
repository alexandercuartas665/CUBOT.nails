using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using CubotTravels.Application.Admin;
using CubotTravels.Application.Common;
using CubotTravels.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CubotTravels.Infrastructure.Wompi;

/// <summary>
/// Implementacion del cliente de la API de Wompi. Lee la config maestra (llaves cifradas) y
/// llama al ambiente correspondiente. No maneja datos de tarjeta: solo tokens y fuentes de pago.
/// </summary>
public sealed class WompiApiClient : IWompiApiClient
{
    private const string SandboxBaseUrl = "https://sandbox.wompi.co/v1";
    private const string ProductionBaseUrl = "https://production.wompi.co/v1";

    private readonly HttpClient _http;
    private readonly IApplicationDbContext _db;
    private readonly ISecretProtector _secretProtector;

    public WompiApiClient(HttpClient http, IApplicationDbContext db, ISecretProtector secretProtector)
    {
        _http = http;
        _db = db;
        _secretProtector = secretProtector;
    }

    private async Task<(string baseUrl, string? publicKey, string? privateKey)> ResolveConfigAsync(CancellationToken ct)
    {
        var config = await _db.WompiMasterConfigs.AsNoTracking().FirstOrDefaultAsync(ct);
        var baseUrl = config?.Environment == WompiEnvironment.Production ? ProductionBaseUrl : SandboxBaseUrl;
        string? privateKey = null;
        if (config?.PrivateKeyEncrypted is { } enc)
        {
            try { privateKey = _secretProtector.Unprotect(enc); } catch { privateKey = null; }
        }
        return (baseUrl, config?.PublicKey, privateKey);
    }

    public async Task<WompiAcceptance> GetAcceptanceTokenAsync(CancellationToken cancellationToken = default)
    {
        var (baseUrl, publicKey, _) = await ResolveConfigAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(publicKey))
        {
            return new WompiAcceptance(false, null, "Falta la llave publica de Wompi.");
        }

        try
        {
            using var resp = await _http.GetAsync($"{baseUrl}/merchants/{publicKey}", cancellationToken);
            var json = await resp.Content.ReadAsStringAsync(cancellationToken);
            if (!resp.IsSuccessStatusCode)
            {
                return new WompiAcceptance(false, null, $"Wompi {(int)resp.StatusCode}: {Truncate(json)}");
            }
            using var doc = JsonDocument.Parse(json);
            var token = doc.RootElement.GetProperty("data").GetProperty("presigned_acceptance").GetProperty("acceptance_token").GetString();
            return token is null
                ? new WompiAcceptance(false, null, "Respuesta sin acceptance_token.")
                : new WompiAcceptance(true, token, null);
        }
        catch (Exception ex)
        {
            return new WompiAcceptance(false, null, ex.Message);
        }
    }

    public async Task<WompiPaymentSourceResult> CreateCardPaymentSourceAsync(string cardToken, string customerEmail, string acceptanceToken, CancellationToken cancellationToken = default)
    {
        var (baseUrl, _, privateKey) = await ResolveConfigAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(privateKey))
        {
            return new WompiPaymentSourceResult(false, null, null, "Falta la llave privada de Wompi.");
        }

        try
        {
            using var req = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/payment_sources")
            {
                Content = JsonContent.Create(new
                {
                    type = "CARD",
                    token = cardToken,
                    customer_email = customerEmail,
                    acceptance_token = acceptanceToken
                })
            };
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", privateKey);

            using var resp = await _http.SendAsync(req, cancellationToken);
            var json = await resp.Content.ReadAsStringAsync(cancellationToken);
            if (!resp.IsSuccessStatusCode)
            {
                return new WompiPaymentSourceResult(false, null, null, $"Wompi {(int)resp.StatusCode}: {Truncate(json)}");
            }
            using var doc = JsonDocument.Parse(json);
            var data = doc.RootElement.GetProperty("data");
            var id = data.GetProperty("id").GetInt64();
            var label = BuildLabel(data);
            return new WompiPaymentSourceResult(true, id, label, null);
        }
        catch (Exception ex)
        {
            return new WompiPaymentSourceResult(false, null, null, ex.Message);
        }
    }

    public async Task<WompiChargeResult> ChargePaymentSourceAsync(long paymentSourceId, long amountInCents, string currency, string reference, string customerEmail, CancellationToken cancellationToken = default)
    {
        var (baseUrl, _, privateKey) = await ResolveConfigAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(privateKey))
        {
            return new WompiChargeResult(false, null, null, "Falta la llave privada de Wompi.");
        }

        try
        {
            using var req = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/transactions")
            {
                Content = JsonContent.Create(new
                {
                    amount_in_cents = amountInCents,
                    currency,
                    customer_email = customerEmail,
                    reference,
                    payment_source_id = paymentSourceId,
                    recurrent = true,
                    payment_method = new { installments = 1 }
                })
            };
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", privateKey);

            using var resp = await _http.SendAsync(req, cancellationToken);
            var json = await resp.Content.ReadAsStringAsync(cancellationToken);
            if (!resp.IsSuccessStatusCode)
            {
                return new WompiChargeResult(false, null, null, $"Wompi {(int)resp.StatusCode}: {Truncate(json)}");
            }
            using var doc = JsonDocument.Parse(json);
            var data = doc.RootElement.GetProperty("data");
            var id = data.GetProperty("id").GetString();
            var status = data.TryGetProperty("status", out var st) ? st.GetString() : null;
            return new WompiChargeResult(true, id, status, null);
        }
        catch (Exception ex)
        {
            return new WompiChargeResult(false, null, null, ex.Message);
        }
    }

    private static string? BuildLabel(JsonElement paymentSourceData)
    {
        if (!paymentSourceData.TryGetProperty("public_data", out var pub))
        {
            return null;
        }
        var brand = pub.TryGetProperty("brand", out var b) ? b.GetString() : null;
        var last4 = pub.TryGetProperty("last_four", out var l) ? l.GetString() : null;
        if (brand is null && last4 is null) return null;
        return $"{brand ?? "Tarjeta"} ****{last4 ?? "????"}";
    }

    private static string Truncate(string s) => s.Length <= 300 ? s : s[..300];
}
