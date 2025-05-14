using System;

namespace FinTrack.Server.Models.DTO
{
    public class UserDTO
    {
        public int UserId { get; set; }

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;
    }
}