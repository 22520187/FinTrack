import http from "./Http";

class TransactionService {
  baseURI: string;
  constructor() {
    this.baseURI = "Transaction/";
  }
  private getURI(uri: string) {
    return `${this.baseURI}${uri}`;
  }
  async createTransaction(data: any) {
    return await http.post(this.getURI("create"), data);
  }
  async getAllTransaction() {
    return await http.get(this.getURI("all"));
  }

  async getAllTransactionByCategory(categoryName: string) {
    return await http.get(this.getURI(`all/${categoryName}`))
  }

  async updateTransaction(data: any, transactionId: string) {
    return await http.put(this.getURI(`update/${transactionId}`), data)
  }

  async deleteTransaction(transactionId: string) {
    return await http.delete(this.getURI(`delete/${transactionId}`))
  }

}

const transactionService = new TransactionService();
export default transactionService;
