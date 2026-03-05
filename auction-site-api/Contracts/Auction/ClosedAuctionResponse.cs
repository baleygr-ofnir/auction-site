namespace auction_site_api.Contracts.Auction;

public class ClosedAuctionResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal StartPrice { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsActive { get; set; }
    public decimal? WinningBidAmount { get; set; }
    public Guid? WinningUserId { get; set; }
    public Guid CreatorId { get; set; }
}