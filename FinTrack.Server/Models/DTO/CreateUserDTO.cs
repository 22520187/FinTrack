using System;

namespace FinTrack.Server.Models.DTO
{
    public class CreateUserDTO
    {
        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public DateTime? CreatedAt { get; set; }
    }
}