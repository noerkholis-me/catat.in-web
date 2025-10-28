export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetAmount?: number;
  targetDate?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  achievedAt?: string;
  currentAmount?: number;
  progressPercentage?: number;
  remainingAmount?: number;
  daysRemaining?: number;
  status?: 'on_track' | 'warning' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  targetAmount?: number;
  targetDate?: string;
  icon?: string;
  color?: string;
}
