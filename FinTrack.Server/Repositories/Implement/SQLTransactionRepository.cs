using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLTransactionRepository : FinTrackRepository<Transaction>, ITransactionRepository
    {
        public SQLTransactionRepository(FinTrackDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<List<Transaction>> GetTransactionsByUserIdAsync(int userId)
        {
            return await _dbSet.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task<List<Transaction>> GetTransactionsByCategoryNameAsync(string CategoryName, int UserId)
        {
            return await _dbSet.Where(t => t.UserId == UserId && t.CategoryName == CategoryName).ToListAsync();
        }

        public async Task<decimal> GetTotalIncomeByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(t => t.UserId == userId && t.Type.ToLower() == "income")
                .SumAsync(t => t.Amount);
        }

        public async Task<decimal> GetTotalExpenseByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(t => t.UserId == userId && t.Type.ToLower() == "expense")
                .SumAsync(t => t.Amount);
        }

        public async Task<List<Transaction>> GetTransactionsByUserIdAndDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Where(t => t.UserId == userId && t.CreatedAt >= startDate && t.CreatedAt <= endDate)
                .ToListAsync();
        }

        public async Task<List<Transaction>> GetTransactionsByUserIdAndTypeAsync(int userId, string type)
        {
            return await _dbSet
                .Where(t => t.UserId == userId && t.Type.ToLower() == type.ToLower())
                .ToListAsync();
        }
    }
}