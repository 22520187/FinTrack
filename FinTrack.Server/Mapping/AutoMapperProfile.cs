using AutoMapper;
using FinTrack.Server.Models.Domain;
using FinTrack.Server.Models.DTO;
using BCrypt.Net;
using FinTrack.Server.Models.ResponseModels;


namespace HealthBuddy.Server.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {

            CreateMap<Transaction, TransactionDTO>();
            CreateMap<TransactionDTO, Transaction>();

            CreateMap<Transaction, CreateTransactionDTO>();
            CreateMap<CreateTransactionDTO, Transaction>();


            CreateMap<User, UserDTO>();

            CreateMap<User, CreateUserDTO>();
            CreateMap<CreateUserDTO, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => BCrypt.Net.BCrypt.HashPassword(src.Password)));

            CreateMap<Category, CreateCategoryDTO>();
            CreateMap<CreateCategoryDTO, Category>();

            CreateMap<Category, CategoryDTO>();
            CreateMap<CategoryDTO, Category>();
            CreateMap<User, UserDto>();

            // Goal mappings
            CreateMap<Goal, GoalDTO>();
            CreateMap<GoalDTO, Goal>();
            CreateMap<Goal, CreateGoalDTO>();
            CreateMap<CreateGoalDTO, Goal>();

            // GoalProgress mappings
            CreateMap<GoalProgress, GoalProgressDTO>();
            CreateMap<GoalProgressDTO, GoalProgress>();
            CreateMap<GoalProgress, CreateGoalProgressDTO>();
            CreateMap<CreateGoalProgressDTO, GoalProgress>();

        }
    }
}