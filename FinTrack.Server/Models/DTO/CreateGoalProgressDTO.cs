using System;

namespace FinTrack.Server.Models.DTO
{
    public class CreateGoalProgressDTO
    {
        public int GoalId { get; set; }
        public decimal SavedAmount { get; set; }
    }
}
