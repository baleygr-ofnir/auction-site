using auction_site_api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace auction_site_api.Data.Repositories;

public class AuctionRepository : GenericRepository<Auction>
{
    public AuctionRepository(AuctionContext context) : base(context)
    {
    }

    public override async Task<Auction?> GetAsync(Guid id)
    {
        return await DbSet
            .Include(auction => auction.Bids)
            .FirstOrDefaultAsync(auction => auction.Id == id);
    }

    public override async Task<IEnumerable<Auction>> AllAsync()
    {
        return await DbSet
            .Include(auction => auction.Bids)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Auction>> SearchActiveAsync(string? query)
    {
        var now = DateTime.UtcNow;

        var auctions = DbSet
            .Include(auction => auction.Bids)
            .Where(auction => auction.IsActive && auction.EndTime > now);

        if (!string.IsNullOrWhiteSpace(query)) auctions = auctions.Where(auction => auction.Title.Contains(query));

        return await auctions
            .AsNoTracking()
            .ToListAsync();
    }

    public override Auction Update(Auction updated)
    {
        var auction = DbSet
            .Include(auction => auction.Bids)
            .FirstOrDefault(a => a.Id == updated.Id);
        if (auction is null) return null;
        
        if
        (
            !string.IsNullOrWhiteSpace(updated.Title)
            && !string.Equals(auction.Title, updated.Title, StringComparison.Ordinal)
        )
        {
            auction.Title = updated.Title;
        }

        if
        (
            !string.IsNullOrWhiteSpace(updated.Description)
            && !string.Equals(auction.Description, updated.Description, StringComparison.Ordinal)
        )
        {
            auction.Description = updated.Description;
        }

        if (updated.EndTime != default && auction.EndTime != updated.EndTime)
        {
            auction.EndTime = updated.EndTime;
        }

        if (auction.IsActive != updated.IsActive)
        {
            auction.IsActive = updated.IsActive;
        }
        
        auction.UpdatedAt = DateTime.UtcNow;
        
        return base.Update(auction);
    }
}