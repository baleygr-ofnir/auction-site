using System.Linq.Expressions;
using auction_site_api.Data.Entities;

namespace auction_site_api.Data.Repositories;

public interface IRepository<T>
{
    Task<T> AddAsync(T entity);
    Task<T?> GetAsync(Guid id);
    Task<IEnumerable<T>> AllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    T Update(T entity);
    Task<bool> Delete(Guid id);
    Task<int> SaveChangesAsync();
}