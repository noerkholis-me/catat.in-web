'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  expenseSchema,
  ExpenseFormData,
} from '@/features/expenses/schemas/expense.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowLeft, CalendarIcon, Loader2, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES, PAYMENT_METHODS } from '@/lib/constants';
import Link from 'next/link';
import { Category } from '@/features/expenses/types/expense';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { useCreateExpense } from '@/features/expenses/api/use-create-expense';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useGetBudgets } from '@/features/budgets/api/use-get-budgets';
import { useGetExpenses } from '@/features/expenses/api/use-get-expenses';

export default function AddExpensePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: '',
      expenseDate: format(new Date(), 'yyyy-MM-dd'),
      quantity: 1,
      categoryId: '',
    },
  });

  const amount = form.watch('amount');
  const quantity = form.watch('quantity');

  const { data: categories, isPending: isLoadingCategories } =
    useGetCategories();
  const { data: budgets, isPending: isLoadingBudgets } = useGetBudgets();
  const { data: expenses, isLoading: isLoadingGetExpenses } = useGetExpenses({
    expenseQueryParams: { page: 1 },
  });

  const { mutate: createExpense } = useCreateExpense({
    mutationConfig: {
      onSuccess: (data) => {
        setIsLoading(true);
        toast.success('Pengeluaran berhasil ditambahkan!', {
          description: `${data.name} - ${formatCurrency(Number(data.amount))}`,
        });
        router.push(ROUTES.EXPENSES);
      },

      onError: (error: any) => {
        toast.error('Gagal menambahkan pengeluaran', {
          description: error.response?.data?.message || 'Terjadi kesalahan',
        });
        setIsLoading(false);
      },
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    createExpense({
      ...data,
      amount: Number(data.amount),
      quantity: data.quantity || 1,
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={ROUTES.EXPENSES}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Tambah Pengeluaran
          </h1>
          <p className="text-sm text-muted-foreground">
            Catat pengeluaran barumu
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nama Pengeluaran <span className="text-destructive">*</span>
                </Label>
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          id="name"
                          placeholder="Contoh: Makan siang"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Amount & Quantity */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Jumlah <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">
                      Rp
                    </span>
                    <FormField
                      name="amount"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              id="amount"
                              type="number"
                              placeholder="25000"
                              className="pl-10"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex gap-2">
                    <FormField
                      name="quantity"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              id="quantity"
                              type="number"
                              placeholder="1"
                              className="flex-1"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="unit"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="unit"
                              className="w-20"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Total Preview */}
              {amount && quantity ? (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(Number(amount) * Number(quantity))}
                  </p>
                </div>
              ) : null}

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="categoryId">
                  Kategori <span className="text-destructive">*</span>
                </Label>
                <FieldGroup>
                  <Controller
                    name="categoryId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingCategories
                                  ? 'Memuat kategori...'
                                  : 'Pilih kategori'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingCategories ? (
                              <SelectItem
                                value="spin"
                                disabled
                                className="flex items-center justify-center p-1.5 text-center"
                              >
                                <Loader2 className="h-6 w-6 animate-spin" />
                              </SelectItem>
                            ) : categories && categories.length > 0 ? (
                              categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  <div className="flex items-center gap-2">
                                    {category.icon && (
                                      <span>{category.icon}</span>
                                    )}
                                    <span>{category.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      ({category.type})
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="Tidak ada kategori" disabled>
                                Tidak ada kategori
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              {/* Date & Time */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    Tanggal <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="expenseDate"
                    control={form.control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={isLoading}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), 'PPP', {
                                locale: id,
                              })
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(
                                date ? format(date, 'yyyy-MM-dd') : ''
                              );
                            }}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expenseTime">Waktu (opsional)</Label>
                  <FormField
                    name="expenseTime"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            id="expenseTime"
                            type="time"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Budget & Payment Method */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budgetId">Budget (opsional)</Label>
                  <Controller
                    name="budgetId"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih budget" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgets?.map((budget) => (
                            <SelectItem key={budget.id} value={budget.id}>
                              {budget?.month}/{budget?.year} -{' '}
                              {formatCurrency(budget?.totalIncome)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
                  <Controller
                    name="paymentMethod"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih metode" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi (opsional)</Label>
                <FormField
                  name="location"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          id="location"
                          placeholder="Contoh: Warung Pak Budi"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (opsional)</Label>
                <FormField
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="notes"
                          placeholder="Tambahkan catatan..."
                          rows={3}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href={ROUTES.EXPENSES} className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Batal
              </Button>
            </Link>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
