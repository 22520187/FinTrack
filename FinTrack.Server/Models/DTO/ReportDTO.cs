using System;

namespace FinTrack.Server.Models.DTO
{
    public class ReportDTO
    {
        public int ReportId { get; set; }
        public int? UserId { get; set; }
        public string Type { get; set; }
        public string Period { get; set; }
        public string FileUrl { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class MonthlyDataDTO
    {
        public string Month { get; set; }
        public decimal Income { get; set; }
        public decimal Expense { get; set; }
    }

    public class FinancialSumaryDTO
    {
        public List<MonthlyDataDTO> MonthlyData { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal SavingsRate { get; set; }
    }

    public class ReportCategoryExpenseDTO
    {
        public string Category { get; set; }
        public decimal Amount { get; set; }
    }
}