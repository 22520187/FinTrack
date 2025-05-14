using AutoMapper;
using FinTrack.Server.Models.Domain;
using FinTrack.Server.Models.RequestModels;
using FinTrack.Server.Models.ResponseModels;
using FinTrack.Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Cryptography;
using System.Text;

namespace FinTrack.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;

        public AccountController(
            IUserRepository userRepository,
            ITokenService tokenService,
            IMemoryCache cache,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _mapper = mapper;
            _cache = cache;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            // Check if email already exists
            var existingUser = await _userRepository.GetByIdAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = "Email already registered"
                });
            }

            // Create new user
            var user = new User
            {
                Email = request.Email,
                FullName = request.FullName,
                PasswordHash = HashPassword(request.Password),
                CreatedAt = DateTime.Now
            };

            // Save user to database
            await _userRepository.CreateAsync(user);

            // Create token
            var token = _tokenService.CreateToken(user);

            // Map user to DTO
            var userDto = _mapper.Map<UserDto>(user);

            // Return response
            return Ok(new AuthResponse
            {
                Success = true,
                Message = "Registration successful",
                Token = token,
                User = userDto
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginRequest request)
        {
            // Find user by email
            var user = await _userRepository.GetByIdAsync(u => u.Email == request.Email);
            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid email or password");
            }


            var token = _tokenService.CreateToken(user);

            // Store token in HTTP-only cookie
            Response.Cookies.Append("AuthToken", token, new CookieOptions
            {
                HttpOnly = true, // Prevents JavaScript access
                Secure = false,  
                SameSite = SameSiteMode.None, // Adjust based on frontend needs
                Expires = DateTime.UtcNow.AddDays(7) // Token expiration
            });

            // Return success response without exposing the token
            return Ok(new AuthResponse
            {
                Success = true,
                Message = "Login successful",
                User = _mapper.Map<UserDto>(user) // Send user details, but NOT the token
            });
        }

        [HttpPost("change-password")]
        public async Task<ActionResult<AuthResponse>> ChangePassword(ChangePasswordRequest request)
        {
            // Find user by email
            var user = await _userRepository.GetByIdAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = "User not found"
                });
            }

            // Verify current password
            if (!VerifyPassword(request.CurrentPassword, user.PasswordHash))
            {
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = "Current password is incorrect"
                });
            }

            // Update password
            await _userRepository.UpdateAsync(
                u => u.UserId == user.UserId,
                u => u.PasswordHash = HashPassword(request.NewPassword)
            );

            // Return response
            return Ok(new AuthResponse
            {
                Success = true,
                Message = "Password changed successfully"
            });
        }

        #region Helper Methods
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                // Convert the string to a byte array
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

                // Compute the hash
                byte[] hashBytes = sha256.ComputeHash(passwordBytes);

                // Convert the byte array to a hexadecimal string
                StringBuilder sb = new StringBuilder();
                foreach (byte b in hashBytes)
                {
                    sb.Append(b.ToString("x2"));
                }

                return sb.ToString();
            }
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            // Hash the input password
            string hashedPassword = HashPassword(password);

            // Compare with stored hash
            return hashedPassword.Equals(storedHash, StringComparison.OrdinalIgnoreCase);
        }
        #endregion
    }
}