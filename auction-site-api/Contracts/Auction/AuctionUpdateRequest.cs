namespace auction_site_api.Contracts.Auction;

public class AuctionUpdateRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal? StartPrice { get; set; }
    public DateTime? EndTime { get; set; }
    public bool? IsActive { get; set; }
}