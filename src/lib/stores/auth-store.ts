import { User } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth';
import apiClient from '../api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          await authApi.login({ email, password });
          const response = await authApi.getCurrentUser();
          set({ user: response.user, isAuthenticated: true });
        } catch (err: any) {
          set({ error: err.response?.data?.message || 'Login failed' });
          console.log('error useAuthStore : ', err);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email: string, password: string, fullName: string) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.register({ email, password, fullName });
          const response = await authApi.getCurrentUser();
          set({ user: response.user, isAuthenticated: true });
        } catch (err: any) {
          set({ error: err.response?.data?.message || 'Register failed' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
          set({ user: null, isAuthenticated: false });
        } catch (err) {
          console.error('Logout error', err);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      refreshToken: async () => {
        try {
          await authApi.refresh();
          // After refresh, get updated user data
          const user = await authApi.getProfile();
          set({
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          // Refresh failed, clear auth state
          set({
            user: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      initializeAuth: async () => {
        // Skip if already initialized
        // if (get().isInitialized) return;

        try {
          set({ isLoading: true });

          // Try to get profile (will trigger refresh if needed)
          const response = await authApi.getProfile();

          set({
            user: response,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          // Auth check failed (no valid token)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
