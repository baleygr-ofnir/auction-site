using auction_site_api.Data.Entities;
using auction_site_api.Data.Repositories;
using AutoMapper;

namespace auction_site_api.Core.Services;

public class BidService : GenericService<Bid>
{
    public BidService(IRepository<Bid> repository, IMapper mapper) : base(repository, mapper)
    {
    }
}