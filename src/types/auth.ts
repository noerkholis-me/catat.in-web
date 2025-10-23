export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  currentStreak: number;
  longestStreak: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
