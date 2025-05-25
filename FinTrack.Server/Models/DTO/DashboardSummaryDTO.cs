using System;

namespace FinTrack.Server.Models.DTO
{
    public class DashboardSummaryDTO
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal Balance { get; set; }
        public int TotalTransactions { get; set; }
        public int ActiveGoals { get; set; }
        public decimal TotalGoalsSaved { get; set; }
        public decimal TotalGoalsTarget { get; set; }
    }
}
