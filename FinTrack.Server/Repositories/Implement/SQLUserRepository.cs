using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLUserRepository : FinTrackRepository<User>, IUserRepository
    {
        public SQLUserRepository(FinTrackDbContext dbContext) : base(dbContext)
        {
        }
    }
}
