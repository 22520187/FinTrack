using FinTrack.Server.Models.Domain;

namespace FinTrack.Server.Repositories
{
    public interface ITransactionRepository : IFinTrackRepository<Transaction>
    {
       Task<List<Transaction>> GetTransactionsByUserIdAsync(int UserId);
       Task<List<Transaction>> GetTransactionsByCategoryNameAsync(string CategoryName, int UserId);
       Task<decimal> GetTotalIncomeByUserIdAsync(int userId);
       Task<decimal> GetTotalExpenseByUserIdAsync(int userId);
       Task<List<Transaction>> GetTransactionsByUserIdAndDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
       Task<List<Transaction>> GetTransactionsByUserIdAndTypeAsync(int userId, string type);
    }
}