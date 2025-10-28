export interface Category {
  id: string;
  name: string;
  type: 'needs' | 'wants' | 'savings';
  icon?: string;
  color?: string;
  isSystem: boolean;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  quantity: number;
  unit?: string;
  expenseDate: string;
  expenseTime?: string;
  notes?: string;
  location?: string;
  paymentMethod?: string;
  receiptUrl?: string;
  isGroup: boolean;
  category: Category;
  childExpenses?: Expense[];
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
