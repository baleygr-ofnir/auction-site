using System.Text;
using auction_site_api.Core;
using auction_site_api.Core.Services;
using auction_site_api.Data;
using auction_site_api.Data.Entities;
using auction_site_api.Data.Repositories;
using auction_site_api.Mapping;
using auction_site_api.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace auction_site_api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        string[]? origins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
        // Add services to the container.
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(
                name: "_myAllowSpecificOrigins",
                policy =>
                {
                    if (origins != null && origins.Length > 0)
                    {
                        policy
                            .WithOrigins(origins)
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    }
                });
        });
        builder.Services.AddControllers();
        
        // Dependency Injections
        
        // Core DIs
        builder.Services.AddScoped<IService<Auction>, AuctionService>();
        builder.Services.AddScoped<IService<Bid>, BidService>();
        builder.Services.AddScoped<IService<User>, UserService>();
        
        // Data
        builder.Services.AddDbContext<AuctionContext>
        (
            options => options.UseSqlServer
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

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();
        app.UseCors("_myAllowSpecificOrigins");
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}