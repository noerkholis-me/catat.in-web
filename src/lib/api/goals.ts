import { CreateGoalRequest, Goal } from '@/types/goal';
import apiClient from './client';

export const goalsApi = {
  getAll: async (): Promise<Goal[]> => {
    const response = await apiClient.get<Goal[]>('/goals');
    return response.data;
  },

  getActive: async (): Promise<Goal[]> => {
    const response = await apiClient.get<Goal[]>('/goals/active');
    return response.data;
  },

  getById: async (id: string): Promise<Goal> => {
    const response = await apiClient.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  getProgress: async (id: string): Promise<Goal> => {
    const response = await apiClient.get<Goal>(`/goals/${id}/progress`);
    return response.data;
  },

  create: async (data: CreateGoalRequest): Promise<Goal> => {
    const response = await apiClient.post<Goal>('/goals', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateGoalRequest>
  ): Promise<Goal> => {
    const response = await apiClient.patch<Goal>(`/goals/${id}`, data);
    return response.data;
  },

  markAsAchieved: async (id: string): Promise<Goal> => {
    const response = await apiClient.patch<Goal>(`/goals/${id}/achieve`, {});
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/goals/${id}`);
  },
};
