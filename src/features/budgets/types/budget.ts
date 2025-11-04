export interface Budget {
  id: string;
  month: number;
  year: number;
  totalIncome: number;
  needsPercentage: number;
  wantsPercentage: number;
  savingsPercentage: number;
  needsAmount: number;
  wantsAmount: number;
  savingsAmount: number;
  dailyBudget?: number;
  notes?: string;
  goal?: {
    id: string;
    title: string;
    targetAmount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetRequest {
  month: number;
  year: number;
  totalIncome: number;
  needsPercentage?: number;
  wantsPercentage?: number;
  savingsPercentage?: number;
  dailyBudget?: number;
  goalId?: string;
  notes?: string;
}
