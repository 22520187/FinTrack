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

        // Khởi tạo controller với user repository, report repository và mapper
        public ReportController(IUserRepository userRepository, IReportRepository reportRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _reportRepository = reportRepository;
            _mapper = mapper;
        }

        // Lấy tổng quan tài chính theo khoảng thời gian
        [Authorize]
        [HttpGet("financial-summary")]
        public async Task<ActionResult> GetFinancialSummary([FromQuery] string period = "year", [FromQuery] string startDate = null, [FromQuery] string endDate = null)
        {
            try
            {
                var userIdResult = GetUserIdFromToken();
                if (userIdResult.IsFailure)
                {
                    return userIdResult.ErrorResult;
                }

                var dateRangeResult = ParseDateRange(period, startDate, endDate);
                if (dateRangeResult.IsFailure)
                {
                    return dateRangeResult.ErrorResult;
                }

                var summary = await _reportRepository.GetFinancialSummaryAsync(userIdResult.UserId, dateRangeResult.StartDate, dateRangeResult.EndDate);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting financial summary.", error = ex.Message });
            }
        }

        // Lấy chi tiêu theo category trong khoảng thời gian
        [Authorize]
        [HttpGet("category-expenses")]
        public async Task<ActionResult> GetCategoryExpenses([FromQuery] string period = "year", [FromQuery] string startDate = null, [FromQuery] string endDate = null)
        {
            try
            {
                var userIdResult = GetUserIdFromToken();
                if (userIdResult.IsFailure)
                {
                    return userIdResult.ErrorResult;
                }

                var dateRangeResult = ParseDateRange(period, startDate, endDate);
                if (dateRangeResult.IsFailure)
                {
                    return dateRangeResult.ErrorResult;
                }

                var categoryExpenses = await _reportRepository.GetCategoryExpensesAsync(userIdResult.UserId, dateRangeResult.StartDate, dateRangeResult.EndDate);
                return Ok(categoryExpenses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting category expenses.", error = ex.Message });
            }
        }

        // Tạo và lưu báo cáo với định dạng chỉ định
        [Authorize]
        [HttpPost("generate")]
        public async Task<ActionResult> GenerateReport([FromQuery] string period = "year", [FromQuery] string format = "pdf", [FromQuery] string startDate = null, [FromQuery] string endDate = null)
        {
            try
            {
                var userIdResult = GetUserIdFromToken();
                if (userIdResult.IsFailure)
                {
                    return userIdResult.ErrorResult;
                }

                string reportPeriod = BuildReportPeriod(period, startDate, endDate);
                string fileName = await _reportRepository.GenerateAndSaveReportAsync(userIdResult.UserId, "Financial", reportPeriod, format);

                return Ok(new { fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while generating report.", error = ex.Message });
            }
        }

        // Tải xuống báo cáo đã tạo
        [Authorize]
        [HttpGet("download/{fileName}")]
        public async Task<ActionResult> DownloadReport(string fileName)
        {
            try
            {
                var userIdResult = GetUserIdFromToken();
                if (userIdResult.IsFailure)
                {
                    return userIdResult.ErrorResult;
                }

                // Verify the file belongs to the user
                var report = await _reportRepository.GetByIdAsync(r => r.FileUrl == fileName && r.UserId == userIdResult.UserId);
                if (report == null)
                {
                    return NotFound("Report not found or access denied.");
                }

                // Get the file path
                string baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
                string reportsDirectory = Path.Combine(baseDirectory, "reports");
                string filePath = Path.Combine(reportsDirectory, fileName);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("File not found on server.");
                }

                // Determine content type
                string contentType = GetContentType(fileName);

                // Read file and return
                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                return File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while downloading the file.", error = ex.Message });
            }
        }

        // Lấy lịch sử các báo cáo đã tạo
        [Authorize]
        [HttpGet("history")]
        public async Task<ActionResult> GetReportHistory()
        {
            try
            {
                var userIdResult = GetUserIdFromToken();
                if (userIdResult.IsFailure)
                {
                    return userIdResult.ErrorResult;
                }

                var reports = await _reportRepository.GetByUserIdAsync(userIdResult.UserId);
                var reportDTOs = _mapper.Map<List<ReportDTO>>(reports);
                return Ok(reportDTOs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting report history.", error = ex.Message });
            }
        }

        #region Helper Methods
        // Lấy user ID từ JWT token
        private UserIdResult GetUserIdFromToken()
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return UserIdResult.Failure(Unauthorized("UserId is missing in the token."));
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return UserIdResult.Failure(BadRequest("Invalid user ID format."));
            }

            return UserIdResult.Success(userId);
        }

        // Phân tích và chuyển đổi khoảng thời gian
        private DateRangeResult ParseDateRange(string period, string startDate, string endDate)
        {
            DateTime startDateTime;
            DateTime endDateTime;

            if (!string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate))
            {
                if (!DateTime.TryParse(startDate, out startDateTime) || !DateTime.TryParse(endDate, out endDateTime))
                {
                    return DateRangeResult.Failure(BadRequest("Invalid date format. Please use YYYY-MM-DD format."));
                }

                endDateTime = endDateTime.Date.AddDays(1).AddTicks(-1);
            }
            else
            {
                startDateTime = GetStartDateFromPeriod(period);
                endDateTime = DateTime.Now;

                if (int.TryParse(period, out int year))
                {
                    endDateTime = new DateTime(year, 12, 31, 23, 59, 59);
                }
            }

            return DateRangeResult.Success(startDateTime, endDateTime);
        }

        // Lấy ngày bắt đầu dựa trên period
        private DateTime GetStartDateFromPeriod(string period)
        {
            if (int.TryParse(period, out int year))
            {
                return new DateTime(year, 1, 1);
            }

            return period.ToLower() switch
            {
                "month" => DateTime.Now.AddMonths(-1),
                "quarter" => DateTime.Now.AddMonths(-3),
                "halfyear" => DateTime.Now.AddMonths(-6),
                "year" => DateTime.Now.AddMonths(-12),
                "last12months" => DateTime.Now.AddMonths(-12),
                _ => DateTime.Now.AddMonths(-12)
            };
        }

        // Tạo chuỗi period cho báo cáo
        private string BuildReportPeriod(string period, string startDate, string endDate)
        {
            if (!string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate))
            {
                if (DateTime.TryParse(startDate, out DateTime parsedStartDate) && DateTime.TryParse(endDate, out DateTime parsedEndDate))
                {
                    return $"{parsedStartDate:yyyy-MM-dd}_to_{parsedEndDate:yyyy-MM-dd}";
                }
                else
                {
                    return $"{startDate}_to_{endDate}";
                }
            }

            return period;
        }

        // Xác định content type dựa trên extension file
        private string GetContentType(string fileName)
        {
            return Path.GetExtension(fileName).ToLower() switch
            {
                ".pdf" => "application/pdf",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                _ => "application/octet-stream"
            };
        }
        #endregion

        #region Result Classes
        private class UserIdResult
        {
            public bool IsFailure { get; private set; }
            public int UserId { get; private set; }
            public ActionResult ErrorResult { get; private set; }

            private UserIdResult(bool isFailure, int userId, ActionResult errorResult)
            {
                IsFailure = isFailure;
                UserId = userId;
                ErrorResult = errorResult;
            }

            public static UserIdResult Success(int userId) => new(false, userId, null);
            public static UserIdResult Failure(ActionResult errorResult) => new(true, 0, errorResult);
        }

        private class DateRangeResult
        {
            public bool IsFailure { get; private set; }
            public DateTime StartDate { get; private set; }
            public DateTime EndDate { get; private set; }
            public ActionResult ErrorResult { get; private set; }

            private DateRangeResult(bool isFailure, DateTime startDate, DateTime endDate, ActionResult errorResult)
            {
                IsFailure = isFailure;
                StartDate = startDate;
                EndDate = endDate;
                ErrorResult = errorResult;
            }

            public static DateRangeResult Success(DateTime startDate, DateTime endDate) => new(false, startDate, endDate, null);
            public static DateRangeResult Failure(ActionResult errorResult) => new(true, DateTime.MinValue, DateTime.MinValue, errorResult);
        }
        #endregion
    }
}

