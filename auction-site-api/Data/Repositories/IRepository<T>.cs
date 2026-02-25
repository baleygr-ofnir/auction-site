using System.Linq.Expressions;

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