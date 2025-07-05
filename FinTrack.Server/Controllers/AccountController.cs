using AutoMapper;
using FinTrack.Server.Models.Domain;
using FinTrack.Server.Models.RequestModels;
using FinTrack.Server.Models.ResponseModels;
using FinTrack.Server.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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

        // Khởi tạo controller với user repository, token service và mapper
        public AccountController(
            IUserRepository userRepository,
            ITokenService tokenService,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        // Đăng ký tài khoản mới cho user
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during registration"
                });
            }
        }

        // Đăng nhập và tạo JWT token
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginRequest request)
        {
            try
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
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token,
                    User = _mapper.Map<UserDto>(user)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during login"
                });
            }
        }

        // Thay đổi mật khẩu user
        [HttpPost("change-password")]
        public async Task<ActionResult<AuthResponse>> ChangePassword(ChangePasswordRequest request)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(u => u.Email == request.Email);
                if (user == null)
                {
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                if (!VerifyPassword(request.CurrentPassword, user.PasswordHash))
                {
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "Current password is incorrect"
                    });
                }

                await _userRepository.UpdateAsync(
                    u => u.UserId == user.UserId,
                    u => u.PasswordHash = HashPassword(request.NewPassword)
                );

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "Password changed successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred while changing password"
                });
            }
        }

        // Cập nhật thông tin cá nhân của user
        [Authorize]
        [HttpPut("update-info/{userId}")]
        public async Task<ActionResult<AuthResponse>> UpdateInfo(int userId, [FromBody] UpdateUserInfoRequest request)
        {
            try
            {
                // Get user ID from token
                var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "User not authenticated"
                    });
                }

                if (!int.TryParse(userIdClaim.Value, out int tokenUserId))
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid user ID format"
                    });
                }

                // Verify user exists
                var user = await _userRepository.GetByIdAsync(u => u.UserId == userId);
                if (user == null)
                {
                    return NotFound(new AuthResponse
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                // Check if the user is trying to update their own profile
                if (tokenUserId != userId)
                {
                    return Unauthorized(new AuthResponse
                    {
                        Success = false,
                        Message = "You can only update your own profile"
                    });
                }

                // Update user information
                await _userRepository.UpdateAsync(
                    u => u.UserId == userId,
                    u =>
                    {
                        u.FullName = request.FullName;
                        u.Phone = request.Phone;
                        u.City = request.City;
                        u.District = request.District;
                        u.Ward = request.Ward;
                    }
                );

                // Get updated user
                var updatedUser = await _userRepository.GetByIdAsync(u => u.UserId == userId);

                // Map to DTO
                var userDto = _mapper.Map<UserDto>(updatedUser);

                // Return response
                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "Profile updated successfully",
                    User = userDto
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred while updating profile"
                });
            }
        }

        // Đăng xuất và xóa auth cookie
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            try
            {
                // Clear the authentication cookie
                Response.Cookies.Delete("AuthToken", new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None
                });

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "Logout successful"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during logout"
                });
            }
        }

        #region Helper Methods
        // Mã hóa mật khẩu bằng SHA256
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
            byte[] hashBytes = sha256.ComputeHash(passwordBytes);

            var sb = new StringBuilder();
            foreach (byte b in hashBytes)
            {
                sb.Append(b.ToString("x2"));
            }

            return sb.ToString();
        }

        // Xác thực mật khẩu với hash đã lưu
        private bool VerifyPassword(string password, string storedHash)
        {
            string hashedPassword = HashPassword(password);
            return hashedPassword.Equals(storedHash, StringComparison.OrdinalIgnoreCase);
        }
        #endregion
    }
}