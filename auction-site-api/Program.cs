using auction_site_api.Data;
using auction_site_api.Data.Entities;
using auction_site_api.Data.Repositories;
using auction_site_api.Mapping;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace auction_site_api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();
        
        // Dependency Injections
        builder.Services.AddDbContext<AuctionContext>
        (
            options => options.UseNpgsql
            (
                builder.Configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("No connection string found.")
            )
        );
        builder.Services.AddScoped<IRepository<User>, UserRepository>();
        builder.Services.AddScoped<IRepository<Auction>, AuctionRepository>();
        builder.Services.AddScoped<IRepository<Bid>, BidRepository>();
        builder.Services.AddAutoMapper
        (
            cfg => {},
            typeof(UserProfile),
            typeof(AuctionProfile)
        );
        builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();


        app.MapControllers();

        app.Run();
    }
}