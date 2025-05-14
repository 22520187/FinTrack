using AutoMapper;
using FinTrack.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FinTrack.Server.Models.DTO;
using FinTrack.Server.Models.Domain;


namespace FinTrack.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<CreateUserDTO>> RegisterUser([FromBody] CreateUserDTO createUserDTO)
        {
            if (string.IsNullOrWhiteSpace(createUserDTO.Password))
                return BadRequest("Password is required!");


            var user = _mapper.Map<User>(createUserDTO);
            var createdUser = await _userRepository.CreateAsync(user);

            var userResponse = _mapper.Map<UserDTO>(createdUser);

            return Ok(userResponse);

        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            var users = await _userRepository.GetAllAsync();

            // Correctly map the IEnumerable<User> to IEnumerable<UserDTO>
            var userResponse = _mapper.Map<IEnumerable<UserDTO>>(users);

            return Ok(userResponse);
        }

        

    }
}