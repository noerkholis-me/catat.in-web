import { User } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User) => {
        set({ user });
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await authApi.login({ email, password });

          localStorage.setItem("accessToken", response.accessToken);

          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          console.log("error useAuthStore : ", error);
          throw error;
        }
      },

      register: async (email: string, password: string, fullName: string) => {
        try {
          set({ isLoading: true });
          const response = await authApi.register({
            email,
            password,
            fullName,
          });

          localStorage.setItem("accessToken", response.accessToken);

          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      initializeAuth: async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        try {
          set({ isLoading: true });
          const response = await authApi.getProfile();

          set({
            user: response,
            accessToken: token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem("accessToken");
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
