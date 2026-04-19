"use server";

import db from "@/libs/db";
import { DeleteScheduleState } from "@/types/schedules/schedules-actions";
import { revalidatePath } from "next/cache";

export async function deleteScheduleAction(
  revalidateTarget: string,
  _prevState: DeleteScheduleState,
  formData: FormData,
): Promise<DeleteScheduleState> {
  const id = Number(formData.get("id"));
  const roomId = Number(formData.get("roomId"));

  if (!Number.isInteger(id) || id <= 0) {
    return {
      success: false,
      message: "ID agenda tidak valid.",
    };
  }

  if (!Number.isInteger(roomId) || roomId <= 0) {
    return {
      success: false,
      message: "ID ruangan tidak valid.",
    };
  }

  try {
    await db.schedule.delete({
      where: {
        id,
      },
    });

    revalidatePath(revalidateTarget);
    revalidatePath(`${revalidateTarget}/${roomId}`);

    return {
      success: true,
      message: "Agenda berhasil dihapus.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal menghapus agenda.",
    };
  }
}
