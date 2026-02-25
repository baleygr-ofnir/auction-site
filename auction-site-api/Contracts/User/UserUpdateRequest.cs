namespace auction_site_api.Contracts.User;

public class UserUpdateRequest
{
    public string? Email { get; set; }
    public string? Password { get; set; }
    
    public bool? IsActive { get; set; }
    public bool? IsAdmin { get; set; }
}