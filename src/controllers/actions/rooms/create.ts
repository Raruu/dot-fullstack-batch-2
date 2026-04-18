"use server";

import db from "@/libs/db";
import { CreateRoomState } from "@/types/rooms/rooms-actions";
import { createRoomSchema } from "@/models/validations/rooms/create-room-schema";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createRoomAction(
  revalidateTarget: string,
  _prevState: CreateRoomState,
  formData: FormData,
): Promise<CreateRoomState> {
  const parsed = createRoomSchema.safeParse({
    roomCode: formData.get("roomCode"),
    roomName: formData.get("roomName"),
    level: Number(formData.get("level")),
  });

  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;

    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        "Input penambahan ruangan tidak valid.",
      errors: fieldErrors,
    };
  }

  try {
    const room = await db.room.create({
      data: parsed.data,
    });

    revalidatePath(revalidateTarget);

    return {
      success: true,
      message: "Ruangan berhasil ditambahkan.",
      errors: {},
      createdId: room.id,
    };
  } catch (error) {
    const isRoomCodeConflict =
      error instanceof Error &&
      error.message.toLowerCase().includes("unique") &&
      error.message.toLowerCase().includes("roomcode");

    const message = isRoomCodeConflict
      ? "Kode ruangan sudah dipakai."
      : "Gagal menambah ruangan.";

    const errors = {
      roomCode: [message],
    };

    return {
      success: false,
      message,
      errors: isRoomCodeConflict ? errors : {},
    };
  }
}
