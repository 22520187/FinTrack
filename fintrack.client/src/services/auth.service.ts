import http from "./Http";

// Service xử lý authentication và user management
class AuthService {
  baseURI: string;
  constructor() {
    this.baseURI = "Account/";
  }
  
  // Tạo URI endpoint từ base URI
  private getURI(uri: string) {
    return `${this.baseURI}${uri}`;
  }
  
  // Đăng ký tài khoản mới
  async signUp(data: any) {
    return await http.post(this.getURI("register"), data);
  }
  
  // Đăng nhập
  async signIn(data: any) {
    return await http.post(this.getURI("login"), data);
  }

  // Đổi mật khẩu
  async forgetPassword(data: any) {
    return await http.post(this.getURI("change-password"), data);
  }

  // Cập nhật thông tin user
  async updateUserInfo(userId: number, data: any) {
    return await http.put(this.getURI(`update-info/${userId}`), data);
  }

  // Đăng xuất và xóa dữ liệu local
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

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}

const authService = new AuthService();
export default authService;
