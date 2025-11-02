import { categoriesApi } from '@/lib/api/categories';
import { QueryConfig } from '@/lib/react-query';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getCategoriesQueryKey = () => ['categories'];

export const getCategoriesOptions = () => {
  return queryOptions({
    queryKey: getCategoriesQueryKey(),
    queryFn: () => categoriesApi.getAll(),
  });
};

type UseGetCategoriesParams = {
  queryConfig?: QueryConfig<typeof categoriesApi.getAll>;
};

export const useGetCategories = (params?: UseGetCategoriesParams) => {
  return useQuery({
    ...getCategoriesOptions(),
    ...params?.queryConfig,
  });
};
