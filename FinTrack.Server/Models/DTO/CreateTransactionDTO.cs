using System;

namespace FinTrack.Server.Models.DTO
{
    public class CreateTransactionDTO
    {
        public int? UserId { get; set; }
        public decimal Amount { get; set; }
        public string? Type { get; set; }
        public string? Note { get; set; }
        public bool? IsImportant { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? CategoryName { get; set; }  
    }
}