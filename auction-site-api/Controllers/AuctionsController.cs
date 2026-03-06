using System.Security.Claims;
using auction_site_api.Contracts.Auction;
using auction_site_api.Contracts.Bid;
using auction_site_api.Core;
using auction_site_api.Core.Services;
using auction_site_api.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace auction_site_api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AuctionsController : ControllerBase
{
    private readonly AuctionService _auctionService;
    private readonly BidService _bidService;
    public AuctionsController(IService<Auction> auctionService, IService<Bid> bidService)
    {
        _auctionService = auctionService as AuctionService ?? throw new Exception("AuctionService is unavailable.");
        _bidService = bidService as BidService ?? throw new Exception("BidService is unavailable.");
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<AuctionResponse>> CreateAuction([FromBody] AuctionCreateRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userIdClaim)) return Unauthorized();

        var creatorId = Guid.Parse(userIdClaim);
        var result = await _auctionService.CreateAuctionAsync(creatorId, request);
        if (result is null) return BadRequest("Auction creation was unsuccessful.");
        
        return CreatedAtAction(nameof(GetAuction), new { id = result.Id }, result);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<AuctionResponse>> GetAuction([FromRoute] Guid id)
    {
        var result = await _auctionService.GetAuctionAsync(id);
        if (result.OpenResponse is null && result.ClosedResponse is null) return NotFound();
        
        return result.OpenResponse is not null ? Ok(result.OpenResponse) : Ok(result.ClosedResponse);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<AuctionListItemResponse>>> GetAuctions([FromQuery] string? search)
    {
        var result = await _auctionService.GetAuctionsAsync(null, false, search?.Trim());
        if (!result.Any()) return Ok(Array.Empty<AuctionListItemResponse>());
        
        return Ok(result);
    }

    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<AuctionListItemResponse>>> SearchActiveAuctions([FromQuery] string? search)
    {
        var result = await _auctionService.GetAuctionsAsync(null, true, search?.Trim());
        if (!result.Any()) return Ok(Array.Empty<AuctionListItemResponse>());
        
        return Ok(result);
    }
    
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<AuctionResponse>> UpdateAuction([FromRoute] Guid id, [FromBody] AuctionUpdateRequest request)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue) || !Guid.TryParse(userIdValue, out var currentUserId)) return Unauthorized();
        
        var auction = await _auctionService.GetAsync(id);
        if (auction is null) return NotFound();

        // If not auction creater but admin, still able to update (includes deactivating auction)
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && currentUserId != auction.CreatorId) return Forbid();

        var result = await _auctionService.UpdateAuctionAsync(id, request);
        if (result is null) return BadRequest("Auction update was unsuccessful.");

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteAuction([FromRoute] Guid id)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue) || !Guid.TryParse(userIdValue, out var currentUserId))
            return Unauthorized();

        var auction = await _auctionService.GetAsync(id);
        if (auction is null) return NotFound();

        // If not auction creator but admin, still authorised to delete
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && currentUserId != auction.CreatorId) return Forbid();

        var deleted = await _auctionService.DeleteAuctionAsync(id);
        if (!deleted) return BadRequest("Auction deletion unsuccessful.");

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
        
        var auction = await _auctionService.GetAsync(auctionId);
        if (auction is null) return NotFound();

        if (!auction.IsActive || auction.EndTime <= DateTime.UtcNow)
            return BadRequest("Cannot place bids on closed or inactive auctions.");

        if (currentUserId == auction.CreatorId) return StatusCode(StatusCodes.Status403Forbidden, "Creators may not place bids on their own auctions.");
        
        var result = await _bidService.PlaceBid(currentUserId, request, auction);
        if (result.Error is not null) return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetAuction), new { id = auctionId }, result);
    }

    [HttpDelete("{auctionId:guid}/bids/latest")]
    [Authorize]
    public async Task<IActionResult> RemoveLatestBid([FromRoute] Guid auctionId)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue) || !Guid.TryParse(userIdValue, out var currentUserId))
            return Unauthorized();

        var result = await _bidService.RemoveLatestBid(auctionId, currentUserId);
        if (result.Error is not null)
        {
            return BadRequest(result.Error);
        }

        if (!result.Response && result.Error is null)
            return StatusCode(StatusCodes.Status500InternalServerError, "Deletion of latest bid was unsuccessful.");

        return NoContent();
    }
}