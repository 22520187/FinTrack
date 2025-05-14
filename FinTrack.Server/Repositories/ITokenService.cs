using FinTrack.Server.Models.Domain;

namespace FinTrack.Server.Repositories
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
