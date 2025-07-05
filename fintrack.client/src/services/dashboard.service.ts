import http from "./Http";

// Service quản lý các API calls liên quan đến dashboard
class DashboardService {
  baseURI: string;
  constructor() {
    this.baseURI = "Dashboard/";
  }
  
  // Tạo URI endpoint từ base URI
  private getURI(uri: string) {
    return `${this.baseURI}${uri}`;
  }

  // Lấy tổng quan tài chính (thu nhập, chi tiêu, số dư)
  async getSummary() {
    return await http.get(this.getURI("summary"));
  }

  // Lấy chi tiêu theo category để hiển thị chart
  async getCategoryExpenses() {
    return await http.get(this.getURI("category-expenses"));
  }

  // Lấy lịch sử giao dịch theo tháng
  async getTransactionHistory(months: number = 6) {
    return await http.get(this.getURI(`transaction-history?months=${months}`));
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
