using System.Linq.Expressions;
using auction_site_api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace auction_site_api.Data.Repositories;

public abstract class GenericRepository<T> : IRepository<T> where T : class
{
    protected readonly AuctionContext Context;
    protected readonly DbSet<T> DbSet;
    
    public GenericRepository(AuctionContext context)
    {
        Context = context;
        DbSet = Context.Set<T>();
    }
    
    public virtual async Task<T> AddAsync(T entity)
    {
        await DbSet.AddAsync(entity);
        return entity;
    }

    public virtual async Task<T?> GetAsync(Guid id)
    {
        return await DbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> AllAsync()
    {
        return await DbSet
            .AsNoTracking()
            .ToListAsync();
    }

    public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await DbSet
            .Where(predicate)
            .AsNoTracking()
            .ToListAsync();
    }

    public virtual T Update(T entity)
    {
        DbSet.Update(entity);
        return entity;
    }

    public virtual async Task<bool> Delete(Guid id)
    {
        var entity = await GetAsync(id);
        if (entity is null) return false;
        DbSet.Remove(entity);
        return true;
    }

    public async Task<int> SaveChangesAsync()
    {
        return await Context.SaveChangesAsync();
    }
}