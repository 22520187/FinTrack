using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using FinTrack.Server.Models.DTO;
using FinTrack.Server.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.Logging;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLReportRepository : FinTrackRepository<Report>, IReportRepository
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly ReportGenerationService _reportGenerationService;
        private readonly ILogger<SQLReportRepository> _logger;

        public SQLReportRepository(
            FinTrackDbContext dbContext, 
            ITransactionRepository transactionRepository,
            ReportGenerationService reportGenerationService,
            ILogger<SQLReportRepository> logger) : base(dbContext)
        {
            _transactionRepository = transactionRepository;
            _reportGenerationService = reportGenerationService;
            _logger = logger;
        }

        public async Task<FinancialSumaryDTO> GetFinancialSummaryAsync(int userId, DateTime startDate, DateTime endDate)
        {
            try
            {
                _logger.LogInformation($"Getting financial summary for user {userId} from {startDate:yyyy-MM-dd} to {endDate:yyyy-MM-dd}");

                var transactions = await dbContext.Transactions
                    .Where(t => t.UserId == userId && t.CreatedAt != null && t.CreatedAt >= startDate && t.CreatedAt <= endDate)
                    .ToListAsync();

                _logger.LogInformation($"Found {transactions.Count} transactions for user {userId}");
                
                // Log some sample transactions for debugging
                if (transactions.Any())
                {
                    var sampleTransaction = transactions.First();
                    _logger.LogInformation($"Sample transaction: {sampleTransaction.Amount}, {sampleTransaction.Type}, {sampleTransaction.CreatedAt}");
                }

                var MonthlyData = transactions
                    .GroupBy(t => new { Month = t.CreatedAt!.Value.Month, Year = t.CreatedAt!.Value.Year })
                    .OrderBy(g => g.Key.Year)
                    .ThenBy(g => g.Key.Month)
                    .Select(g => new MonthlyDataDTO
                    {
                        Month = $"{g.Key.Month}/{g.Key.Year}",
                        Income = g.Where(t => t.Type.ToLower() == "income").Sum(t => t.Amount),
                        Expense = g.Where(t => t.Type.ToLower() == "expense").Sum(t => t.Amount)
                    })
                    .ToList();

                _logger.LogInformation($"Generated {MonthlyData.Count} monthly data points");

                // Calculate summary
                decimal totalIncome = transactions.Where(t => t.Type.ToLower() == "income").Sum(t => t.Amount);
                decimal totalExpense = transactions.Where(t => t.Type.ToLower() == "expense").Sum(t => t.Amount);
                decimal savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

                _logger.LogInformation($"Summary: Income={totalIncome}, Expense={totalExpense}, SavingsRate={savingsRate:F2}%");

                return new FinancialSumaryDTO
                {
                    MonthlyData = MonthlyData,
                    TotalIncome = totalIncome,
                    TotalExpense = totalExpense,
                    SavingsRate = savingsRate
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting financial summary for user {userId}");
                throw new Exception($"Error getting financial summary: {ex.Message}", ex);
            }
        }

        public async Task<List<ReportCategoryExpenseDTO>> GetCategoryExpensesAsync(int userId, DateTime startDate, DateTime endDate)
        {
            try
            {
                _logger.LogInformation($"Getting category expenses for user {userId} from {startDate} to {endDate}");

                var transactions = await dbContext.Transactions
                    .Where(t => t.UserId == userId && t.Type.ToLower() == "expense" && t.CreatedAt != null && t.CreatedAt >= startDate && t.CreatedAt <= endDate)
                    .ToListAsync();

                _logger.LogInformation($"Found {transactions.Count} expense transactions");

                // Group by category
                var categoryExpenses = transactions
                    .GroupBy(t => t.CategoryName)
                    .Select(g => new ReportCategoryExpenseDTO
                    {
                        Category = g.Key,
                        Amount = g.Sum(t => t.Amount)
                    })
                    .OrderByDescending(c => c.Amount)
                    .ToList();

                _logger.LogInformation($"Generated {categoryExpenses.Count} category expenses");

                return categoryExpenses;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting category expenses for user {userId}");
                throw new Exception($"Error getting category expenses: {ex.Message}", ex);
            }
        }

        public async Task<string> GenerateAndSaveReportAsync(int userId, string type, string period, string format)
        {
            DateTime startDate;
            DateTime endDate;

            if (period.Contains("_to_"))
            {
                var dateParts = period.Split("_to_");
                if (dateParts.Length == 2 && 
                    DateTime.TryParse(dateParts[0], out startDate) && 
                    DateTime.TryParse(dateParts[1], out endDate))
                {
                    endDate = endDate.Date.AddDays(1).AddTicks(-1);
                }
                else
                {
                    startDate = GetStartDateFromPeriod(period);
                    endDate = DateTime.Now;
                }
            }
            else
            {
                startDate = GetStartDateFromPeriod(period);
                endDate = DateTime.Now;
            }

            string detailedPeriod = GetDetailedPeriodDescription(period, startDate, endDate);

            var summary = await GetFinancialSummaryAsync(userId, startDate, endDate);
            var categoryExpenses = await GetCategoryExpensesAsync(userId, startDate, endDate);

            // Generate filename with correct extension
            string extension = format.ToLower() == "excel" ? "xlsx" : format.ToLower();
            string fileName = $"report_{userId}_{period}_{DateTime.Now:yyyyMMddHHmmss}.{extension}";

            // Generate report based on format
            string filePath = format.ToLower() switch
            {
                "pdf" => await _reportGenerationService.GeneratePdfReportAsync(summary, categoryExpenses, fileName),
                "excel" => await _reportGenerationService.GenerateExcelReportAsync(summary, categoryExpenses, fileName),
                _ => throw new ArgumentException($"Unsupported format: {format}")
            };

            // Save report record with detailed period
            var report = new Report
            {
                UserId = userId,
                Type = null,
                Period = detailedPeriod, 
                FileUrl = fileName,
                CreatedAt = DateTime.UtcNow
            };

            await CreateAsync(report);

            return fileName;
        }

        private string GetDetailedPeriodDescription(string period, DateTime startDate, DateTime endDate)
        {
            if (int.TryParse(period, out int year))
            {
                return year.ToString();
            }

            string lowerPeriod = period.ToLower();
            
            return lowerPeriod switch
            {
                "month" => "1M",
                "quarter" => "3M", 
                "halfyear" => "6M",
                "year" => "12M",
                "last12months" => "12M",
                var p when p.Contains("six months") => "6M",
                var p when p.Contains("6 months") => "6M", 
                var p when p.Contains("month") && p.Contains("1") => "1M",
                var p when p.Contains("quarter") => "3M",
                var p when p.Contains("12 months") => "12M",
                _ => period.Length <= 10 ? period : period.Substring(0, 10)
            };
        }

        private DateTime GetStartDateFromPeriod(string period)
        {
            if (int.TryParse(period, out int year))
            {
                return new DateTime(year, 1, 1);
            }

            return period.ToLower() switch
            {
                "month" => DateTime.Now.AddMonths(-1),
                "quarter" => DateTime.Now.AddMonths(-3),
                "halfyear" => DateTime.Now.AddMonths(-6),
                "year" => DateTime.Now.AddMonths(-12),
                "last12months" => DateTime.Now.AddMonths(-12),
                _ => DateTime.Now.AddMonths(-12)
            };
        }
    }
}
