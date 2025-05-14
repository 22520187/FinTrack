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

        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> CreateCategory([FromBody] CreateCategoryDTO CreateCategoryDto)
        {
            if (CreateCategoryDto == null)
            {
                return BadRequest("CreateCategory data is required.");
            }

            var CreateCategory = _mapper.Map<Category>(CreateCategoryDto);
            var createdCategory = await _categoryRepository.CreateAsync(CreateCategory);

            var CreateCategoryResponse = _mapper.Map<CreateCategoryDTO>(createdCategory);

            return Ok(CreateCategoryResponse);

        }

        [HttpGet("all/{UserId}")]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetAllCategoryByUserId(int UserId)
        {
            var categoryListByUserId = await _categoryRepository.GetByUserIdAsync(UserId);
            var categoryListResponse = _mapper.Map<IEnumerable<CategoryDTO>>(categoryListByUserId);

            return Ok(categoryListResponse);

        }

        [HttpPost("total/{CategoryName}")]
        public async Task<ActionResult> GetTotalSpentOnCategory(string CategoryName, [FromQuery] string Type, [FromBody] int UserId)
        {
            var totalAmount = await _categoryRepository.GetTotalSpentAsync(CategoryName, Type, UserId);

            if (totalAmount == null)
            {
                return NotFound($"Category with name {CategoryName} not found.");
            }

            return Ok($"Total amount: {totalAmount}");
        }

        [HttpDelete("delete/{CategoryName}")]
        public async Task<ActionResult> DeleteCategory(string CategoryName, [FromQuery] string Type, [FromBody] int UserId)
        {
            var deleted = await _categoryRepository.DeleteAsync(
                t => t.CategoryName == CategoryName && t.Type == Type && t.UserId == UserId
            );

            if (deleted == null)
            {
                return NotFound($"Category with name {CategoryName} not found.");
            }

            return Ok("Deleted successfully");
        }
    }
}