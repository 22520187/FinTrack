import http from "./Http";

// Service quản lý các API calls liên quan đến category
class CategoryService {
  baseURI: string;
  constructor() {
    this.baseURI = "Category/";
  }
  
  // Tạo URI endpoint từ base URI
  private getURI(uri: string) {
    return `${this.baseURI}${uri}`;
  }
  
  // Tạo category mới
  async createCategory(data: any) {
    return await http.post(this.getURI("create"), data);
  }
  
  // Lấy tất cả category của user
  async getAllCategory() {
    return await http.get(this.getURI("all"));
  }

  // Lấy tổng số tiền theo category
  async getTotalAmountByCategory(categoryName: string, type: string) {
    return await http.get(this.getURI(`total/${categoryName}?Type=${type}`))
  }

  // Cập nhật thông tin category
  async updateCategory(categoryName: string, type: string, data: any) {
    return await http.put(this.getURI(`update/${categoryName}?Type=${type}`), data);
  }

  // Xóa category
  async deleteCategory(categoryName: string, type: string) {
    return await http.delete(this.getURI(`delete/${categoryName}?Type=${type}`))
  }
}

const categoryService = new CategoryService();
export default categoryService;
