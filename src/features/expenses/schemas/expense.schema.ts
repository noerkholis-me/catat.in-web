import { z } from 'zod';

export const expenseSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama pengeluaran harus diisi')
    .max(200, 'Nama maksimal 200 karakter'),

  amount: z
    .number('Jumlah harus berupa angka')
    .positive('Jumlah harus lebih dari 0'),

  quantity: z.number().positive('Quantity harus lebih dari 0').optional(),
  unit: z.string().max(20, 'Unit maksimal 20 karakter').optional(),

  expenseDate: z.string().min(1, 'Tanggal harus diisi'),

  expenseTime: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Format waktu tidak valid (HH:mm)'
    )
    .optional(),

  notes: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),

  location: z.string().max(255, 'Lokasi maksimal 255 karakter').optional(),

  categoryId: z.string().min(1, 'Kategori harus dipilih'),

  budgetId: z.string().optional(),

  paymentMethod: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
