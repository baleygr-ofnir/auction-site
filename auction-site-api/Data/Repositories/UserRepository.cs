using auction_site_api.Data.Entities;

namespace auction_site_api.Data.Repositories;

public class UserRepository : GenericRepository<User>
{
    public UserRepository(AuctionContext context) : base(context)
    {
    }

    public override User Update(User updated)
    {
        var user = DbSet.FirstOrDefault(u => u.Id == updated.Id);
        if (user is null) return null;

        if
        (
            !string.IsNullOrWhiteSpace(updated.Email)
            && !string.Equals(user.Email, updated.Email, StringComparison.Ordinal)
        )
        {
            user.Email = updated.Email;
        }

        if
        (
            !string.IsNullOrWhiteSpace(updated.PasswordHash)
            && !string.Equals(user.PasswordHash, updated.PasswordHash, StringComparison.Ordinal)
        )
        {
            user.PasswordHash = updated.PasswordHash;
        }

        user.IsActive = updated.IsActive;

        if (user.IsAdmin != updated.IsAdmin) user.IsAdmin = updated.IsAdmin;

        user.UpdatedAt = DateTime.UtcNow;
        
        return base.Update(user);
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        var user = await FindAsync(user => user.Username.ToLower() == username.ToLower());
        
        return user.FirstOrDefault();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        //if (string.IsNullOrWhiteSpace(email)) return null;
        
        var user = await FindAsync(u => u.Email.ToLower() == email.ToLower());
        
        return user.FirstOrDefault();
    }

    public async Task<User?> GetByUsernameOrEmailAsync(string usernameOrEmail)
    {
        var user = await FindAsync
            (
                user => user.Username.ToLower() == usernameOrEmail.ToLower()
                || user.Email.ToLower() == usernameOrEmail.ToLower()
            );

        return user.FirstOrDefault();
    }
}