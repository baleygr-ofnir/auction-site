using auction_site_api.Contracts.Bid;

namespace auction_site_api.Contracts.Auction;

public class AuctionResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsActive { get; set; }
    public IEnumerable<BidSummaryResponse> Bids { get; set; } = [];
    public Guid CreatorId { get; set; }
}