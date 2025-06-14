using AutoMapper;
using FinTrack.Server.Models.Domain;
using FinTrack.Server.Models.DTO;
using FinTrack.Server.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinTrack.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IReportRepository _reportRepository;
        private readonly IMapper _mapper;

        public ReportController(IUserRepository userRepository, IReportRepository reportRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _reportRepository = reportRepository;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet("financial-summary")]
        public async Task<ActionResult> GetFinancialSummary([FromQuery] string period = "year")
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            // Caculate date range based on the period
            DateTime startDate = GetStartDateFromPeriod(period);
            DateTime endDate = DateTime.Now;

            var sumary = await _reportRepository.GetFinancialSummaryAsync(userId, startDate, endDate);
            return Ok(sumary);
        }

        private DateTime GetStartDateFromPeriod(string period)
        {
            return period switch
            {
                "month" => DateTime.Now.AddMonths(-1),
                "quarter" => DateTime.Now.AddMonths(-3),
                "halfYear" => DateTime.Now.AddMonths(-6),
                "year" => DateTime.Now.AddYears(-1),
                _ => DateTime.Now.AddYears(-1)
            };
        }

        [Authorize]
        [HttpGet("category-expenses")]
        public async Task<ActionResult> GetCategoryExpenses([FromQuery] string period = "year")
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            // Caculate date range based on the period
            DateTime startDate = GetStartDateFromPeriod(period);
            DateTime endDate = DateTime.Now;

            var categoryExpenses = await _reportRepository.GetCategoryExpensesAsync(userId, startDate, endDate);
            return Ok(categoryExpenses);
        }

        [Authorize]
        [HttpPost("generate")]
        public async Task<ActionResult> GenerateReport([FromQuery] string period = "year", [FromQuery] string format = "pdf")
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);
            
            // Generate report
            string fileName = await _reportRepository.GenerateAndSaveReportAsync(userId, "Financial", period, format);
            
            // In a real implementation, this would return the actual file
            // For now, we'll just return the filename
            return Ok(new { fileName });
        }

        [Authorize]
        [HttpGet("history")]
        public async Task<ActionResult> GetReportHistory()
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("UserId is missing in the token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var reports = await _reportRepository.GetByUserIdAsync(userId);
            var reportDTOs = _mapper.Map<List<ReportDTO>>(reports);
            return Ok(reportDTOs);
        }
    }
}
