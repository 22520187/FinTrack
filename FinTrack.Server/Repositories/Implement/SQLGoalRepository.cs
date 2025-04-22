using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLGoalRepository : FinTrackRepository<Goal>, IGoalRepository
    {
        public SQLGoalRepository(FinTrackDbContext dbContext) : base(dbContext)
        {
        }
    }
}
