import { z } from 'zod';
import { passwordSchema } from './password-schema';

export const updateUserSchema = z
  .object({
    id: z.string().trim().min(1, 'ID user tidak valid.'),
    name: z
      .string()
      .trim()
      .min(1, 'Nama wajib diisi.')
      .max(120, 'Nama terlalu panjang.'),
    email: z.email().min(1, 'Email wajib diisi.'),
    emailVerified: z.boolean(),
    newPassword: passwordSchema.optional().or(z.literal('')),
    confirmPassword: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const newPassword = (value.newPassword ?? '').trim();
    const confirmPassword = (value.confirmPassword ?? '').trim();
    const hasAnyPasswordInput = Boolean(newPassword || confirmPassword);

    if (!hasAnyPasswordInput) {
      return;
    }

    if (!newPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: 'Password baru wajib diisi.',
      });
      return;
    }

    if (newPassword.length < 8) {
      ctx.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: 'Password minimal 8 karakter.',
      });
      return;
    }

    if (!confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Konfirmasi password wajib diisi.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Konfirmasi password tidak sama.',
      });
    }
  });
