import { Inbox, Link, PlusCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ROUTES } from '@/lib/constants';

export const EmptyState = () => {
  return (
    <Card className="p-12 text-center">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-muted p-6">
          <Inbox className="h-10 w-10 text-muted-foreground" />
        </div>
      </div>
      <h3 className="mb-2 text-lg font-semibold">Belum ada pengeluaran</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Mulai tracking pengeluaranmu hari ini
      </p>
      <Link href={`${ROUTES.EXPENSES}/new`}>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Pengeluaran
        </Button>
      </Link>
    </Card>
  );
};
