import { z } from "zod";
import { passwordSchema } from "./password-schema";

export const createUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nama wajib diisi.")
      .max(120, "Nama terlalu panjang."),
    email: z.email().min(1, "Email wajib diisi."),
    emailVerified: z.boolean(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Konfirmasi password tidak sama.",
      });
    }
  });
