import http from "./Http";

class AuthService {
  baseURI: string;
  constructor() {
    this.baseURI = "Account/";
  }
  private getURI(uri: string) {
    return `${this.baseURI}${uri}`;
  }
  async signUp(data: any) {
    return await http.post(this.getURI("register"), data);
  }
  async signIn(data: any) {
    return await http.post(this.getURI("login"), data);
  }

  async forgetPassword(data: any) {
    return await http.post(this.getURI("change-password"), data);
  }

  async updateUserInfo(userId: number, data: any) {
    return await http.put(this.getURI(`update-info/${userId}`), data);
  }

  async logout() {
    try {
      // Call backend logout API
      await http.post(this.getURI("logout"), {});
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with logout even if API fails
    } finally {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect to login page
      window.location.href = "/login";
    }
  }

  // Helper method to check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  // Helper method to get current user
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}

const authService = new AuthService();
export default authService;
