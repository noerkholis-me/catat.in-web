'use client';

import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Loader2 } from 'lucide-react';
import { redirect, RedirectType, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { isAuthenticated, isInitialized, initializeAuth } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isInitialized]);

  return <>{children}</>;
}
