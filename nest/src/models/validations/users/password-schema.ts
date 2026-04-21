import z from 'zod';

export const passwordSchema = z
  .string({ error: 'Password wajib diisi.' })
  .min(8, 'Password minimal 8 karakter.')
  .max(128, 'Password maksimal 128 karakter.');
