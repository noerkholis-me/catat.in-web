import { budgetsApi } from '@/lib/api/budgets';
import { QueryConfig } from '@/lib/react-query';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getBudgetsQueryKey = () => ['budgets'];

export const getBudgetsOptions = () => {
  return queryOptions({
    queryKey: getBudgetsQueryKey(),
    queryFn: () => budgetsApi.getAll(),
  });
};

type UseGetBudgetsParams = {
  queryConfig?: QueryConfig<typeof budgetsApi.getAll>;
};

export const useGetBudgets = (params?: UseGetBudgetsParams) => {
  return useQuery({
    ...getBudgetsOptions(),
    ...params?.queryConfig,
  });
};
