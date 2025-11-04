import apiClient from '@/lib/api/client';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { AuthResponse, LoginRequest } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

type UseLoginParams = {
  mutationConfig?: MutationConfig<typeof login>;
};

export const useLogin = (params: UseLoginParams = {}) => {
  const router = useRouter();
  const { initializeAuth } = useAuthStore();

  return useMutation({
    ...params.mutationConfig,
    mutationFn: (data) => login(data),
    onSuccess: async (data, variable, onMutateResult, context) => {
      await initializeAuth();

      toast.success('Login berhasil!', {
        description: 'Selamat datang kembali',
      });

      params.mutationConfig?.onSuccess?.(
        data,
        variable,
        onMutateResult,
        context
      );
    },
    onError: () => {
      toast.error('Login gagal', {
        description: 'Email atau password salah',
      });
    },
  });
};
