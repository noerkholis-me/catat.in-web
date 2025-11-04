import { QueryConfig } from '@/lib/react-query';
import { QueryOptions, queryOptions, useQuery } from '@tanstack/react-query';
import { ExpenseQueryParams, expensesApi } from '../lib/expensesApi';

export const getExpensesQueryKey = (params?: ExpenseQueryParams) => [
  'expenses',
  params,
];

export const getExpensesOptions = (params?: ExpenseQueryParams) => {
  return queryOptions({
    queryKey: getExpensesQueryKey(params),
    queryFn: () => expensesApi.getAll(params),
  });
};

type UseGetExpensesParams = {
  queryConfig?: QueryConfig<typeof getExpensesOptions>;
  expenseQueryParams?: ExpenseQueryParams;
};

export const useGetExpenses = (params: UseGetExpensesParams = {}) => {
  return useQuery({
    ...getExpensesOptions(params?.expenseQueryParams),
    ...params?.queryConfig,
  });
};
