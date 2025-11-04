'use client';

import { useRouter, useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CreditCard,
  Tag,
  FileText,
  Loader2,
  Trash2,
  Edit,
  Package,
  AlertCircle,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';
import { useDeleteExpense } from '@/features/expenses/api/use-delete-expense';
import { useGetExpense } from '@/features/expenses/api/use-get-expense';
import { LoadingState } from '@/features/expenses/components/LoadingState';
import { ErrorState } from '@/features/expenses/components/ErrorState';
import { DetailItem } from '@/features/expenses/components/DetailItem';

export default function ExpenseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = params.id as string;

  const { data: expense, isLoading, error } = useGetExpense({ id: expenseId });

  const deleteMutation = useDeleteExpense({
    mutationConfig: {
      onSuccess: () => {
        router.push(ROUTES.EXPENSES);
      },
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(expenseId);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !expense) {
    return <ErrorState />;
  }

  const total = Number(expense.amount) * Number(expense.quantity);
  const hasQuantityInfo = expense.quantity !== 1 || expense.unit;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={ROUTES.EXPENSES}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Detail Pengeluaran
            </h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(expense.expenseDate), 'PPP', { locale: id })}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`${ROUTES.EXPENSES}/${expense.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Pengeluaran?</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah kamu yakin ingin menghapus pengeluaran "{expense.name}
                  "? Aksi ini tidak bisa dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteMutation.isPending}>
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    'Hapus'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Amount Card */}
      <Card className="p-8 text-center">
        <div className="mb-2 text-6xl">{expense.category.icon || '💰'}</div>
        <h2 className="mb-1 text-3xl font-bold">{formatCurrency(total)}</h2>
        <p className="text-lg text-muted-foreground">{expense.name}</p>

        {hasQuantityInfo && (
          <div className="mt-4 rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              {formatCurrency(Number(expense.amount))} × {expense.quantity}
              {expense.unit && ` ${expense.unit}`}
            </p>
          </div>
        )}
      </Card>

      {/* Details */}
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Informasi Detail</h3>
        <div className="space-y-4">
          {/* Category */}
          <DetailItem
            icon={<Tag className="h-5 w-5 text-muted-foreground" />}
            label="Kategori"
            value={
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary">
                  {expense.category.icon && `${expense.category.icon} `}
                  {expense.category.name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  ({expense.category.type})
                </span>
              </div>
            }
          />

          <Separator />

          {/* Date & Time */}
          <DetailItem
            icon={<CalendarIcon className="h-5 w-5 text-muted-foreground" />}
            label="Tanggal & Waktu"
            value={
              <>
                <p className="mt-1 font-medium">
                  {format(new Date(expense.expenseDate), 'EEEE, dd MMMM yyyy', {
                    locale: id,
                  })}
                </p>
                {expense.expenseTime && (
                  <p className="mt-1 flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    {expense.expenseTime}
                  </p>
                )}
              </>
            }
          />

          {/* Quantity - Only show if != 1 or has unit */}
          {hasQuantityInfo && (
            <>
              <Separator />
              <DetailItem
                icon={<Package className="h-5 w-5 text-muted-foreground" />}
                label="Quantity"
                value={
                  <p className="mt-1 font-medium">
                    {expense.quantity}
                    {expense.unit && ` ${expense.unit}`}
                  </p>
                }
              />
            </>
          )}

          {/* Payment Method - Only if exists */}
          {expense.paymentMethod && (
            <>
              <Separator />
              <DetailItem
                icon={<CreditCard className="h-5 w-5 text-muted-foreground" />}
                label="Metode Pembayaran"
                value={
                  <p className="mt-1 font-medium capitalize">
                    {expense.paymentMethod.replace('-', ' ')}
                  </p>
                }
              />
            </>
          )}

          {/* Location - Only if exists */}
          {expense.location && (
            <>
              <Separator />
              <DetailItem
                icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
                label="Lokasi"
                value={<p className="mt-1 font-medium">{expense.location}</p>}
              />
            </>
          )}

          {/* Notes - Only if exists */}
          {expense.notes && (
            <>
              <Separator />
              <DetailItem
                icon={<FileText className="h-5 w-5 text-muted-foreground" />}
                label="Catatan"
                value={
                  <p className="mt-1 whitespace-pre-wrap font-medium">
                    {expense.notes}
                  </p>
                }
              />
            </>
          )}

          {/* Budget - Only if exists */}
          {expense.budget && (
            <>
              <Separator />
              <DetailItem
                icon={<Tag className="h-5 w-5 text-muted-foreground" />}
                label="Budget"
                value={
                  <p className="mt-1 font-medium">
                    {expense.budget.month}/{expense.budget.year}
                  </p>
                }
              />
            </>
          )}

          {/* Child Expenses - Only if exists and not empty */}
          {expense.childExpenses && expense.childExpenses.length > 0 && (
            <>
              <Separator />
              <DetailItem
                icon={<Package className="h-5 w-5 text-muted-foreground" />}
                label="Detail Items"
                value={
                  <div className="mt-2 space-y-2">
                    {expense.childExpenses.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between rounded-lg bg-muted p-3"
                      >
                        <div>
                          <p className="font-medium">{child.name}</p>
                          {child.quantity !== 1 && (
                            <p className="text-xs text-muted-foreground">
                              {child.quantity} {child.unit}
                            </p>
                          )}
                        </div>
                        <p className="font-semibold">
                          {formatCurrency(Number(child.amount))}
                        </p>
                      </div>
                    ))}
                  </div>
                }
              />
            </>
          )}
        </div>
      </Card>

      {/* Metadata */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Dibuat: {format(new Date(expense.createdAt), 'PPp', { locale: id })}
          </span>
          {expense.updatedAt !== expense.createdAt && (
            <span>
              Diubah:{' '}
              {format(new Date(expense.updatedAt), 'PPp', { locale: id })}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
