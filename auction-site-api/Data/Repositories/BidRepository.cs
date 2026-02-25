using auction_site_api.Data.Entities;

namespace auction_site_api.Data.Repositories;

public class BidRepository : GenericRepository<Bid>
{
    public BidRepository(AuctionContext context) : base(context)
    {
    }
}