using auction_site_api.Contracts.Auction;
using auction_site_api.Contracts.Bid;
using auction_site_api.Data.Entities;
using AutoMapper;

namespace auction_site_api.Mapping;

public class AuctionProfile : Profile
{

    public AuctionProfile()
    {
        CreateMap<AuctionCreateRequest, Auction>();
        
        CreateMap<AuctionUpdateRequest, Auction>()
            .ForAllMembers(opt
                => opt.Condition((src, dest, srcMember) => srcMember != null));
        
        CreateMap<Auction, AuctionResponse>();

        CreateMap<Auction, AuctionListItemResponse>()
            .ForMember(dest => dest.CurrentPrice, opt => opt.Ignore());

        CreateMap<Auction, ClosedAuctionResponse>()
            .ForMember(dest => dest.WinningBidAmount, opt => opt.Ignore())
            .ForMember(dest => dest.WinningUserId, opt => opt.Ignore());
        
        CreateMap<Bid, BidSummaryResponse>();

        CreateMap<BidCreateRequest, Bid>()
            .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Amount));
    }
}