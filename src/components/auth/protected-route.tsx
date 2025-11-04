'use client';

import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { ROUTES } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeAuth, isInitialized } =
    useAuthStore();

  console.log({ isLoading, isAuthenticated });

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      redirect(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  console.log('isAuthenticated', isAuthenticated);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
