using Microsoft.EntityFrameworkCore;
using auction_site_api.Data.Entities;

namespace auction_site_api.Data;

public class AuctionMssqlContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Auction> Auctions => Set<Auction>();
    public DbSet<Bid> Bids => Set<Bid>();
    
    public AuctionMssqlContext(DbContextOptions<AuctionContext> options) : base(options) {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var adminId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        var aliceId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
        var bobId   = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");

        var seedBase = new DateTime(2025, 01, 01, 12, 00, 00, DateTimeKind.Utc);
        var endTime = new DateTime(2030, 01, 01, 10, 00, 00, DateTimeKind.Utc);
        
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(user => user.Id);

            entity.HasIndex(user => user.Username).IsUnique();
            entity.HasIndex(user => user.Email).IsUnique();

            entity.Property(user => user.Username).IsRequired().HasMaxLength(64);
            entity.Property(user => user.Email).IsRequired().HasMaxLength(128);

            // Replaced NOW() with GETUTCDATE() for SQL Server
            entity.Property(user => user.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasData
            (
                new User
                {
                    Id = adminId,
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = "", // can leave empty for seeding
                    IsAdmin = true,
                    IsActive = true,
                    CreatedAt = seedBase
                },
                new User
                {
                    Id = aliceId,
                    Username = "alice",
                    Email = "alice@example.com",
                    PasswordHash = "",
                    IsAdmin = false,
                    IsActive = true,
                    CreatedAt = seedBase
                },
                new User
                {
                    Id = bobId,
                    Username = "bob",
                    Email = "bob@example.com",
                    PasswordHash = "",
                    IsAdmin = false,
                    IsActive = true,
                    CreatedAt = seedBase
                }
            );
        });

        var auction1Id = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var auction2Id = Guid.Parse("22222222-2222-2222-2222-222222222222");
        var auction3Id = Guid.Parse("33333333-3333-3333-3333-333333333333"); 
        
        modelBuilder.Entity<Auction>(entity =>
        {
            entity.HasKey(auction => auction.Id);
            
            entity.Property(auction => auction.Id).IsRequired().HasMaxLength(128);
            entity.Property(auction => auction.Description).IsRequired();
            
            // Replaced numeric with decimal for SQL Server
            entity.Property(auction => auction.StartPrice).HasColumnType("decimal(18,2)");

            entity.HasIndex(auction => auction.Title);
            
            entity.HasOne(auction => auction.Creator)
                .WithMany(user => user.Auctions)
                .HasForeignKey(auction => auction.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Replaced NOW() with GETUTCDATE() for SQL Server
            entity.Property(auction => auction.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasData
                (
                    new Auction
                    {
                        Id = auction1Id,
                        Title = "Gaming Laptop",
                        Description = "15\" gaming laptop with RTX GPU",
                        StartPrice = 800m,
                        StartTime = seedBase.AddHours(-1),
                        EndTime = endTime,
                        IsActive = true,
                        CreatorId = aliceId,
                        CreatedAt = seedBase
                    },
                    new Auction
                    {
                        Id = auction2Id,
                        Title = "Mechanical Keyboard",
                        Description = "Custom mechanical keyboard",
                        StartPrice = 100m,
                        StartTime = seedBase.AddHours(-2),
                        EndTime = endTime,
                        IsActive = true,
                        CreatorId = bobId,
                        CreatedAt = seedBase
                    },
                    new Auction
                    {
                        Id = auction3Id,
                        Title = "Vintage Vinyl Collection",
                        Description = "Box of LPs",
                        StartPrice = 50m,
                        StartTime = seedBase.AddDays(-3),
                        EndTime = endTime,
                        IsActive = true,
                        CreatorId = aliceId,
                        CreatedAt = seedBase.AddDays(-3)
                    }
                );
        });

        modelBuilder.Entity<Bid>(entity =>
        {
            entity.HasKey(bid => bid.Id);

            // Replaced numeric with decimal for SQL Server
            entity.Property(bid => bid.Amount).HasColumnType("decimal(18,2)");

            entity.HasOne(bid => bid.Auction)
                .WithMany(bid => bid.Bids)
                .HasForeignKey(bid => bid.AuctionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(bid => bid.User)
                .WithMany(user => user.Bids)
                .HasForeignKey(bid => bid.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Replaced NOW() with GETUTCDATE() for SQL Server
            entity.Property(bid => bid.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasData
                (
                    new Bid
                    {
                        Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        AuctionId = auction1Id,
                        UserId = bobId,
                        Amount = 820m,
                        CreatedAt = seedBase.AddMinutes(-30)
                    },
                    new Bid
                    {
                        Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        AuctionId = auction1Id,
                        UserId = bobId,
                        Amount = 850m,
                        CreatedAt = seedBase.AddMinutes(-10)
                    },
                    new Bid
                    {
                        Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                        AuctionId = auction3Id,
                        UserId = bobId,
                        Amount = 90m,
                        CreatedAt = seedBase.AddDays(-1).AddHours(-1)
                    }
                );
        });
    }
}