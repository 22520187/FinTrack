using AutoMapper;
using FinTrack.Server.Models.DTO;
using FinTrack.Server.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinTrack.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IGoalRepository _goalRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public DashboardController(
            ITransactionRepository transactionRepository,
            IGoalRepository goalRepository,
            ICategoryRepository categoryRepository,
            IMapper mapper)
        {
            _transactionRepository = transactionRepository;
            _goalRepository = goalRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDTO>> GetDashboardSummary()
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            // Get summary data using optimized repository methods
            var totalIncome = await _transactionRepository.GetTotalIncomeByUserIdAsync(userId);
            var totalExpense = await _transactionRepository.GetTotalExpenseByUserIdAsync(userId);
            var totalTransactions = (await _transactionRepository.GetByUserIdAsync(userId)).Count;

            var activeGoals = (await _goalRepository.GetActiveGoalsByUserIdAsync(userId)).Count;
            var totalGoalsSaved = await _goalRepository.GetTotalSavedAmountByUserIdAsync(userId);
            var totalGoalsTarget = await _goalRepository.GetTotalTargetAmountByUserIdAsync(userId);

            var summary = new DashboardSummaryDTO
            {
                TotalIncome = totalIncome,
                TotalExpense = totalExpense,
                Balance = totalIncome - totalExpense,
                TotalTransactions = totalTransactions,
                ActiveGoals = activeGoals,
                TotalGoalsSaved = totalGoalsSaved,
                TotalGoalsTarget = totalGoalsTarget
            };

            return Ok(summary);
        }

        [Authorize]
        [HttpGet("category-expenses")]
        public async Task<ActionResult<IEnumerable<CategoryExpenseDTO>>> GetCategoryExpenses()
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            // Get all expense transactions for user
            var expenseTransactions = await _transactionRepository.GetTransactionsByUserIdAndTypeAsync(userId, "expense");

            // Group by category and calculate totals
            var categoryExpenses = expenseTransactions
                .GroupBy(t => t.CategoryName ?? "Other")
                .Select((group, index) => new
                {
                    name = group.Key,
                    value = group.Sum(t => t.Amount),
                    color = GetCategoryColor(index),
                    transactionCount = group.Count()
                })
                .OrderByDescending(c => c.value)
                .ToList();

            return Ok(categoryExpenses);
        }

        [Authorize]
        [HttpGet("transaction-history")]
        public async Task<ActionResult<IEnumerable<TransactionHistoryDTO>>> GetTransactionHistory([FromQuery] int months = 6)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            // Get transactions from the last specified months
            var startDate = DateTime.UtcNow.AddMonths(-months);
            var endDate = DateTime.UtcNow;
            var recentTransactions = await _transactionRepository.GetTransactionsByUserIdAndDateRangeAsync(userId, startDate, endDate);

            // Group by month and calculate totals
            var monthlyData = recentTransactions
                .GroupBy(t => new {
                    Year = t.CreatedAt?.Year ?? DateTime.UtcNow.Year,
                    Month = t.CreatedAt?.Month ?? DateTime.UtcNow.Month
                })
                .Select(group => new
                {
                    date = new DateTime(group.Key.Year, group.Key.Month, 1).ToString("MMM"),
                    income = group.Where(t => t.Type?.ToLower() == "income").Sum(t => t.Amount),
                    expense = group.Where(t => t.Type?.ToLower() == "expense").Sum(t => t.Amount),
                    year = group.Key.Year,
                    month = group.Key.Month
                })
                .OrderBy(m => m.year)
                .ThenBy(m => m.month)
                .ToList();

            return Ok(monthlyData);
        }

        private string GetCategoryColor(int index)
        {
            var colors = new[]
            {
                "#50bbf5", // primary-400
                "#5069f5", // secondary-400
                "#f58a50", // compleprimary-300
                "#f4ee69", // complesecond-400
                "#46aff2", // primary-500
                "#ff6b6b", // red
                "#4ecdc4", // teal
                "#45b7d1", // blue
                "#96ceb4", // green
                "#feca57"  // yellow
            };

            return colors[index % colors.Length];
        }
    }
}
