using System.ComponentModel.DataAnnotations;
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
    private readonly AuctionRepository _auctionRepository;
    private readonly IRepository<Bid> _bidRepository;
    private readonly IMapper _mapper;

    public AuctionsController(AuctionRepository auctionRepository, IRepository<Bid> bidRepository, IMapper mapper)
    {
        _auctionRepository = auctionRepository;
        _bidRepository = bidRepository;
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

        var isActive = auction.IsActive && auction.EndTime > DateTime.UtcNow;

        if (isActive)
        {
            var openResponse = _mapper.Map<AuctionResponse>(auction);
            openResponse.Bids = _mapper.Map<IEnumerable<BidSummaryResponse>>(auction.Bids);

            return Ok(openResponse);
        }
        
        var closedResponse = _mapper.Map<ClosedAuctionResponse>(auction);
        var winningBid = auction.Bids
            .OrderByDescending(bid => bid.Amount)
            .FirstOrDefault();

        if (winningBid is not null)
        {
            closedResponse.WinningBidAmount = winningBid.Amount;
            closedResponse.WinningUserId = winningBid.UserId;
        }
        
        return Ok(closedResponse);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AuctionListItemResponse>>> GetAuctions([FromQuery] string? query)
    {
        var auctions = await _auctionRepository.SearchActiveAsync(query?.Trim());

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
    [Authorize]
    public async Task<ActionResult<AuctionResponse>> UpdateAuction([FromRoute] Guid id, [FromBody] AuctionUpdateRequest request)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue) || !Guid.TryParse(userIdValue, out var currentUserId)) return Unauthorized();
        
        var auction = await _auctionRepository.GetAsync(id);
        if (auction is null) return NotFound();

        // If not auction creater but admin, still able to update (includes deactivating auction)
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && currentUserId != auction.CreatorId) return Forbid();

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

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteAuction([FromRoute] Guid id)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue) || !Guid.TryParse(userIdValue, out var currentUserId))
            return Unauthorized();

        var auction = await _auctionRepository.GetAsync(id);
        if (auction is null) return NotFound();

        // If not auction creator but admin, still authorised to delete
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && currentUserId != auction.CreatorId) return Forbid();

        var deleted = await _auctionRepository.Delete(id);
        if (!deleted)
            return StatusCode(StatusCodes.Status500InternalServerError, "Could not delete auction.");

        await _auctionRepository.SaveChangesAsync();

        return NoContent();
    }
    
    // BIDDING ROUTES
    [HttpPost("{auctionId:guid}/bids")]
    [Authorize]
    public async Task<ActionResult<BidSummaryResponse>> PlaceBid([FromRoute] Guid auctionId, [FromBody] BidCreateRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue) || !Guid.TryParse(userIdValue, out var currentUserId))
            return Unauthorized();
        
        
        var auction = await _auctionRepository.GetAsync(auctionId);
        if (auction is null) return NotFound();

        if (!auction.IsActive || auction.EndTime <= DateTime.UtcNow)
            return BadRequest("Cannot place bids on closed or inactive auctions.");

        if (currentUserId == auction.CreatorId) return BadRequest("Creators may not place bids on their own auction.");

        var highestBid = auction.Bids
            .OrderByDescending(bid => bid.Amount)
            .FirstOrDefault();
        var currentPrice = highestBid?.Amount ?? auction.StartPrice;

        if (request.Amount <= currentPrice) return BadRequest("Bid amount must be higher than the current price");

        var bid = _mapper.Map<Bid>(request);
        bid.AuctionId = auctionId;
        bid.UserId = currentUserId;

        await _bidRepository.AddAsync(bid);
        await _bidRepository.SaveChangesAsync();

        var response = _mapper.Map<BidSummaryResponse>(bid);

        return CreatedAtAction(nameof(GetAuction), new { id = auctionId }, response);
    }

    [HttpDelete("{auctionId:guid}/bids/latest")]
    [Authorize]
    public async Task<IActionResult> RemoveLatestBid([FromRoute] Guid auctionId)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue) || !Guid.TryParse(userIdValue, out var currentUserId))
            return Unauthorized();
        
        var auction = await _auctionRepository.GetAsync(auctionId);
        if (auction is null) return NotFound();

        if (!auction.IsActive || auction.EndTime <= DateTime.UtcNow)
            return BadRequest("Cannot remove bids from closed or inactive auctions.");
        
        var latestBid = auction.Bids
            .OrderByDescending(bid => bid.CreatedAt)
            .FirstOrDefault();
        if (latestBid is null) return BadRequest("There are no bids to remove.");

        var deleted = await _bidRepository.Delete(latestBid.Id);
        if (!deleted) return StatusCode(StatusCodes.Status500InternalServerError, "Could not remove the latest bid.");

        await _bidRepository.SaveChangesAsync();

        return NoContent();
    }
}