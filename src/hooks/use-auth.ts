import { ROUTES } from '@/lib/constants';
import { LoginFormData, RegisterFormData } from '@/lib/schemas/auth.schema';
import { useAuthStore } from '@/lib/stores/auth-store';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    initializeAuth,
  } = useAuthStore();

  const handleLogin = async ({ email, password }: LoginFormData) => {
    await login(email, password);
    router.push(ROUTES.DASHBOARD);
  };

  const handleRegister = async ({
    email,
    fullName,
    password,
  }: RegisterFormData) => {
    await register(email, password, fullName);
    router.push(ROUTES.DASHBOARD);
  };

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN, { scroll: true });
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    initializeAuth,
  };
}
