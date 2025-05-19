using System.ComponentModel.DataAnnotations;

namespace FinTrack.Server.Models.RequestModels
{
    public class UpdateUserInfoRequest
    {

        public string FullName { get; set; } = null!;

        public string? Phone { get; set; }

        public string? City { get; set; }

        public string? District { get; set; }

        public string? Ward { get; set; }
    }
}
