using AutoMapper;
using FinTrack.Server.Models.Domain;
using FinTrack.Server.Models.DTO;
using FinTrack.Server.Repositories;
using FinTrack.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinTrack.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalController : ControllerBase
    {
        private readonly IGoalRepository _goalRepository;
        private readonly IGoalProgressRepository _goalProgressRepository;
        private readonly IMapper _mapper;

        public GoalController(IGoalRepository goalRepository, IGoalProgressRepository goalProgressRepository, IMapper mapper)
        {
            _goalRepository = goalRepository;
            _goalProgressRepository = goalProgressRepository;
            _mapper = mapper;
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<GoalDTO>> CreateGoal([FromBody] CreateGoalDTO createGoalDto)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            if (createGoalDto == null)
            {
                return BadRequest("Goal data is required.");
            }

            var goal = _mapper.Map<Goal>(createGoalDto);
            goal.UserId = userId;

            // Set timezone to UTC+7 (Vietnam timezone)
            goal.CreatedAt = TimeZoneHelper.GetVietnamTime();

            var createdGoal = await _goalRepository.CreateAsync(goal);
            var goalResponse = _mapper.Map<GoalDTO>(createdGoal);

            return Ok(goalResponse);
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<GoalDTO>>> GetAllGoalsByUserId()
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var goalListByUserId = await _goalRepository.GetByUserIdAsync(userId);
            var goalListResponse = _mapper.Map<IEnumerable<GoalDTO>>(goalListByUserId);

            return Ok(goalListResponse);
        }

        [Authorize]
        [HttpGet("{goalId}")]
        public async Task<ActionResult<GoalDTO>> GetGoalById(int goalId)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var goal = await _goalRepository.GetByIdAsync(g => g.GoalId == goalId && g.UserId == userId);
            if (goal == null)
            {
                return NotFound("Goal not found.");
            }

            var goalResponse = _mapper.Map<GoalDTO>(goal);
            return Ok(goalResponse);
        }

        [Authorize]
        [HttpPut("{goalId}")]
        public async Task<ActionResult<GoalDTO>> UpdateGoal(int goalId, [FromBody] CreateGoalDTO updateGoalDto)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            if (updateGoalDto == null)
            {
                return BadRequest("Goal data is required.");
            }

            var updatedGoal = await _goalRepository.UpdateAsync(
                g => g.GoalId == goalId && g.UserId == userId,
                goal =>
                {
                    goal.Title = updateGoalDto.Title;
                    goal.TargetAmount = updateGoalDto.TargetAmount;
                    goal.Deadline = updateGoalDto.Deadline;
                    goal.SavedAmount = updateGoalDto.SavedAmount;
                }
            );

            if (updatedGoal == null)
            {
                return NotFound("Goal not found.");
            }

            var goalResponse = _mapper.Map<GoalDTO>(updatedGoal);
            return Ok(goalResponse);
        }

        [Authorize]
        [HttpDelete("{goalId}")]
        public async Task<ActionResult> DeleteGoal(int goalId)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var deletedGoal = await _goalRepository.DeleteAsync(g => g.GoalId == goalId && g.UserId == userId);
            if (deletedGoal == null)
            {
                return NotFound("Goal not found.");
            }

            return Ok(new { message = "Goal deleted successfully." });
        }

        [Authorize]
        [HttpPost("{goalId}/progress")]
        public async Task<ActionResult<GoalProgressDTO>> AddGoalProgress(int goalId, [FromBody] CreateGoalProgressDTO createProgressDto)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            // Verify goal belongs to user
            var goal = await _goalRepository.GetByIdAsync(g => g.GoalId == goalId && g.UserId == userId);
            if (goal == null)
            {
                return NotFound("Goal not found.");
            }

            if (createProgressDto == null)
            {
                return BadRequest("Progress data is required.");
            }

            var progress = _mapper.Map<GoalProgress>(createProgressDto);
            progress.GoalId = goalId;

            // Set timezone to UTC+7 (Vietnam timezone)
            progress.UpdatedAt = TimeZoneHelper.GetVietnamTime();

            var createdProgress = await _goalProgressRepository.CreateAsync(progress);

            // Update goal's saved amount
            await _goalRepository.UpdateAsync(
                g => g.GoalId == goalId,
                goal => goal.SavedAmount = (goal.SavedAmount ?? 0) + createProgressDto.SavedAmount
            );

            var progressResponse = _mapper.Map<GoalProgressDTO>(createdProgress);
            return Ok(progressResponse);
        }
    }
}
