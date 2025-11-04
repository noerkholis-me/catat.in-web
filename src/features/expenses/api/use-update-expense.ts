import { MutationConfig, queryClient } from '@/lib/react-query';
import { useMutation } from '@tanstack/react-query';
import { expensesApi } from '../lib/expensesApi';
import { UpdateExpenseRequest } from '../types/expense';
import { getExpensesQueryKey } from './use-get-expenses';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

type UseUpdateExpenseParams = {
  mutationConfig?: MutationConfig<typeof expensesApi.update>;
  expenseId: string;
};

export const useUpdateExpense = (params: UseUpdateExpenseParams) => {
  return useMutation({
    ...params.mutationConfig,
    mutationFn: (data) => expensesApi.update(data, params.expenseId),
    onSuccess: (data, variable, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: getExpensesQueryKey() });
      toast.success('Pengeluaran berhasil diperbarui!', {
        description: `${data.name} - ${formatCurrency(Number(data.amount))}`,
      });

      params.mutationConfig?.onSuccess?.(
        data,
        variable,
        onMutateResult,
        context
      );
    },
  });
};
