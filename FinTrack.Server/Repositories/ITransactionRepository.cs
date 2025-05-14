using FinTrack.Server.Models.Domain;

namespace FinTrack.Server.Repositories
{
    public interface ITransactionRepository : IFinTrackRepository<Transaction>
    {
       Task<List<Transaction>> GetTransactionsByUserIdAsync(int UserId);
       Task<List<Transaction>> GetTransactionsByCategoryNameAsync(string CategoryName, int UserId);
    }
}