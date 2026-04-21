import { z } from "zod";

export const createRoomSchema = z.object({
  roomCode: z
    .string()
    .trim()
    .min(1, "Kode ruangan wajib diisi.")
    .max(50, "Kode ruangan terlalu panjang."),
  roomName: z
    .string()
    .trim()
    .min(1, "Nama ruangan wajib diisi.")
    .max(120, "Nama ruangan terlalu panjang."),
  level: z
    .number({ error: "Lantai harus berupa angka." })
    .int("Lantai harus bilangan bulat.")
    .min(1, "Lantai minimal 1."),
});
