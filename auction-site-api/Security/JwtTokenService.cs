using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using auction_site_api.Data.Entities;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace auction_site_api.Security;

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;
    
    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public string GenerateToken(User user)
    {
        IConfigurationSection jwtSection = _configuration.GetSection("Jwt");
        string issuer = jwtSection["Issuer"]!;
        string audience = jwtSection["Audience"]!;
        string key = jwtSection["Key"]!;
        int expiresMinutes = int.Parse(jwtSection["ExpiresMinutes"]!);

        byte[] keyBytes = Encoding.UTF8.GetBytes(key);
        var signingKey = new SymmetricSecurityKey(keyBytes);
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iss, issuer),
            new Claim(JwtRegisteredClaimNames.Aud, audience),
            new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User")
        };
        
        var now = DateTime.UtcNow;

        var token = new JwtSecurityToken
            (
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: now,
                expires: now.AddMinutes(expiresMinutes),
                signingCredentials: credentials
            );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}