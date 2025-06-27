using AutoMapper;
using FinTrack.Server.Repositories;
using FinTrack.Server.Helpers;
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
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<TransactionController> _logger;
        private readonly TimeZoneInfo vietnamTimeZone;

        public TransactionController(ITransactionRepository transactionRepository, ICategoryRepository categoryRepository, IMapper mapper, ILogger<TransactionController> logger)
        {
            _transactionRepository = transactionRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _logger = logger;
            vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<TransactionDTO>> CreateTransaction([FromBody] CreateTransactionDTO createTransactionDto)
        {
            _logger.LogInformation("CreateTransaction called with DTO: {@CreateTransactionDto}", createTransactionDto);
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            if (createTransactionDto == null)
            {
                return BadRequest("Transaction data is required.");
            }

            var transaction = _mapper.Map<Transaction>(createTransactionDto);

            transaction.UserId = userId;

            // Set timezone to UTC+7 (Vietnam timezone)
            if (!transaction.CreatedAt.HasValue)
            {
                transaction.CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vietnamTimeZone);
                _logger.LogInformation($"CreatedAt was not provided, setting to Vietnam time: {transaction.CreatedAt}");
            }

            await _categoryRepository.UpdateAsync(
                c => c.CategoryName  == transaction.CategoryName && c.Type == transaction.Type,
                category => {
                    category.TotalAmount += (float?)transaction.Amount;
                }
            );

            var createdTransaction = await _transactionRepository.CreateAsync(transaction);

            var transactionResponse = _mapper.Map<TransactionDTO>(createdTransaction);

            return Ok(transactionResponse);

        }

        [Authorize]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<TransactionDTO>>> GetAllTransactionByUserId()
        {

            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var transactionListByUserId = await _transactionRepository.GetByUserIdAsync(userId);
            var transactionListResponse = _mapper.Map<IEnumerable<TransactionDTO>>(transactionListByUserId);

            return Ok(transactionListResponse);

        }

        [Authorize] // Ensures only authenticated users can access this endpoint
        [HttpGet("all/{CategoryName}")]
        public async Task<ActionResult<IEnumerable<TransactionDTO>>> GetTransactionsByCategoryName(string CategoryName)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var transactionListByCategoryName = await _transactionRepository.GetTransactionsByCategoryNameAsync(CategoryName, userId);
            var transactionListResponse = _mapper.Map<IEnumerable<TransactionDTO>>(transactionListByCategoryName);

            return Ok(transactionListResponse);
        }

        [HttpPut("update/{TransactionId}")]
        public async Task<ActionResult<TransactionDTO>> UpdateTransaction(int TransactionId, [FromBody] TransactionDTO transactionDto)
        {
            if (transactionDto == null)
            {
                return BadRequest("Invalid transaction data.");
            }
            var previousTransaction = await _transactionRepository.GetByIdAsync(
                t => t.TransactionId == TransactionId
            );

            var updatedTransaction = await _transactionRepository.UpdateAsync(
                t => t.TransactionId == TransactionId, // Filter expression
                record =>
                {
                    // Update only fields that are provided (not null)
                    if (transactionDto.Amount != default) record.Amount = transactionDto.Amount;
                    if (!string.IsNullOrEmpty(transactionDto.Type)) record.Type = transactionDto.Type;
                    if (!string.IsNullOrEmpty(transactionDto.Note)) record.Note = transactionDto.Note;
                    if (transactionDto.IsImportant.HasValue) record.IsImportant = transactionDto.IsImportant;
                    if (!string.IsNullOrEmpty(transactionDto.CategoryName)) record.CategoryName = transactionDto.CategoryName;
                    if (transactionDto.CreatedAt.HasValue) record.CreatedAt = transactionDto.CreatedAt;
                });

            await _categoryRepository.UpdateAsync(
                c => c.CategoryName  == updatedTransaction.CategoryName && c.Type == updatedTransaction.Type,
                category => {
                    category.TotalAmount = (float?)(category.TotalAmount - (float?)previousTransaction.Amount + (float?)updatedTransaction.Amount);
                }
            );

            if (updatedTransaction == null)
            {
                return NotFound($"Transaction with ID {TransactionId} not found.");
            }

            return Ok(updatedTransaction);
        }

        [HttpDelete("delete/{TransactionId}")]
        public async Task<ActionResult> DeleteTransaction(int TransactionId)
        {
            var deleted = await _transactionRepository.DeleteAsync(t => t.TransactionId == TransactionId);

            await _categoryRepository.UpdateAsync(
                c => c.CategoryName  == deleted.CategoryName && c.Type == deleted.Type,
                category => {
                    category.TotalAmount = (float?)(category.TotalAmount - (float?)deleted.Amount);
                }
            );


            if (deleted == null)
            {
                return NotFound($"Transaction with ID {TransactionId} not found.");
            }

            return Ok("Deleted successfully");
        }



        // [HttpPut]
        // public async Task<ActionResult<TransactionDTO>> CreateTransaction([FromBody] TransactionDTO transactionDto)
        // {
        //     if (transactionDto == null)
        //     {
        //         return BadRequest("Transaction data is required.");
        //     }

        //     var transaction = _mapper.Map<Transaction>(transactionDto);
        //     var createdTransaction = await _transactionRepository.CreateAsync(transaction);

        //     var transactionResponse = _mapper.Map<TransactionDTO>(createdTransaction);

        //     return Ok(transactionResponse);

        // }

        // [HttpGet]
        // public async Task<ActionResult> GetAllUsers()
        // {

        // }

    }
}