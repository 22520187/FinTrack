using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using FinTrack.Server.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Server.Repositories
{
    public interface IReportRepository : IFinTrackRepository<Report>
    {
        Task<FinancialSumaryDTO> GetFinancialSummaryAsync(int userId, DateTime startDate, DateTime endDate);
        Task<List<CategoryExpenseDTO>> GetCategoryExpensesAsync(int userId, DateTime startDate, DateTime endDate);
        Task<string> GenerateAndSaveReportAsync(int userId, string type, string period, string format);
    }
}