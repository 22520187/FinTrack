using FinTrack.Server.Models.DTO;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using OfficeOpenXml;
using System.Data;
using Microsoft.Extensions.Logging;

namespace FinTrack.Server.Services
{
    public class ReportGenerationService
    {
        private readonly string _reportsDirectory;
        private readonly ILogger<ReportGenerationService> _logger;

        public ReportGenerationService(IWebHostEnvironment environment, ILogger<ReportGenerationService> logger)
        {
            _logger = logger;
            
            string baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
                   
            _reportsDirectory = Path.Combine(baseDirectory, "reports");
            
            try
            {
                if (!Directory.Exists(_reportsDirectory))
                {
                    Directory.CreateDirectory(_reportsDirectory);
                    _logger.LogInformation($"Created reports directory at: {_reportsDirectory}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating reports directory");
                throw new Exception("Failed to initialize reports directory", ex);
            }
        }

        public async Task<string> GeneratePdfReportAsync(FinancialSumaryDTO summary, List<ReportCategoryExpenseDTO> categoryExpenses, string fileName)
        {
            try
            {
                _logger.LogInformation($"Starting PDF generation. Summary: {summary != null}, Categories: {categoryExpenses?.Count ?? 0}");
                
                if (summary == null)
                {
                    throw new ArgumentNullException(nameof(summary), "Financial summary cannot be null");
                }

                string filePath = Path.Combine(_reportsDirectory, fileName);
                _logger.LogInformation($"PDF file path: {filePath}");
                
                using (var writer = new PdfWriter(filePath))
                using (var pdf = new PdfDocument(writer))
                using (var document = new Document(pdf))
                {
                    document.Add(new Paragraph("Financial Report")
                        .SetTextAlignment(TextAlignment.CENTER)
                        .SetFontSize(20)
                        .SetBold());

                    document.Add(new Paragraph("Financial Summary")
                        .SetFontSize(16)
                        .SetBold()
                        .SetMarginTop(20));

                    var summaryTable = new Table(2);
                    summaryTable.AddCell("Total Income");
                    summaryTable.AddCell($"${summary.TotalIncome:N2}");
                    summaryTable.AddCell("Total Expenses");
                    summaryTable.AddCell($"${summary.TotalExpense:N2}");
                    summaryTable.AddCell("Savings Rate");
                    summaryTable.AddCell($"{summary.SavingsRate:N1}%");
                    document.Add(summaryTable);

                    // Add monthly data
                    document.Add(new Paragraph("Monthly Data")
                        .SetFontSize(16)
                        .SetBold()
                        .SetMarginTop(20));

                    if (summary.MonthlyData != null && summary.MonthlyData.Any())
                    {
                        var monthlyTable = new Table(4);
                        monthlyTable.AddCell("Month");
                        monthlyTable.AddCell("Income");
                        monthlyTable.AddCell("Expense");
                        monthlyTable.AddCell("Net");

                        foreach (var month in summary.MonthlyData)
                        {
                            monthlyTable.AddCell(month?.Month ?? "N/A");
                            monthlyTable.AddCell($"${month?.Income ?? 0:N2}");
                            monthlyTable.AddCell($"${month?.Expense ?? 0:N2}");
                            monthlyTable.AddCell($"${(month?.Income ?? 0) - (month?.Expense ?? 0):N2}");
                        }
                        document.Add(monthlyTable);
                    }
                    else
                    {
                        document.Add(new Paragraph("No monthly data available for the selected period."));
                    }

                    // Add category expenses
                    document.Add(new Paragraph("Category Expenses")
                        .SetFontSize(16)
                        .SetBold()
                        .SetMarginTop(20));

                    if (categoryExpenses != null && categoryExpenses.Any())
                    {
                        var categoryTable = new Table(2);
                        categoryTable.AddCell("Category");
                        categoryTable.AddCell("Amount");

                        foreach (var category in categoryExpenses)
                        {
                            categoryTable.AddCell(category?.Category ?? "Unknown");
                            categoryTable.AddCell($"${category?.Amount ?? 0:N2}");
                        }
                        document.Add(categoryTable);
                    }
                    else
                    {
                        document.Add(new Paragraph("No category expenses found for the selected period."));
                    }
                }

                _logger.LogInformation($"Generated PDF report at: {filePath}");
                return filePath;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating PDF report: {ErrorMessage}", ex.Message);
                throw new Exception("Failed to generate PDF report", ex);
            }
        }

        public async Task<string> GenerateExcelReportAsync(FinancialSumaryDTO summary, List<ReportCategoryExpenseDTO> categoryExpenses, string fileName)
        {
            try
            {
                _logger.LogInformation($"Starting Excel generation. Summary: {summary != null}, Categories: {categoryExpenses?.Count ?? 0}");
                
                if (summary == null)
                {
                    throw new ArgumentNullException(nameof(summary), "Financial summary cannot be null");
                }

                string filePath = Path.Combine(_reportsDirectory, fileName);
                _logger.LogInformation($"Excel file path: {filePath}");
                
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var package = new ExcelPackage())
                {
                    // Summary sheet
                    var summarySheet = package.Workbook.Worksheets.Add("Summary");
                    summarySheet.Cells["A1"].Value = "Financial Summary";
                    summarySheet.Cells["A1"].Style.Font.Size = 16;
                    summarySheet.Cells["A1"].Style.Font.Bold = true;

                    summarySheet.Cells["A3"].Value = "Total Income";
                    summarySheet.Cells["B3"].Value = summary.TotalIncome;
                    summarySheet.Cells["A4"].Value = "Total Expenses";
                    summarySheet.Cells["B4"].Value = summary.TotalExpense;
                    summarySheet.Cells["A5"].Value = "Savings Rate";
                    summarySheet.Cells["B5"].Value = summary.SavingsRate;

                    // Monthly data sheet
                    var monthlySheet = package.Workbook.Worksheets.Add("Monthly Data");
                    monthlySheet.Cells["A1"].Value = "Month";
                    monthlySheet.Cells["B1"].Value = "Income";
                    monthlySheet.Cells["C1"].Value = "Expense";
                    monthlySheet.Cells["D1"].Value = "Net";

                    if (summary.MonthlyData != null && summary.MonthlyData.Any())
                    {
                        int row = 2;
                        foreach (var month in summary.MonthlyData)
                        {
                            monthlySheet.Cells[$"A{row}"].Value = month?.Month ?? "N/A";
                            monthlySheet.Cells[$"B{row}"].Value = month?.Income ?? 0;
                            monthlySheet.Cells[$"C{row}"].Value = month?.Expense ?? 0;
                            monthlySheet.Cells[$"D{row}"].Value = (month?.Income ?? 0) - (month?.Expense ?? 0);
                            row++;
                        }
                    }

                    // Category expenses sheet
                    var categorySheet = package.Workbook.Worksheets.Add("Category Expenses");
                    categorySheet.Cells["A1"].Value = "Category";
                    categorySheet.Cells["B1"].Value = "Amount";

                    if (categoryExpenses != null && categoryExpenses.Any())
                    {
                        int row = 2;
                        foreach (var category in categoryExpenses)
                        {
                            categorySheet.Cells[$"A{row}"].Value = category?.Category ?? "Unknown";
                            categorySheet.Cells[$"B{row}"].Value = category?.Amount ?? 0;
                            row++;
                        }
                    }

                    // Auto-fit columns
                    summarySheet.Cells.AutoFitColumns();
                    monthlySheet.Cells.AutoFitColumns();
                    categorySheet.Cells.AutoFitColumns();

                    await package.SaveAsAsync(new FileInfo(filePath));
                }

                _logger.LogInformation($"Generated Excel report at: {filePath}");
                return filePath;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating Excel report: {ErrorMessage}", ex.Message);
                throw new Exception("Failed to generate Excel report", ex);
            }
        }
    }
} 