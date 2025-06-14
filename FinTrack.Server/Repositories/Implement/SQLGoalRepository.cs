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

        public async Task<List<Goal>> GetActiveGoalsByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(g => g.UserId == userId && (g.SavedAmount ?? 0) < g.TargetAmount)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalSavedAmountByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(g => g.UserId == userId)
                .SumAsync(g => g.SavedAmount ?? 0);
        }

        public async Task<decimal> GetTotalTargetAmountByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(g => g.UserId == userId)
                .SumAsync(g => g.TargetAmount);
        }
    }
}
