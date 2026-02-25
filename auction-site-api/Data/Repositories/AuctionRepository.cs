using auction_site_api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace auction_site_api.Data.Repositories;

public class AuctionRepository : GenericRepository<Auction>
{
    public AuctionRepository(AuctionContext context) : base(context)
    {
    }

    public override Auction Update(Auction updated)
    {
        var auction = DbSet.FirstOrDefault(a => a.Id == updated.Id);
        if (auction is null) return null;
        
        if
        (
            !string.IsNullOrEmpty(updated.Title)
            && !string.Equals(auction.Title, updated.Title, StringComparison.Ordinal)
        )
        {
            auction.Title = updated.Title;
        }

        if
        (
            !string.IsNullOrEmpty(updated.Description)
            && !string.Equals(auction.Description, updated.Description, StringComparison.Ordinal)
        )
        {
            auction.Description = updated.Description;
        }

        if (auction.EndTime != updated.EndTime)
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