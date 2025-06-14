import axios, { AxiosInstance } from "axios";

class Http {
  private api: AxiosInstance;

  constructor() {
    console.log("env", import.meta.env.VITE_API_URL);

    this.api = axios.create({
      baseURL: "http://localhost:5131/api/",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Handle unauthorized requests (e.g., session expired)
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.warn("Session expired. Redirecting to login...");
          window.location.href = "/login"; // Redirect user to login page
        }
        return Promise.reject(error);
      }
    );
  }

  async get(endpoint: string) {
    return this.api.get(endpoint);
  }

  async post(endpoint: string, data: object) {
    return this.api.post(endpoint, data);
  }

  async put(endpoint: string, data: object) {
    return this.api.put(endpoint, data);
  }

  async patch(endpoint: string, data: object) {
    return this.api.patch(endpoint, data);
  }

  async delete(endpoint: string) {
    return this.api.delete(endpoint);
  }
}

const http = new Http();
export default http;