import { MutationConfig } from '@/lib/react-query';
import { useMutation } from '@tanstack/react-query';
import { expensesApi } from '@/lib/api/expenses';

type UseCreateExpenseParams = {
  mutationConfig?: MutationConfig<typeof expensesApi.create>;
};

export const useCreateExpense = (params: UseCreateExpenseParams = {}) => {
  return useMutation({
    ...params.mutationConfig,
    mutationFn: (data) => expensesApi.create(data),
    onSuccess: (data, variable, onMutateResult, context) => {
      params.mutationConfig?.onSuccess?.(
        data,
        variable,
        onMutateResult,
        context
      );
    },
  });
};
