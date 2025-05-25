using FinTrack.Server.Models.Domain;

namespace FinTrack.Server.Repositories
{
    public interface IGoalRepository : IFinTrackRepository<Goal>
    {
        Task<List<Goal>> GetActiveGoalsByUserIdAsync(int userId);
        Task<decimal> GetTotalSavedAmountByUserIdAsync(int userId);
        Task<decimal> GetTotalTargetAmountByUserIdAsync(int userId);
    }
}