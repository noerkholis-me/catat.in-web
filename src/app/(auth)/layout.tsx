import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 dark">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
