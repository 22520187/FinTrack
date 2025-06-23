import http from "./Http";

class ReportService {
  baseURI: string;
  constructor() {
    this.baseURI = "Report/";
  }
  
  private getURI(uri: string) {
    return `${this.baseURI}${uri}`;
  }
  
  async getFinancialSummary(period: string = "year") {
    return await http.get(this.getURI(`financial-summary?period=${period}`));
  }
  
  async getCategoryExpenses(period: string = "year") {
    return await http.get(this.getURI(`category-expenses?period=${period}`));
  }

  // New methods for date range functionality
  async getFinancialSummaryByDateRange(startDate: string, endDate: string) {
    return await http.get(this.getURI(`financial-summary?startDate=${startDate}&endDate=${endDate}`));
  }
  
  async getCategoryExpensesByDateRange(startDate: string, endDate: string) {
    return await http.get(this.getURI(`category-expenses?startDate=${startDate}&endDate=${endDate}`));
  }
  
  async generateReport(period: string = "year", format: string = "pdf") {
    return await http.post(this.getURI(`generate?period=${period}&format=${format}`), {});
  }

  async generateReportByDateRange(startDate: string, endDate: string, format: string = "pdf") {
    return await http.post(this.getURI(`generate?startDate=${startDate}&endDate=${endDate}&format=${format}`), {});
  }

  async downloadReport(fileName: string) {
    const response = await fetch(`http://localhost:5131/api/${this.getURI(`download/${fileName}`)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download file');
    }
    
    return response;
  }
  
  async getReportHistory() {
    return await http.get(this.getURI("history"));
  }
}

const reportService = new ReportService();
export default reportService;
