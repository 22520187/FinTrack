using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

using FinTrack.Server.Models;

namespace FinTrack.Server.Repositories.Implement
{
    public class FinTrackRepository<T> : IFinTrackRepository<T> where T : class
    {
        protected readonly FinTrackDbContext dbContext;
        protected DbSet<T> _dbSet;
        
        // Khởi tạo repository với DbContext và DbSet tương ứng
        public FinTrackRepository(FinTrackDbContext dbContext)
        {
            this.dbContext = dbContext;
            _dbSet = dbContext.Set<T>();
        }
        
        // Tạo mới một record trong database
        public async Task<T> CreateAsync(T dbRecord)
        {
            var sql = dbContext.ChangeTracker.DebugView.LongView;

            await _dbSet.AddAsync(dbRecord);
            await dbContext.SaveChangesAsync();
            return dbRecord;
        }
        
        // Xóa record theo điều kiện filter
        public async Task<T> DeleteAsync(Expression<Func<T, bool>> filter)
        {
            var existingRecord = await _dbSet.FirstOrDefaultAsync(filter);
            if (existingRecord == null)
            {
                return null;
            }

            _dbSet.Remove(existingRecord);
            await dbContext.SaveChangesAsync();
            return existingRecord;
        }
        
        // Lấy tất cả records
        public async Task<List<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }
        
        // Lấy một record theo điều kiện filter
        public async Task<T> GetByIdAsync(Expression<Func<T, bool>> filter)
        {
            return await _dbSet.FirstOrDefaultAsync(filter);
        }

        // Cập nhật record theo điều kiện filter
        public async Task<T> UpdateAsync(Expression<Func<T, bool>> filter, Action<T> UpdateRecord)
        {
            var existingRecord = _dbSet.FirstOrDefault(filter);
            if (existingRecord == null)
            {
                return null;
            }

            //Only Change Body and UpdateAt
            UpdateRecord(existingRecord);

            await dbContext.SaveChangesAsync();
            return existingRecord;
        }

        // Lấy tất cả records theo UserId
        public async Task<List<T>> GetByUserIdAsync(int userId)
        {
            return await _dbSet.Where(entity => EF.Property<int>(entity, "UserId") == userId).ToListAsync();
        }
    }
}