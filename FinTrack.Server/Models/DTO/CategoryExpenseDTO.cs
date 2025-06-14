using System;

namespace FinTrack.Server.Models.DTO
{
    public class CategoryExpenseDTO
    {
        public string CategoryName { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public string Color { get; set; } = "#50bbf5"; // Default color
        public int TransactionCount { get; set; }
    }
}
