using System.Linq.Expressions;

namespace auction_site_api.Core;

public interface IService<T> where T : class
{
    Task<T> AddAsync(T entity);
    Task<T?> GetAsync(Guid id);
    Task<IEnumerable<T>> AllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T?> Update(Guid id, T entity);
    Task<bool> Delete(Guid id);
}