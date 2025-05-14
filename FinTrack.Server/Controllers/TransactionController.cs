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
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IMapper _mapper;

        public TransactionController(ITransactionRepository transactionRepository, IMapper mapper)
        {
            _transactionRepository = transactionRepository;
            _mapper = mapper;
        }

        [Authorize] 
        [HttpPost("create")]
        public async Task<ActionResult<TransactionDTO>> CreateTransaction([FromBody] CreateTransactionDTO createTransactionDto)
        {

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