using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLReportRepository : FinTrackRepository<Report>, IReportRepository
    {
        public SQLReportRepository(FinTrackDbContext dbContext) : base(dbContext)
        {
        }
    }
}
