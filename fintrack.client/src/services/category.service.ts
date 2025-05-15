import http from "./Http";

class CategoryService {
  baseURI: string;
  constructor() {
    this.baseURI = "Category/";
  }
  private getURI(uri: string) {
    return `${this.baseURI}${uri}`;
  }
  async createCategory(data: any) {
    return await http.post(this.getURI("create"), data);
  }
  async getAllCategory() {
    return await http.get(this.getURI("all"));
  }

  async getTotalAmountByCategory(categoryName: string, type: string) {
    return await http.get(this.getURI(`total/${categoryName}?Type=${type}`))
  }

  async deleteCategory(categoryName: string, type: string) {
    return await http.delete(this.getURI(`delete/${categoryName}?Type=${type}`))
  }

}

const categoryService = new CategoryService();
export default categoryService;
