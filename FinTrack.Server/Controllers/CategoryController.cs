using AutoMapper;
using FinTrack.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FinTrack.Server.Models.DTO;
using FinTrack.Server.Models.Domain;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FinTrack.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        // Khởi tạo controller với category repository và mapper
        public CategoryController(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        // Tạo category mới cho user
        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<CategoryDTO>> CreateCategory([FromBody] CreateCategoryDTO CreateCategoryDto)
        {

            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            if (CreateCategoryDto == null)
            {
                return BadRequest("CreateCategory data is required.");
            }

            var CreateCategory = _mapper.Map<Category>(CreateCategoryDto);
            CreateCategory.UserId = userId;
            var createdCategory = await _categoryRepository.CreateAsync(CreateCategory);

            var CreateCategoryResponse = _mapper.Map<CreateCategoryDTO>(createdCategory);

            return Ok(CreateCategoryResponse);

        }


        // Lấy tất cả category của user với tổng số tiền đã chi
        [Authorize]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetAllCategoryByUserId()
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var categoryListByUserId = await _categoryRepository.GetByUserIdAsync(userId);

            var categoryListResponse = new List<CategoryDTO>();

            foreach (var category in categoryListByUserId)
            {
                var totalSpent = await _categoryRepository.GetTotalSpentAsync(category.CategoryName, category.Type, userId);

                var categoryDto = new CategoryDTO
                {
                    CategoryName = category.CategoryName,
                    Type = category.Type,
                    IsDefault = category.IsDefault,
                    TotalSpentAmount = (float?)totalSpent
                };

                categoryListResponse.Add(categoryDto);
            }

            return Ok(categoryListResponse);
        }


        // Lấy tổng số tiền đã chi cho một category cụ thể
        [Authorize]
        [HttpGet("total/{CategoryName}")]
        public async Task<ActionResult> GetTotalSpentOnCategory(string CategoryName, [FromQuery] string Type)
        {

            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var totalAmount = await _categoryRepository.GetTotalSpentAsync(CategoryName, Type, userId);

            if (totalAmount == null)
            {
                return NotFound($"Category with name {CategoryName} not found.");
            }

            return Ok($"Total amount: {totalAmount}");
        }

        // Cập nhật tên category (giữ nguyên type để đảm bảo tính toàn vẹn dữ liệu)
        [Authorize]
        [HttpPut("update/{CategoryName}")]
        public async Task<ActionResult<CategoryDTO>> UpdateCategory(string CategoryName, [FromQuery] string Type, [FromBody] CreateCategoryDTO updateCategoryDto)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            if (updateCategoryDto == null)
            {
                return BadRequest("Category data is required.");
            }

            var updatedCategory = await _categoryRepository.UpdateAsync(
                c => c.CategoryName == CategoryName && c.Type == Type && c.UserId == userId,
                category =>
                {
                    category.CategoryName = updateCategoryDto.CategoryName;
                    // Note: Type is not updated to maintain data integrity
                }
            );

            if (updatedCategory == null)
            {
                return NotFound($"Category with name {CategoryName} not found.");
            }

            var categoryResponse = _mapper.Map<CategoryDTO>(updatedCategory);
            return Ok(categoryResponse);
        }

        // Xóa category của user
        [Authorize]
        [HttpDelete("delete/{CategoryName}")]
        public async Task<ActionResult> DeleteCategory(string CategoryName, [FromQuery] string Type)
        {

            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

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