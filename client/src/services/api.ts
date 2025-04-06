// src/services/api.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookie-based auth
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Typed API request function
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError<{ message: string }>;
      if (serverError && serverError.response) {
        throw new Error(
          serverError.response.data.message || "An error occurred"
        );
      }
    }
    throw new Error("Network error");
  }
};

// Define API services
export const authService = {
  register: (data: any) =>
    apiRequest({ method: "POST", url: "/auth/register", data }),
  login: (data: any) =>
    apiRequest({ method: "POST", url: "/auth/login", data }),
  logout: () => apiRequest({ method: "GET", url: "/auth/logout" }),
  getMe: () => apiRequest({ method: "GET", url: "/auth/me" }),
  updateDetails: (data: any) =>
    apiRequest({ method: "PUT", url: "/auth/updatedetails", data }),
  updatePassword: (data: any) =>
    apiRequest({ method: "PUT", url: "/auth/updatepassword", data }),
  updatePreferences: (data: any) =>
    apiRequest({ method: "PUT", url: "/auth/preferences", data: { preferences: data } }),
};

export const textService = {
  getTexts: () => apiRequest({ method: "GET", url: "/texts" }),
  createText: (data: any) =>
    apiRequest({ method: "POST", url: "/texts", data }),
  getText: (id: string) => apiRequest({ method: "GET", url: `/texts/${id}` }),
  updateText: (id: string, data: any) =>
    apiRequest({ method: "PUT", url: `/texts/${id}`, data }),
  deleteText: (id: string) =>
    apiRequest({ method: "DELETE", url: `/texts/${id}` }),
  analyzeText: (id: string, data: any) =>
    apiRequest({ method: "POST", url: `/texts/${id}/analyze`, data }),
  getResults: (id: string) =>
    apiRequest({ method: "GET", url: `/texts/${id}/results` }),
};

export const modelService = {
  getModels: () => apiRequest({ method: "GET", url: "/models" }),
  getModel: (id: string) => apiRequest({ method: "GET", url: `/models/${id}` }),
  createModel: (data: any) =>
    apiRequest({ method: "POST", url: "/models", data }),
  updateModel: (id: string, data: any) =>
    apiRequest({ method: "PUT", url: `/models/${id}`, data }),
  deleteModel: (id: string) =>
    apiRequest({ method: "DELETE", url: `/models/${id}` }),
  toggleModelStatus: (id: string) =>
    apiRequest({ method: "PUT", url: `/models/${id}/toggle-status` }),
  getModelsByType: (type: string) =>
    apiRequest({ method: "GET", url: `/models/type/${type}` }),
  getModelLanguages: () =>
    apiRequest({ method: "GET", url: "/models/languages" }),
  updateModelPerformance: (id: string, data: any) =>
    apiRequest({ method: "PUT", url: `/models/${id}/performance`, data }),
};

export const userService = {
  getUsers: () => apiRequest({ method: "GET", url: "/users" }),
  getUser: (id: string) => apiRequest({ method: "GET", url: `/users/${id}` }),
  createUser: (data: any) =>
    apiRequest({ method: "POST", url: "/users", data }),
  updateUser: (id: string, data: any) =>
    apiRequest({ method: "PUT", url: `/users/${id}`, data }),
  deleteUser: (id: string) =>
    apiRequest({ method: "DELETE", url: `/users/${id}` }),
  getUserStats: (id: string) =>
    apiRequest({ method: "GET", url: `/users/${id}/stats` }),
  resetUserPassword: (id: string, data: any) =>
    apiRequest({ method: "PUT", url: `/users/${id}/resetpassword`, data }),
};

export const systemService = {
  getHealth: () => apiRequest({ method: "GET", url: "/health" }),
};

export default api;
