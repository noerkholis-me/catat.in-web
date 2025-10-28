"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  Target,
  Tag,
  Settings,
  ChevronLeft,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

const navigation = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: "Expenses", href: ROUTES.EXPENSES, icon: Wallet },
  { name: "Budgets", href: ROUTES.BUDGETS, icon: Target },
  { name: "Goals", href: ROUTES.GOALS, icon: Target },
  { name: "Categories", href: ROUTES.CATEGORIES, icon: Tag },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
              <span className="text-xl font-semibold">Catat.in</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                    isActive && "bg-accent font-medium",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </div>
              </Link>
            );
          })}

          {/* Quick Add Button */}
          <div className="pt-2">
            <Link href={`${ROUTES.EXPENSES}/new`}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary hover:text-primary-foreground",
                  collapsed && "justify-center"
                )}
              >
                <PlusCircle className="h-5 w-5 shrink-0" />
                {!collapsed && <span>Add Expense</span>}
              </div>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-2">
          <Link href={ROUTES.SETTINGS}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                pathname === ROUTES.SETTINGS && "bg-accent",
                collapsed && "justify-center"
              )}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Settings</span>}
            </div>
          </Link>

          {/* User Profile */}
          <div
            className={cn(
              "mt-2 flex items-center gap-3 rounded-lg px-3 py-2",
              collapsed && "justify-center"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {user ? getInitials(user.fullName) : "U"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user?.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            )}
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8 shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
