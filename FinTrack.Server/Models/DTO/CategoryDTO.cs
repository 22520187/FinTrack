using System;

namespace FinTrack.Server.Models.DTO
{
    public class CategoryDTO
    {
        public string CategoryName { get; set; } = null!;

        public string? Type { get; set; }

        public bool? IsDefault { get; set; }

        public float? TotalSpentAmount {get; set;}
    }
}