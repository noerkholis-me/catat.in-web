import { AuthGuard } from "@/components/auth/auth-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center p-4 dark">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </AuthGuard>
  );
}
