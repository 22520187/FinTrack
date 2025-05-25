using System;

namespace FinTrack.Server.Models.DTO
{
    public class TransactionHistoryDTO
    {
        public string Period { get; set; } = null!; // "Jan", "Feb", etc. or "2023-01"
        public decimal Income { get; set; }
        public decimal Expense { get; set; }
        public decimal Net => Income - Expense;
        public int Year { get; set; }
        public int Month { get; set; }
    }
}
