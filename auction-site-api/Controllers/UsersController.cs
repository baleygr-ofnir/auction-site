using System.Security.Claims;
using auction_site_api.Contracts.User;
using auction_site_api.Data.Entities;
using auction_site_api.Data.Repositories;
using auction_site_api.Security;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace auction_site_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IRepository<User> _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IMapper _mapper;

    public UsersController(IRepository<User> userRepository, IPasswordHasher<User> passwordHasher, IJwtTokenService jwtTokenService, IMapper mapper)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _mapper = mapper;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserResponse>> GetUser([FromRoute] Guid id)
    {
        var user = await _userRepository.GetAsync(id);
        if (user is null) return NotFound();

        var response = _mapper.Map<UserResponse>(user);
        return Ok(response);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<UserResponse>> GetByUsername([FromRoute] string username)
    {
        var user = await _userRepository.FindAsync
        (user => user.Username == username
        );
        if (!user.Any()) return NotFound();

        var response = _mapper.Map<UserResponse>(user.FirstOrDefault());

        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserResponse>> RegisterUser([FromBody] UserRegisterRequest request)
    {
        var existingUsers = await _userRepository.FindAsync
        (
            user => user.Username == request.Username || user.Email == request.Email
        );
        if (existingUsers.Any()) return Conflict("Username or Email already exists");
        
        var user = _mapper.Map<User>(request);
        user.IsAdmin = false;
        user.IsActive = true;
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = null;
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
        
        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();
        
        var response = _mapper.Map<UserResponse>(user);

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, response);
    }


    [HttpPost("login")]
    public async Task<ActionResult<UserResponse>> LoginUser([FromBody] UserLoginRequest request)
    {
        var userRepository = _userRepository as UserRepository;
        if (userRepository is null) return StatusCode(StatusCodes.Status500InternalServerError, "User repository is unavailable");
        
        var user = await userRepository.GetByUsernameOrEmailAsync(request.UsernameOrEmail);
        if (user is null) return Unauthorized("Invalid username/email or password");
        
        var verification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verification == PasswordVerificationResult.Failed) return Unauthorized("Invalid username/email or password");
        
        var token = _jwtTokenService.GenerateToken(user);
        
        var userResponse =  _mapper.Map<UserResponse>(user);

        var response = new UserLoginResponse()
        {
            Token = token,
            User = userResponse
        };
        
        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<UserResponse>> UpdateUser([FromRoute] Guid id, [FromBody] UserUpdateRequest request)
    {
        var userRepository = _userRepository as UserRepository;
        if (userRepository is null) return StatusCode(StatusCodes.Status500InternalServerError, "User repository is unavailable");
        
        var user = await userRepository.GetAsync(id);
        if (user is null) return NotFound();
        
        if (!string.IsNullOrWhiteSpace(request.Email) && !string.Equals(user.Email, request.Email, StringComparison.Ordinal))
        {
            var existingEmail = await userRepository.GetByEmailAsync(request.Email);
            if (existingEmail is not null && existingEmail.Id != user.Id)
                return BadRequest("Email is already registered to another user.");
        }
        
        _mapper.Map(request, user);
        userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
        
        var response = _mapper.Map<UserResponse>(user);
        
        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteUser([FromRoute] Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        bool deleted = await _userRepository.Delete(id);
        if (!deleted) return NotFound();

        await _userRepository.SaveChangesAsync();
        
        return NoContent();
    }
}
