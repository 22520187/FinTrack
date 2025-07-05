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
        // Khởi tạo repository kế thừa từ FinTrackRepository
        public SQLTransactionRepository(FinTrackDbContext dbContext) : base(dbContext)
        {
        }

        // Lấy tất cả transaction của user sắp xếp theo ngày tạo giảm dần
        public async Task<List<Transaction>> GetTransactionsByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        // Lấy transaction theo tên category và user ID
        public async Task<List<Transaction>> GetTransactionsByCategoryNameAsync(string CategoryName, int UserId)
        {
            return await _dbSet
                .Where(t => t.UserId == UserId && t.CategoryName == CategoryName)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        // Tính tổng thu nhập của user
        public async Task<decimal> GetTotalIncomeByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(t => t.UserId == userId && t.Type.ToLower() == "income")
                .SumAsync(t => t.Amount);
        }

        // Tính tổng chi tiêu của user
        public async Task<decimal> GetTotalExpenseByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(t => t.UserId == userId && t.Type.ToLower() == "expense")
                .SumAsync(t => t.Amount);
        }

        // Lấy transaction trong khoảng thời gian
        public async Task<List<Transaction>> GetTransactionsByUserIdAndDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Where(t => t.UserId == userId && t.CreatedAt >= startDate && t.CreatedAt <= endDate)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        // Lấy transaction theo loại (income/expense)
        public async Task<List<Transaction>> GetTransactionsByUserIdAndTypeAsync(int userId, string type)
        {
            return await _dbSet
                .Where(t => t.UserId == userId && t.Type.ToLower() == type.ToLower())
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        // Override phương thức base để thêm sắp xếp theo CreatedAt
        public new async Task<List<Transaction>> GetByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }
    }
}