namespace auction_site_api.Contracts.Auction;

public class AuctionListItemResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public DateTime EndTime { get; set; }
    public bool IsActive { get; set; }
    public decimal CurrentPrice { get; set; } // set from bids or StartPrice
}