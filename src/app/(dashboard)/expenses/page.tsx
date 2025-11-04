'use client';

import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { ExpenseCard } from '@/features/categories/components/ExpenseCard';
import { useGetExpenses } from '@/features/expenses/api/use-get-expenses';
import { ExpenseQueryParams } from '@/features/expenses/lib/expensesApi';
import { Expense } from '@/features/expenses/types/expense';
import { ROUTES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Badge,
  Calendar,
  ChevronRight,
  Filter,
  Loader2,
  PlusCircle,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type DateRangeFilter = 'thisMonth' | 'lastMonth' | 'all';

export default function ExpensesPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRangeFilter>('thisMonth');

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};

    if (dateRange === 'thisMonth') {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      params.startDate = format(start, 'yyyy-MM-dd');
      params.endDate = format(end, 'yyyy-MM-dd');
    } else if (dateRange === 'lastMonth') {
      const lastMonth = subMonths(new Date(), 1);
      const start = startOfMonth(lastMonth);
      const end = endOfMonth(lastMonth);
      params.startDate = format(start, 'yyyy-MM-dd');
      params.endDate = format(end, 'yyyy-MM-dd');
    }

    if (selectedCategory !== 'all') {
      params.categoryId = selectedCategory;
    }

    return params;
  }, [dateRange, selectedCategory]);

  const { data: expensesData, isLoading: isLoadingExpenses } = useGetExpenses({
    expenseQueryParams: queryParams,
  });

  const { data: categories = [] } = useGetCategories();

  const filteredExpenses = useMemo(() => {
    if (!expensesData) return [];
    if (searchQuery.trim() === '') return expensesData.data;

    return expensesData.data.filter((expense) => {
      return expense.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [expensesData?.data, searchQuery]);

  const groupedExpenses = useMemo(() => {
    return filteredExpenses.reduce((groups, expense) => {
      const date = expense.expenseDate;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(expense);
      return groups;
    }, {} as Record<string, Expense[]>);
  }, [filteredExpenses]);

  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
  }, [filteredExpenses]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Pengeluaran</h1>
          <p className="text-sm text-muted-foreground">
            {filteredExpenses.length} pengeluaran
          </p>
        </div>
        <Link href={`${ROUTES.EXPENSES}/new`}>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Tambah
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengeluaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.icon && `${cat.icon} `}
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range */}
          <Select
            value={dateRange}
            onValueChange={(v: DateRangeFilter) => setDateRange(v)}
          >
            <SelectTrigger>
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">Bulan Ini</SelectItem>
              <SelectItem value="lastMonth">Bulan Lalu</SelectItem>
              <SelectItem value="all">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Total */}
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
          <p className="text-2xl font-semibold">{formatCurrency(totalSpent)}</p>
        </div>
      </Card>

      {/* List */}
      {isLoadingExpenses ? (
        <LoadingState />
      ) : filteredExpenses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedExpenses)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, items]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {format(new Date(date), 'EEEE, dd MMMM yyyy', {
                      locale: id,
                    })}
                  </h3>
                  <Separator className="flex-1" />
                </div>

                {/* Expense Items */}
                <div className="space-y-2">
                  {items.map((expense) => (
                    <ExpenseCard key={expense.id} expense={expense} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
