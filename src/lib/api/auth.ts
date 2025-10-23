import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";
import apiClient from "./client";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/profile");
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<{ user: User }>("/auth/me");
    return response.data;
  },
};
