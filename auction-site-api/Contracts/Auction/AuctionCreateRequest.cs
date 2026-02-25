namespace auction_site_api.Contracts.Auction;

public class AuctionCreateRequest
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal StartPrice { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}