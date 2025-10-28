import apiClient from './client';
import { Category } from '@/types/expense';

interface CreateCategoryRequest {
  name: string;
  type: 'needs' | 'wants' | 'savings';
  icon?: string;
  color?: string;
  parentCategoryId?: string;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateCategoryRequest>
  ): Promise<Category> => {
    const response = await apiClient.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
