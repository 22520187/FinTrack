using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLBudgetRepository : FinTrackRepository<Budget>, IBudgetRepository
    {
        public SQLBudgetRepository(FinTrackDbContext dbContext) : base(dbContext)
        {
        }
    }
}
