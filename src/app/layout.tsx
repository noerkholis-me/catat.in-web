import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

// @ts-ignore - allow global CSS side-effect import without type declarations
import "./globals.css";
import { SessionMonitor } from "@/components/auth/session-monitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Catat.in - Smart Expense Tracker",
  description: "Track your expenses, achieve your financial goals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className="dark scheme-dark">
      <body className={inter.className}>
        <SessionMonitor />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{ duration: 4000 }}
          richColors
        />
      </body>
    </html>
  );
}
