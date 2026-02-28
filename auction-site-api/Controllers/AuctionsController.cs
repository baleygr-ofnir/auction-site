using System.Security.Claims;
using auction_site_api.Contracts.Auction;
using auction_site_api.Contracts.Bid;
using auction_site_api.Data.Entities;
using auction_site_api.Data.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace auction_site_api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AuctionsController : ControllerBase
{
    private readonly IRepository<Auction> _auctionRepository;
    private readonly IMapper _mapper;

    public AuctionsController(IRepository<Auction> auctionRepository, IMapper mapper)
    {
        _auctionRepository = auctionRepository;
        _mapper = mapper;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<AuctionResponse>> CreateAuction([FromBody] AuctionCreateRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userIdClaim)) return Unauthorized();

        var creatorId = Guid.Parse(userIdClaim);

        var auction = _mapper.Map<Auction>(request);
        auction.CreatorId = creatorId;
        auction.IsActive = true;
        auction.CreatedAt = DateTime.UtcNow;

        await _auctionRepository.AddAsync(auction);
        await _auctionRepository.SaveChangesAsync();

        var response = _mapper.Map<AuctionResponse>(auction);
        response.Bids = Enumerable.Empty<BidSummaryResponse>();

        return CreatedAtAction(nameof(GetAuction), new { id = auction.Id }, response);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<AuctionResponse>> GetAuction([FromRoute] Guid id)
    {
        var auction = await _auctionRepository.GetAsync(id);
        if (auction is null) return NotFound();
        
        var response = _mapper.Map<AuctionResponse>(auction);
        response.Bids = _mapper.Map<IEnumerable<BidSummaryResponse>>(auction.Bids);
        
        return response;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AuctionListItemResponse>>> GetAuctions([FromQuery] string? query)
    {
        var auctionRepository = _auctionRepository as AuctionRepository;
        if (auctionRepository is null)
            return StatusCode(StatusCodes.Status500InternalServerError, "Auction Repository is unavailable.");
        
        var auctions = await auctionRepository.SearchActiveAsync(query?.Trim());

        var result = auctions.Select(auction =>
        {
            var item = _mapper.Map<AuctionListItemResponse>(auction);
            var highestBid = auction.Bids.OrderByDescending(bid => bid.Amount).FirstOrDefault();
            item.CurrentPrice = highestBid?.Amount ?? auction.StartPrice;
            return item;
        }).ToList();
        
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AuctionResponse>> UpdateAuction([FromRoute] Guid id, AuctionUpdateRequest request)
    {
        var userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userIdValue)) return Unauthorized();

        var userId = Guid.Parse(userIdValue);

        var auction = await _auctionRepository.GetAsync(id);
        if (auction is null) return NotFound();

        if (auction.CreatorId != userId) return Forbid();

        var updated = _mapper.Map<Auction>(request);
        updated.Id = id;

        _auctionRepository.Update(updated);
        await _auctionRepository.SaveChangesAsync();

        var result = await _auctionRepository.GetAsync(id);
        if (result is null) return NotFound();

        var response = _mapper.Map<AuctionResponse>(result);
        response.Bids = _mapper.Map<IEnumerable<BidSummaryResponse>>(result.Bids);

        return Ok(response);
    }
}