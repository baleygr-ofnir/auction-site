namespace auction_site_api.Contracts.User;

public class UserLoginRequest
{
    public string UsernameOrEmail { get; set; } = null!;
    public string Password { get; set; } = null!;
}