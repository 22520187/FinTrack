using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLGoalProgressRepository : FinTrackRepository<GoalProgress>, IGoalProgressRepository
    {
        public SQLGoalProgressRepository(FinTrackDbContext dbContext) : base(dbContext)
        {
        }
    }
}
