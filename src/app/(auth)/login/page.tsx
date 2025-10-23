"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ROUTES, APP_NAME } from "@/lib/constants";
import { toast } from "sonner";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success("Login berhasil!", {
        description: "Selamat datang kembali",
      });
    } catch (err: any) {
      toast.error("Login gagal", {
        description: err.response?.data?.message || "Email atau password salah",
      });

      console.log(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Masuk ke {APP_NAME}
        </h1>
        <p className="text-sm text-muted-foreground">
          Lanjutkan tracking pengeluaranmu
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        disabled={isLoading}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full h-10" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Footer */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Belum punya akun? </span>
        <Link
          href={ROUTES.REGISTER}
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
