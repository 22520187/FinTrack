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
}

const authService = new AuthService();
export default authService;
