using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Server.Repositories.Implement
{
    public class SQLTransactionRepository : FinTrackRepository<Transaction>, ITransactionRepository
    {
        public SQLTransactionRepository(FinTrackDbContext dbContext) : base(dbContext)
        {
        }
    }
}
