using auction_site_api.Contracts.User;
using auction_site_api.Data.Entities;
using auction_site_api.Data.Repositories;
using auction_site_api.Security;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace auction_site_api.Core.Services;

public class UserService : GenericService<User>
{
    private readonly UserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    
    public UserService(IRepository<User> repository, IMapper mapper, IPasswordHasher<User> passwordHasher, IJwtTokenService jwtTokenService) : base(repository, mapper)
    {
        _userRepository = repository as UserRepository ?? throw new Exception("User Repository is unavailable");
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<(UserResponse? Response, string? Error)> RegisterUserAsync(UserRegisterRequest request)
    {
        var existingUsername = await _userRepository.GetByUsernameAsync(request.Username);
        if (existingUsername is not null) return (null, "Username is already registered to another user.");

        var existingEmail = await _userRepository.GetByEmailAsync(request.Email);
        if (existingEmail is not null) return (null, "Email is already registered to another user.");

        var user = Mapper.Map<User>(request);
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
        user.IsAdmin = false;
        user.IsActive = true;
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = null;

        var added = await AddAsync(user);

        var response = Mapper.Map<UserResponse>(added);

        return (response, null);
    }

    public async Task<(UserLoginResponse? Response, string? Error)> LoginUserAsync(UserLoginRequest request)
    {
        var user = await _userRepository.GetByUsernameOrEmailAsync(request.UsernameOrEmail);
        if (user is null) return (null, "Invalid credentials.");

        var passwordVerification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (passwordVerification == PasswordVerificationResult.Failed) return (null, "Invalid credentials.");

        var token = _jwtTokenService.GenerateToken(user);

        var response = new UserLoginResponse
        {
            Token = token,
            User = Mapper.Map<UserResponse>(user)
        };

        return (response, null);
    } 
    
    public async Task<UserResponse?> GetByUsernameAsync(string username)
    {
        var user = await _userRepository.GetByUsernameAsync(username);
        var response = Mapper.Map<UserResponse>(user);
        
        return user is not null ? response : null;
    }

    public async Task<UserResponse?> GetByEmailAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        var response = Mapper.Map<UserResponse>(user);

        return user is not null ? response : null;
    }

    // Test if updates as implemented overrides
    public async Task<(UserResponse? Response, string? Error)> UpdateUserAsync(Guid id, UserUpdateRequest request)
    {
        var user = await Repository.GetAsync(id);
        if (user is null) return (null, "User was not found.");

        if (!string.IsNullOrWhiteSpace(request.Email) && !string.Equals(user.Email, request.Email, StringComparison.Ordinal))
        {
            var existingEmail = await _userRepository.GetByEmailAsync(request.Email);
            if (existingEmail is not null && existingEmail.Id != id)
                return (null, "Email is already registered to another user.");
        }

        var userMapping = Mapper.Map<User>(request);
        var updated = await Update(id, userMapping);
        var response = Mapper.Map<UserResponse>(updated);

        return (response, null);
    }
}