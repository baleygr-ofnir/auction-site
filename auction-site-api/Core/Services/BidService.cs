using System.Collections;
using auction_site_api.Contracts.Bid;
using auction_site_api.Data.Entities;
using auction_site_api.Data.Repositories;
using AutoMapper;

namespace auction_site_api.Core.Services;

public class BidService : GenericService<Bid>
{
    private readonly IRepository<Auction> _auctionRepository;
    public BidService(IRepository<Bid> repository, IRepository<Auction> auctionRepository, IMapper mapper) : base(repository, mapper)
    {
        _auctionRepository = auctionRepository;
    }

    public async Task<IEnumerable<BidSummaryResponse>?> GetUserBidsAsync(Guid userId)
    {
        var bids = await Repository.FindAsync(bid => bid.UserId == userId);
        
        var response = bids.Select<Bid, BidSummaryResponse>(bid => Mapper.Map<BidSummaryResponse>(bid)).ToList();
        
        return response;
    }

    public async Task<(BidSummaryResponse? Response, string? Error)> PlaceBid(Guid userId, BidCreateRequest request, Auction auction)
    {
        var highestBid = auction.Bids
            .OrderByDescending(bid => bid.Amount)
            .FirstOrDefault();
        var currentPrice = highestBid?.Amount ?? auction.StartPrice;

        if (request.Amount <= currentPrice) return (null, "Bid amount must be higher than the current price");

        var bid = Mapper.Map<Bid>(request);
        bid.AuctionId = auction.Id;
        bid.UserId = userId;

        var added = await AddAsync(bid);

        var response = Mapper.Map<BidSummaryResponse>(added);

        return (response, null);
    }

    public async Task<(bool Response, string? Error)> RemoveLatestBid(Guid auctionId, Guid userId)
    {
        
        var auction = await _auctionRepository.GetAsync(auctionId);
        if (auction is null) return (false, "Auction was not found.");

        if (!auction.IsActive || auction.EndTime <= DateTime.UtcNow)
            return (false, "Cannot remove bids from closed or inactive auctions.");
        
        var latestBid = auction.Bids
            .OrderByDescending(bid => bid.CreatedAt)
            .FirstOrDefault();
        if (latestBid is null) return (false, "There are no bids to remove.");

        if (latestBid.UserId != userId) return (false, "Bid does not belong to the user requesting deletion.");
        var deleted = await Delete(latestBid.Id);

        return (deleted, null);
    }
}