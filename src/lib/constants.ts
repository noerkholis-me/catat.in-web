export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Catat.in";
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  EXPENSES: "/expenses",
  BUDGETS: "/budgets",
  GOALS: "/goals",
  CATEGORIES: "/categories",
  SETTINGS: "/settings",
} as const;
