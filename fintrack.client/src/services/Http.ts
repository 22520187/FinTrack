import axios, { AxiosInstance } from "axios";

class Http {
  private api: AxiosInstance;

  constructor() {
    

    this.api = axios.create({
      baseURL: "http://localhost:5131/api/",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Add request interceptor to include token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle unauthorized requests (e.g., session expired)
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.warn("Session expired. Redirecting to login...");
          // Clear localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Redirect user to login page
          window.location.href = "/login";
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