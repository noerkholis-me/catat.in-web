import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email harus diisi"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(50, "Password maksimal 50 karakter"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Email tidak valid"),
    fullName: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(100, "Nama maksimal 100 karakter"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(50, "Password maksimal 50 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
