using auction_site_api.Data.Entities;
using auction_site_api.Data.Repositories;
using AutoMapper;

namespace auction_site_api.Core.Services;

public class UserService : GenericService<User>
{
    public UserService(IRepository<User> repository, IMapper mapper) : base(repository, mapper)
    {
    }
}