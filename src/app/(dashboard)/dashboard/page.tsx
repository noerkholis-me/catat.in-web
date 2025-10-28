'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { PlusCircle, TrendingUp, Wallet, Target } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Halo, {user?.fullName} 👋</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Spending */}
        <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Pengeluaran
              </p>
              <p className="text-3xl font-semibold">Rp 0</p>
              <p className="text-xs text-muted-foreground">Bulan ini</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Budget Remaining */}
        <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Budget Tersisa
              </p>
              <p className="text-3xl font-semibold">Rp 0</p>
              <p className="text-xs text-muted-foreground">Dari total budget</p>
            </div>
            <div className="rounded-full bg-green-500/10 p-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Streak
              </p>
              <p className="text-3xl font-semibold">
                {user?.currentStreak || 0} hari
              </p>
              <p className="text-xs text-muted-foreground">
                Terlama: {user?.longestStreak || 0} hari
              </p>
            </div>
            <div className="rounded-full bg-orange-500/10 p-3">
              <Target className="h-5 w-5 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-card p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-muted p-6">
            <PlusCircle className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Belum ada pengeluaran</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Mulai tracking pengeluaranmu hari ini untuk melihat insights dan
              mencapai goal finansial
            </p>
          </div>
          <Link href={`${ROUTES.EXPENSES}/new`}>
            <Button size="lg" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Tambah Pengeluaran Pertama
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity - Empty State */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Belum ada aktivitas untuk ditampilkan
          </p>
        </div>
      </div>
    </div>
  );
}
