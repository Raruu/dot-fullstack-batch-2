import { z } from "zod";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const imageFileSchema = z
  .instanceof(File, { message: "File gambar wajib diisi." })
  .refine((file) => file.size > 0, "File gambar kosong.")
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
    "Ukuran gambar maksimal 5MB.",
  )
  .refine(
    (file) => file.type.startsWith("image/"),
    "File harus berupa gambar.",
  );
