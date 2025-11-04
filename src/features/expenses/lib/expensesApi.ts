import {
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from '@/features/expenses/types/expense';
import apiClient from '@/lib/api/client';
import { PaginatedResponse } from '@/types/api';

export interface ExpenseQueryParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  budgetId?: string;
  page?: number;
  limit?: number;
}

export const expensesApi = {
  getAll: async (
    params?: ExpenseQueryParams
  ): Promise<PaginatedResponse<Expense>> => {
    const response = await apiClient.get<PaginatedResponse<Expense>>(
      '/expenses',
      { params }
    );

    console.log('response ori ==> ', response);
    return response.data;
  },

  getById: async (id: string): Promise<Expense> => {
    const response = await apiClient.get<Expense>(`/expenses/${id}`);
    return response.data;
  },

  getTodayTotal: async (): Promise<{
    total: number;
    count: number;
    date: string;
  }> => {
    const response = await apiClient.get('/expenses/today');
    return response.data;
  },

  getMonthlyTotal: async (year: number, month: number) => {
    const response = await apiClient.get(`/expenses/monthly/${year}/${month}`);
    return response.data;
  },

  getRecent: async (limit: number = 10): Promise<Expense[]> => {
    const response = await apiClient.get<Expense[]>('/expenses/recent');
    return response.data;
  },

  create: async (data: CreateExpenseRequest): Promise<Expense> => {
    const response = await apiClient.post<Expense>('/expenses', data);
    return response.data;
  },

  update: async (data: UpdateExpenseRequest, id: string): Promise<Expense> => {
    const response = await apiClient.patch<Expense>(`/expenses/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/expenses/${id}`);
  },
};
