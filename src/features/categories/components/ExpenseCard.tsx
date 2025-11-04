import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Expense } from '@/features/expenses/types/expense';
import { ROUTES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const ExpenseCard = ({ expense }: { expense: Expense }) => {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <Link href={`${ROUTES.EXPENSES}/${expense.id}`}>
        <div className="flex items-center gap-4 px-4 py-2">
          {/* Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
            <span className="text-2xl">{expense.category.icon || '💰'}</span>
          </div>

          {/* Info */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="overflow-hidden">
                <p className="truncate font-medium">{expense.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {expense.category.name}
                  </Badge>
                  {expense.expenseTime && (
                    <span className="text-xs text-muted-foreground">
                      {expense.expenseTime}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {formatCurrency(Number(expense.amount))}
                </p>
                {expense.quantity !== 1 && expense.unit && (
                  <p className="text-xs text-muted-foreground">
                    {expense.quantity} {expense.unit}
                  </p>
                )}
              </div>
            </div>

            {expense.notes && (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {expense.notes}
              </p>
            )}
          </div>

          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </Link>
    </Card>
  );
};
