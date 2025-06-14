using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using FinTrack.Server.Models.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLReportRepository : FinTrackRepository<Report>, IReportRepository
    {
        private readonly ITransactionRepository _transactionRepository;
        public SQLReportRepository(FinTrackDbContext dbContext, ITransactionRepository transactionRepository) : base(dbContext)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<FinancialSumaryDTO> GetFinancialSummaryAsync(int userId, DateTime startDate, DateTime endDate)
        {
            var transactions = await dbContext.Transactions
            .Where(t => t.UserId == userId && t.CreatedAt
            >= startDate && t.CreatedAt <= endDate)
            .ToListAsync();

            var MonthlyData = transactions
            .GroupBy(t => new { Month = t.CreatedAt.Value.Month, Year = t.CreatedAt.Value.Year })
            .OrderBy(g => g.Key.Year)
            .ThenBy(g => g.Key.Month)
            .Select(g => new MonthlyDataDTO
            {
                Month = $"{g.Key.Month}/{g.Key.Year}",
                Income = g.Where(t => t.Type == "Income").Sum(t => t.Amount),
                Expense = g.Where(t => t.Type == "Expense").Sum(t => t.Amount)
            })
            .ToList();

            // Calculate sumary
            decimal totalIncome = transactions.Where(t => t.Type == "Income").Sum(t => t.Amount);
            decimal totalExpense = transactions.Where(t => t.Type == "Expense").Sum(t => t.Amount);
            decimal savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

            return new FinancialSumaryDTO
            {
                MonthlyData = MonthlyData,
                TotalIncome = totalIncome,
                TotalExpense = totalExpense,
                SavingsRate = savingsRate
            };
        }

        public async Task<List<CategoryExpenseDTO>> GetCategoryExpensesAsync(int userId, DateTime startDate, DateTime endDate)
        {
            var transactions = await dbContext.Transactions
            .Where(t => t.UserId == userId && t.Type == "Expense" && t.CreatedAt >= startDate && t.CreatedAt <= endDate)
            .ToListAsync();

            // Group by category
            var categoryExpenses = transactions
            .GroupBy(t => t.CategoryName)
            .Select(g => new CategoryExpenseDTO
            {
                Category = g.Key,
                Amount = g.Sum(t => t.Amount)
            })
            .OrderByDescending(c => c.Amount)
            .ToList();

            return categoryExpenses;
        }

        public async Task<string> GenerateAndSaveReportAsync(int userId, string type, string period, string format)
        {
            
            string fileName = $"report_{userId}_{period}_{DateTime.Now:yyyyMMddHHmmss}.{format.ToLower()}";

            var report = new Report
            {
                UserId = userId,
                Type = type,
                Period = period,
                FileUrl = fileName,
                CreatedAt = DateTime.UtcNow
            };

            await CreateAsync(report);

            return fileName;
        }
    }
}
