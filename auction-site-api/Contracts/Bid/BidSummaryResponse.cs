namespace auction_site_api.Contracts.Bid;

public class BidSummaryResponse
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid UserId { get; set; }
}