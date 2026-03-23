using System.Text;
using auction_site_api.Core;
using auction_site_api.Core.Services;
using auction_site_api.Data;
using auction_site_api.Data.Entities;
using auction_site_api.Data.Repositories;
using auction_site_api.Mapping;
using auction_site_api.Security;
using auction_site_api.Workers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace auction_site_api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        
        // Dependency Injections
        
        // Core DIs
        builder.Services.AddScoped<IService<Auction>, AuctionService>();
        builder.Services.AddScoped<IService<Bid>, BidService>();
        builder.Services.AddScoped<IService<User>, UserService>();
        // Data
        builder.Services.AddDbContext<AuctionContext>
        (
            options => options.UseNpgsql
            (
                builder.Configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("No connection string found.")
            )
        );
        builder.Services.AddScoped<IRepository<Auction>, AuctionRepository>();
        builder.Services.AddScoped<IRepository<Bid>, BidRepository>();
        builder.Services.AddScoped<IRepository<User>, UserRepository>();
        builder.Services.AddAutoMapper
        (
            cfg => {},
            typeof(UserProfile),
            typeof(AuctionProfile)
        );
        
        // Workers
        builder.Services.AddHostedService<AuctionExpiryWorker>();
        
        // Security
        builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
        
        var jwtSection = builder.Configuration.GetSection("Jwt");
        var jwtKey = jwtSection["Key"]!;
        var jwtIssuer = jwtSection["Issuer"]!;
        var jwtAudience = jwtSection["Audience"]!;

        builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                };
            });
        builder.Services.AddAuthorization();
        
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();
        
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];
        Console.WriteLine($"CORS DEBUG: Loaded {allowedOrigins?.Length ?? 0} origins. First: {allowedOrigins?.FirstOrDefault() ?? "NULL"}");
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
       
        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            // Use the latest enum flags for proxy identification
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;

            // FIX: Use the non-obsolete KnownIPNetworks instead of KnownNetworks
            // We clear these to trust the Nginx Proxy Manager (NPM) inside the Docker network
            options.KnownIPNetworks.Clear(); 
            options.KnownProxies.Clear();
        });
        var app = builder.Build();

        app.UseForwardedHeaders();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();
        app.UseCors();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var logger = services.GetRequiredService<ILogger<Program>>();
            var context = services.GetRequiredService<AuctionContext>();

            // Retry loop to wait for Postgres to wake up
            for (int i = 0; i < 10; i++)
            {
                try
                {
                    logger.LogInformation("Attempting to apply migrations (Attempt {Attempt})...", i + 1);
                    context.Database.Migrate();
                    logger.LogInformation("Migrations applied successfully.");
                    break; // Success! Exit the loop.
                }
                catch (Npgsql.NpgsqlException ex) when (i < 9)
                {
                    logger.LogWarning("Database not ready yet. Retrying in 2 seconds...");
                    Thread.Sleep(2000);
                }
            }
        }
        
        app.Run();
    }
}