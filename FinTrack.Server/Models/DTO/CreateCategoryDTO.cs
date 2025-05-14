using System;

namespace FinTrack.Server.Models.DTO
{
    public class CreateCategoryDTO
    {
        public int? UserId { get; set; }

        public string CategoryName { get; set; } = null!;

        public string? Type { get; set; }

        public bool? IsDefault { get; set; }
    }
}