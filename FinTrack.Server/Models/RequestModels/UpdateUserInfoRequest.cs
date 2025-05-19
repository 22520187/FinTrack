using System.ComponentModel.DataAnnotations;

namespace FinTrack.Server.Models.RequestModels
{
    public class UpdateUserInfoRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public string FullName { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        public string? Phone { get; set; }

        public string? City { get; set; }

        public string? District { get; set; }

        public string? Ward { get; set; }
    }
}
