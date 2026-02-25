using auction_site_api.Contracts.User;
using auction_site_api.Data.Entities;
using AutoMapper;

namespace auction_site_api.Mapping;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<UserRegisterRequest, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

        CreateMap<User, UserResponse>();
        
        CreateMap<UserUpdateRequest, User>()
            .ForAllMembers
            (
                opts
                    => opts.Condition((src, dest, srcMember)
                        => srcMember != null)
            );
    }
}