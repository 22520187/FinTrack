import http from "./Http";

// Service quản lý các API calls liên quan đến mục tiêu tài chính
class GoalService {
  baseURI: string;
  constructor() {
    this.baseURI = "Goal/";
  }
  
  // Tạo URI endpoint từ base URI
  private getURI(uri: string) {
    return `${this.baseURI}${uri}`;
  }

  // Tạo mục tiêu mới
  async createGoal(data: any) {
    return await http.post(this.getURI("create"), data);
  }

  // Lấy tất cả mục tiêu của user
  async getAllGoals() {
    return await http.get(this.getURI("all"));
  }

  // Lấy thông tin mục tiêu theo ID
  async getGoalById(goalId: number) {
    return await http.get(this.getURI(`${goalId}`));
  }

  // Cập nhật thông tin mục tiêu
  async updateGoal(goalId: number, data: any) {
    return await http.put(this.getURI(`${goalId}`), data);
  }

  // Xóa mục tiêu
  async deleteGoal(goalId: number) {
    return await http.delete(this.getURI(`${goalId}`));
  }

  // Thêm tiến độ cho mục tiêu
  async addGoalProgress(goalId: number, data: any) {
    return await http.post(this.getURI(`${goalId}/progress`), data);
  }
}

const goalService = new GoalService();
export default goalService;
