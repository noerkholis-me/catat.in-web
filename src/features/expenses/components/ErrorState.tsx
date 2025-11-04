import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';
import { AlertCircle, ArrowLeft, Link } from 'lucide-react';

export const ErrorState = () => {
  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold">
          Pengeluaran tidak ditemukan
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Pengeluaran yang kamu cari tidak ditemukan atau telah dihapus
        </p>
        <Link href={ROUTES.EXPENSES}>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke List
          </Button>
        </Link>
      </Card>
    </div>
  );
};
