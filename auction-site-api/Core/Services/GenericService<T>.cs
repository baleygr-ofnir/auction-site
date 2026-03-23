using System.Linq.Expressions;
using auction_site_api.Data.Repositories;
using AutoMapper;

namespace auction_site_api.Core.Services;

public abstract class GenericService<T> : IService<T> where T : class
{
    protected readonly IRepository<T> Repository;
    protected readonly IMapper Mapper;

    public GenericService(IRepository<T> repository, IMapper mapper)
    {
        Repository = repository;
        Mapper = mapper;
    }
    
    public virtual async Task<T> AddAsync(T entity)
    {
        var added = await Repository.AddAsync(entity);
        await Repository.SaveChangesAsync();

        return added;
    }

    public virtual async Task<T?> GetAsync(Guid id) => await Repository.GetAsync(id);

    public virtual async Task<IEnumerable<T>> AllAsync() => await Repository.AllAsync();

    public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate) =>
        await Repository.FindAsync(predicate);
    
    public async Task<T?> Update(Guid id, T entity)
    {
        var updated = Repository.Update(entity);
        await Repository.SaveChangesAsync();

        var stored = await Repository.GetAsync(id);
        
        return stored;
    }

    public virtual async Task<bool> Delete(Guid id)
    {
        var deleted = await Repository.Delete(id);
        if (deleted) await Repository.SaveChangesAsync();

        return deleted;
    }
}