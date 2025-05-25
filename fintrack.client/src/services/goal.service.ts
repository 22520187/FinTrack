import http from "./Http";

class GoalService {
  baseURI: string;
  constructor() {
    this.baseURI = "Goal/";
  }
  private getURI(uri: string) {
    return `${this.baseURI}${uri}`;
  }

  async createGoal(data: any) {
    return await http.post(this.getURI("create"), data);
  }

  async getAllGoals() {
    return await http.get(this.getURI("all"));
  }

  async getGoalById(goalId: number) {
    return await http.get(this.getURI(`${goalId}`));
  }

  async updateGoal(goalId: number, data: any) {
    return await http.put(this.getURI(`${goalId}`), data);
  }

  async deleteGoal(goalId: number) {
    return await http.delete(this.getURI(`${goalId}`));
  }

  async addGoalProgress(goalId: number, data: any) {
    return await http.post(this.getURI(`${goalId}/progress`), data);
  }
}

const goalService = new GoalService();
export default goalService;
