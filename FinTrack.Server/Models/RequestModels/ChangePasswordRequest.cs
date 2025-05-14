using System.ComponentModel.DataAnnotations;

namespace FinTrack.Server.Models.RequestModels
{
    public class ChangePasswordRequest
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }
    }
}
