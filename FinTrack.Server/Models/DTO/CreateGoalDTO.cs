using System;

namespace FinTrack.Server.Models.DTO
{
    public class CreateGoalDTO
    {
        public string Title { get; set; } = null!;
        public decimal TargetAmount { get; set; }
        public DateOnly Deadline { get; set; }
        public decimal? SavedAmount { get; set; } = 0;
    }
}
