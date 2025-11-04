import { Budget, CreateBudgetRequest } from '@/features/budgets/types/budget';
import apiClient from '@/lib/api/client';

export const budgetsApi = {
  getAll: async (): Promise<Budget[]> => {
    const response = await apiClient.get<Budget[]>('/budgets');
    return response.data;
  },

  getById: async (id: string): Promise<Budget> => {
    const response = await apiClient.get<Budget>(`/budgets/${id}`);
    return response.data;
  },

  getCurrentMonth: async (): Promise<Budget | null> => {
    const response = await apiClient.get<Budget | null>(
      '/budgets/current-month'
    );
    return response.data;
  },

  getByMonthYear: async (year: number, month: number): Promise<Budget> => {
    const response = await apiClient.get<Budget>(
      `/budgets/monthly/${year}/${month}`
    );
    return response.data;
  },

  getSummary: async (id: string) => {
    const response = await apiClient.get(`/budgets/${id}/summary`);
    return response.data;
  },

  create: async (data: CreateBudgetRequest): Promise<Budget> => {
    const response = await apiClient.post<Budget>('/budgets', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateBudgetRequest>
  ): Promise<Budget> => {
    const response = await apiClient.patch<Budget>(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/budgets/${id}`);
  },
};
