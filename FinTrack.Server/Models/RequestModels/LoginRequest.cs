using System.ComponentModel.DataAnnotations;

namespace FinTrack.Server.Models.RequestModels
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}