using System;

namespace FinTrack.Server.Models.DTO
{
    public class GoalDTO
    {
        public int GoalId { get; set; }
        public int? UserId { get; set; }
        public string Title { get; set; } = null!;
        public decimal TargetAmount { get; set; }
        public DateOnly Deadline { get; set; }
        public decimal? SavedAmount { get; set; }
        public DateTime? CreatedAt { get; set; }
        public decimal ProgressPercentage => TargetAmount > 0 ? (SavedAmount ?? 0) / TargetAmount * 100 : 0;
        public bool IsCompleted => SavedAmount >= TargetAmount;
    }
}
