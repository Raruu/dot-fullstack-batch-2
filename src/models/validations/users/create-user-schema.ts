import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi.")
    .max(120, "Nama terlalu panjang."),
  email: z.email().min(1, "Email wajib diisi."),
  emailVerified: z.boolean(),
});
