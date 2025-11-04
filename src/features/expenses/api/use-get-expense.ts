import { QueryConfig } from '@/lib/react-query';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { expensesApi } from '../lib/expensesApi';

export const getExpenseQueryKey = (id: string) => ['expense', id];

export const getExpenseOptions = (id: string) => {
  return queryOptions({
    queryKey: getExpenseQueryKey(id),
    queryFn: () => expensesApi.getById(id),
    enabled: !!id,
  });
};

type UseGetExpenseParams = {
  id: string;
  queryConfig?: QueryConfig<typeof getExpenseOptions>;
};

export const useGetExpense = ({ id, queryConfig }: UseGetExpenseParams) => {
  return useQuery({
    ...getExpenseOptions(id),
    ...queryConfig,
  });
};
