import { MutationConfig, queryClient } from '@/lib/react-query';
import { useMutation } from '@tanstack/react-query';
import { expensesApi } from '../lib/expensesApi';
import { getExpensesQueryKey } from './use-get-expenses';
import { toast } from 'sonner';

type UseDeleteExpenseParams = {
  mutationConfig?: MutationConfig<typeof expensesApi.delete>;
};

export const useDeleteExpense = (params: UseDeleteExpenseParams = {}) => {
  return useMutation({
    mutationFn: expensesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getExpensesQueryKey() });

      toast.success('Pengeluaran berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error('Gagal menghapus pengeluaran', {
        description: error.response?.data?.message || 'Terjadi kesalahan',
      });
    },
    ...params.mutationConfig,
  });
};
