using Microsoft.EntityFrameworkCore;
using auction_site_api.Data.Entities;

namespace auction_site_api.Data;

public class AuctionContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Auction> Auctions => Set<Auction>();
    public DbSet<Bid> Bids => Set<Bid>();
    
    public AuctionContext(DbContextOptions<AuctionContext> options) : base(options) {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(user => user.Id);

            entity.HasIndex(user => user.Username).IsUnique();
            entity.HasIndex(user => user.Email).IsUnique();

            entity.Property(user => user.Username).IsRequired().HasMaxLength(64);
            entity.Property(user => user.Email).IsRequired().HasMaxLength(128);

            entity.Property(user => user.CreatedAt).HasDefaultValueSql("NOW()");
        });

        modelBuilder.Entity<Auction>(entity =>
        {
            entity.HasKey(auction => auction.Id);
            
            entity.Property(auction => auction.Id).IsRequired().HasMaxLength(128);
            entity.Property(auction => auction.Description).IsRequired();
            entity.Property(auction => auction.StartPrice).HasColumnType("numeric(18,2)");

            entity.HasIndex(auction => auction.Title);
            
            entity.HasOne(auction => auction.Creator)
                .WithMany(user => user.Auctions)
                .HasForeignKey(auction => auction.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.Property(auction => auction.CreatedAt).HasDefaultValueSql("NOW()");
        });

        modelBuilder.Entity<Bid>(entity =>
        {
            entity.HasKey(bid => bid.Id);

            entity.Property(bid => bid.Amount).HasColumnType("numeric(18,2)");

            entity.HasOne(bid => bid.Auction)
                .WithMany(bid => bid.Bids)
                .HasForeignKey(bid => bid.AuctionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(bid => bid.User)
                .WithMany(user => user.Bids)
                .HasForeignKey(bid => bid.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(bid => bid.CreatedAt).HasDefaultValueSql("NOW()");
        });
    }
}