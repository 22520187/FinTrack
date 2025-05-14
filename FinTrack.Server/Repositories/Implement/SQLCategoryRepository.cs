using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLCategoryRepository : FinTrackRepository<Category>, ICategoryRepository
    {
        public SQLCategoryRepository(FinTrackDbContext dbContext) : base(dbContext)
        {

        }

        public async Task<decimal> GetTotalSpentAsync(string categoryName, string type, int userId)
        {
            return await dbContext.Transactions
                .Where(t => t.CategoryName == categoryName && t.Type == type && t.UserId == userId)
                .SumAsync(t => t.Amount);
        }

    }
}
