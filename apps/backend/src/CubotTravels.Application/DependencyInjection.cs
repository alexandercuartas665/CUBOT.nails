using CubotTravels.Application.Auth;
using Microsoft.Extensions.DependencyInjection;

namespace CubotTravels.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }
}
