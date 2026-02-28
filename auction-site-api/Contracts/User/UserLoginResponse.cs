namespace auction_site_api.Contracts.User;

public class UserLoginResponse
{
    public string Token { get; set; } = null!;
    public UserResponse User { get; set; } = null!;
}