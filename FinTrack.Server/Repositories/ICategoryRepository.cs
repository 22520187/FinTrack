using FinTrack.Server.Models.Domain;

namespace FinTrack.Server.Repositories
{
    public interface ICategoryRepository : IFinTrackRepository<Category>
    {
        Task<decimal> GetTotalSpentAsync(string categoryName, string type, int userId);
    }
}