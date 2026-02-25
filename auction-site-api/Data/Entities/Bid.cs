namespace auction_site_api.Data.Entities;

public class Bid
{
    public Guid Id { get; set; }
    public Guid AuctionId { get; set; }
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; }
    public Auction Auction { get; set; } = null!;
    public User User { get; set; } = null!;
}