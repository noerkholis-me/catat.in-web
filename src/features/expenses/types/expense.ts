export interface Category {
  id: string;
  name: string;
  type: 'needs' | 'wants' | 'savings';
  icon?: string;
  color?: string;
  isSystem: boolean;
}

export interface BudgetSummary {
  id: string;
  month: number;
  year: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  quantity: number;
  unit?: string | null;
  expenseDate: string;
  expenseTime?: string | null;
  notes?: string | null;
  location?: string | null;
  paymentMethod?: string | null;
  receiptUrl?: string | null;
  isGroup: boolean;
  category: Category;
  budget?: BudgetSummary | null;
  childExpenses?: Expense[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  name: string;
  amount: number;
  quantity?: number;
  unit?: string;
  expenseDate: string;
  expenseTime?: string;
  notes?: string;
  location?: string;
  categoryId: string;
  budgetId?: string;
  paymentMethod?: string;
  receiptUrl?: string;
  parentExpenseId?: string;
  isGroup?: boolean;
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {}
