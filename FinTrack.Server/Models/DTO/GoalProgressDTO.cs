using System;

namespace FinTrack.Server.Models.DTO
{
    public class GoalProgressDTO
    {
        public int ProgressId { get; set; }
        public int? GoalId { get; set; }
        public decimal SavedAmount { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
