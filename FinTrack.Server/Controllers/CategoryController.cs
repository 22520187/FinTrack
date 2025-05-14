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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryController(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> CreateCategory([FromBody] CreateCategoryDTO CreateCategoryDto)
        {

            var userIdClaim = HttpContext.User.FindFirst("UserId"); // Extract UserId from JWT

            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value); // Convert to int

            if (CreateCategoryDto == null)
            {
                return BadRequest("CreateCategory data is required.");
            }

            var CreateCategory = _mapper.Map<Category>(CreateCategoryDto);
            var createdCategory = await _categoryRepository.CreateAsync(CreateCategory);
            createdCategory.UserId = userId;

            var CreateCategoryResponse = _mapper.Map<CreateCategoryDTO>(createdCategory);

            return Ok(CreateCategoryResponse);

        }


        [Authorize]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetAllCategoryByUserId(int UserId)
        {

            var userIdClaim = HttpContext.User.FindFirst("UserId"); // Extract UserId from JWT

            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value); // Convert to int

            var categoryListByUserId = await _categoryRepository.GetByUserIdAsync(userId);
            var categoryListResponse = _mapper.Map<IEnumerable<CategoryDTO>>(categoryListByUserId);

            return Ok(categoryListResponse);

        }

        [Authorize]
        [HttpGet("total/{CategoryName}")]
        public async Task<ActionResult> GetTotalSpentOnCategory(string CategoryName, [FromQuery] string Type)
        {

            var userIdClaim = HttpContext.User.FindFirst("UserId"); // Extract UserId from JWT

            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value); // Convert to int

            var totalAmount = await _categoryRepository.GetTotalSpentAsync(CategoryName, Type, userId);

            if (totalAmount == null)
            {
                return NotFound($"Category with name {CategoryName} not found.");
            }

            return Ok($"Total amount: {totalAmount}");
        }

        [Authorize]
        [HttpDelete("delete/{CategoryName}")]
        public async Task<ActionResult> DeleteCategory(string CategoryName, [FromQuery] string Type)
        {

            var userIdClaim = HttpContext.User.FindFirst("UserId"); // Extract UserId from JWT

            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value); // Convert to int

            var deleted = await _categoryRepository.DeleteAsync(
                t => t.CategoryName == CategoryName && t.Type == Type && t.UserId == userId
            );

            if (deleted == null)
            {
                return NotFound($"Category with name {CategoryName} not found.");
            }

            return Ok("Deleted successfully");
        }
    }
}