import http from "./Http";

class DashboardService {
  baseURI: string;
  constructor() {
    this.baseURI = "Dashboard/";
  }
  private getURI(uri: string) {
    return `${this.baseURI}${uri}`;
  }

  async getSummary() {
    return await http.get(this.getURI("summary"));
  }

  async getCategoryExpenses() {
    return await http.get(this.getURI("category-expenses"));
  }

  async getTransactionHistory(months: number = 6) {
    return await http.get(this.getURI(`transaction-history?months=${months}`));
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
