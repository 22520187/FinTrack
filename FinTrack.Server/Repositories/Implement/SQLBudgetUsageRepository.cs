using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLBudgetUsageRepository : FinTrackRepository<BudgetUsage>, IBudgetUsageRepository
    {
        public SQLBudgetUsageRepository(FinTrackDbContext dbContext) : base(dbContext)
        {
        }
    }
}
