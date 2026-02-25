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

        if (user.IsActive != updated.IsActive) user.IsActive = updated.IsActive;

        if (user.IsAdmin != updated.IsAdmin) user.IsAdmin = updated.IsAdmin;

        user.UpdatedAt = DateTime.UtcNow;
        
        DbSet.Update(user);
        return user;
    }
}