using System.Security.Claims;
using auction_site_api.Contracts.Auction;
using auction_site_api.Contracts.Bid;
using auction_site_api.Contracts.User;
using auction_site_api.Core;
using auction_site_api.Core.Services;
using auction_site_api.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace auction_site_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;
    private readonly AuctionService _auctionService;
    private readonly BidService _bidService;

    public UsersController(IService<User> userService, IService<Auction> auctionService, IService<Bid> bidService)
    {
        _userService = userService as UserService ?? throw new Exception("UserService is unavailable.");
        _auctionService = auctionService as AuctionService ?? throw new Exception("AuctionService is unavailable");
        _bidService = bidService as BidService ?? throw new Exception("BidService is unavailable.");
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserResponse>> RegisterUser([FromBody] UserRegisterRequest request)
    {
        var result = await _userService.RegisterUserAsync(request);
        return CreatedAtAction(nameof(GetUser), new { id = result.Response }, result.Response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserLoginResponse>> LoginUser([FromBody] UserLoginRequest request)
    {
        var result = await _userService.LoginUserAsync(request);
        if (result.Error is not null) return Unauthorized(result.Error);
        
        return Ok(result.Response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserResponse>> GetUser([FromRoute] Guid id)
    {
        var result = await _userService.GetAsync(id);
        if (result is null) return NotFound();
        
        return Ok(result);
    }

    
    [HttpGet("{username}")]
    public async Task<ActionResult<UserResponse>> GetByUsername([FromRoute] string username)
    {
        var result = await _userService.GetByUsernameAsync(username);
        if (result is null) return NotFound();

        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsers()
    {
        var result = await _userService.GetUsers();
        if (!result.Any()) return NotFound();
        
        return Ok(result);
    }
    
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<UserResponse>> UpdateUser([FromRoute] Guid id, [FromBody] UserUpdateRequest request)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue) || !Guid.TryParse(userIdValue, out var currentUserId))
            return Unauthorized();

        // If not user in question but admin, still able to update (includes deactivating user)
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && currentUserId != id) return Forbid();

        var result = await _userService.UpdateUserAsync(id, request);
        if (result.Error is not null) return BadRequest(result.Error);
        
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteUser([FromRoute] Guid id)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue) || !Guid.TryParse(userIdValue, out var currentUserId))
            return Unauthorized();

        // If not user in question but in admin role, still able to delete user
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && currentUserId != id) return Forbid();

        bool result = await _userService.Delete(id);
        if (!result) return StatusCode(StatusCodes.Status500InternalServerError, "User deletion was unsuccessful.");

        return NoContent();
    }

    [HttpGet("{id:guid}/auctions")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<AuctionListItemResponse>>> GetUserAuctions([FromRoute] Guid id)
    {
        var result = await _auctionService.GetAuctionsAsync(userId: id, false, query: null);
        if (!result.Any()) return Ok(Array.Empty<AuctionListItemResponse>());

        return Ok(result);
    }
    
    [HttpGet("{id:guid}/bids")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<BidSummaryResponse>>> GetUserBids([FromRoute] Guid id)
    {
        var result = await _bidService.GetUserBidsAsync(id);
        if (!result.Any()) return Ok(Array.Empty<BidSummaryResponse>());
        
        return Ok(result);
    }
}
