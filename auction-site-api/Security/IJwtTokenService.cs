using auction_site_api.Data.Entities;

namespace auction_site_api.Security;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}