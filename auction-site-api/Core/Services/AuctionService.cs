using System.Collections;
using System.Linq.Expressions;
using auction_site_api.Contracts.Auction;
using auction_site_api.Contracts.Bid;
using auction_site_api.Data.Entities;
using auction_site_api.Data.Repositories;
using AutoMapper;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Npgsql;

namespace auction_site_api.Core.Services;

public class AuctionService : GenericService<Auction>
{
    private readonly AuctionRepository _auctionRepository;
    private readonly IRepository<Bid> _bidRepository;
    
    public AuctionService(IRepository<Auction> repository, IRepository<Bid> bidRepository, IMapper mapper) : base(repository, mapper)
    {
        _auctionRepository = repository as AuctionRepository ?? throw new Exception("Auction repository is unavailable.");
        _bidRepository = bidRepository;
    }

    public async Task<AuctionResponse?> CreateAuctionAsync(Guid userId,
        AuctionCreateRequest request)
    {
        var auction = Mapper.Map<Auction>(request);
        auction.CreatorId = userId;
        auction.IsActive = true;

        var now = DateTime.UtcNow;
        auction.StartTime = now;
        auction.EndTime = now.AddDays(14);
        auction.CreatedAt = now;

        var stored = await AddAsync(auction);
        var result = Mapper.Map<AuctionResponse>(stored);
        result.Bids = Enumerable.Empty<BidSummaryResponse>();

        return result;
    }

    public async Task<(AuctionResponse? OpenResponse, ClosedAuctionResponse? ClosedResponse)> GetAuctionAsync(Guid id)
    {
        var auction = await GetAsync(id);
        if (auction is null) return (null, null);

        var isActive = auction.IsActive && auction.EndTime > DateTime.UtcNow;
        if (isActive)
        {
            var openResponse = Mapper.Map<AuctionResponse>(auction);
            openResponse.Bids = Mapper.Map<IEnumerable<BidSummaryResponse>>(auction.Bids);

            return (openResponse, null);
        }

        var closedResponse = Mapper.Map<ClosedAuctionResponse>(auction);
        var winningBid = auction.Bids
            .OrderByDescending(bid => bid.Amount)
            .FirstOrDefault();

        if (winningBid is not null)
        {
            closedResponse.WinningBidAmount = winningBid.Amount;
            closedResponse.WinningUserId = winningBid.UserId;
        }

        return (null, closedResponse);
    }

    public async Task<IEnumerable<AuctionListItemResponse>> GetAuctionsAsync(Guid? userId, bool searching, string? query)
    {
        IEnumerable<Auction> auctions;

        if (userId != null)
        {
            auctions = await _auctionRepository.FindAsync(auction => auction.CreatorId == userId);
        }
        else if (searching)
        {
            auctions = await _auctionRepository.SearchActiveAsync(query?.Trim());
        }
        else
        {
            auctions = await _auctionRepository.AllAsync();
        }

        var response = auctions.Select<Auction, AuctionListItemResponse>(auction =>
        {
            var item = Mapper.Map<AuctionListItemResponse>(auction);
            var highestBid = auction.Bids.OrderByDescending(bid => bid.Amount).FirstOrDefault();
            item.CurrentPrice = highestBid?.Amount ?? auction.StartPrice;
            return item;
        }).ToList();

        return response;
    }

    public async Task<AuctionResponse?> UpdateAuctionAsync(Guid id, AuctionUpdateRequest request)
    {
        var auction = await GetAsync(id);
        var updateMapping = Mapper.Map<Auction>(request);
        updateMapping.Id = id;
        
        var updated = await Update(id, updateMapping);
        if (updated is null) return null;

        var response = Mapper.Map<AuctionResponse>(updated);

        return response;
    }

    public async Task<bool> DeleteAuctionAsync(Guid id)
    {
        var response = await Delete(id);

        return response;
    }
}