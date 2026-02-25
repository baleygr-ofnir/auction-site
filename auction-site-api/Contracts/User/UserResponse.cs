namespace auction_site_api.Contracts.User;

public class UserResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool IsActive { get; set; }
    public bool IsAdmin { get; set; }
}