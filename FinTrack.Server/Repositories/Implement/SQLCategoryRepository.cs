using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLCategoryRepository : FinTrackRepository<Category>, ICategoryRepository
    {
        public SQLCategoryRepository(FinTrackDbContext dbContext) : base(dbContext)
        {
        }
    }
}
