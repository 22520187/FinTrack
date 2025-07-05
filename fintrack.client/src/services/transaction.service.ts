import http from "./Http";

// Service quản lý các API calls liên quan đến transaction
class TransactionService {
  baseURI: string;
  constructor() {
    this.baseURI = "Transaction/";
  }
  
  // Tạo URI endpoint từ base URI
  private getURI(uri: string) {
    return `${this.baseURI}${uri}`;
  }
  
  // Tạo transaction mới
  async createTransaction(data: any) {
    return await http.post(this.getURI("create"), data);
  }
  
  // Lấy tất cả transaction của user
  async getAllTransaction() {
    return await http.get(this.getURI("all"));
  }

  // Lấy các transaction theo category
  async getAllTransactionByCategory(categoryName: string) {
    return await http.get(this.getURI(`all/${categoryName}`))
  }

  // Cập nhật thông tin transaction
  async updateTransaction(data: any, transactionId: string) {
    return await http.put(this.getURI(`update/${transactionId}`), data)
  }

  // Xóa transaction
  async deleteTransaction(transactionId: string) {
    return await http.delete(this.getURI(`delete/${transactionId}`))
  }
}

const transactionService = new TransactionService();
export default transactionService;
