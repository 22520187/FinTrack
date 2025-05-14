using AutoMapper;
using FinTrack.Server.Models.Domain;
using FinTrack.Server.Models.ResponseModels;

namespace HealthBuddy.Server.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
        }
    }
}