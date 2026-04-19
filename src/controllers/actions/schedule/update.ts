"use server";

import db from "@/models/db";
import {
  updateScheduleSchema,
  type UpdateScheduleSchema,
} from "@/models/validations/schedule/update-schedule-schema";
import { UpdateScheduleState } from "@/types/schedules/schedules-actions";
import { revalidatePath } from "next/cache";
import z from "zod";

function normalizeRange(slotNumbers: number[]): { start: number; end: number } {
  const [start, end] = [...slotNumbers].sort((a, b) => a - b);

  return {
    start,
    end,
  };
}

function parsePayload(formData: FormData): UpdateScheduleSchema {
  const rawSlots = formData.getAll("slotNumbers");

  return {
    id: Number(formData.get("id")),
    roomId: Number(formData.get("roomId")),
    subject: String(formData.get("subject") ?? ""),
    day: String(formData.get("day") ?? "MONDAY") as UpdateScheduleSchema["day"],
    slotNumbers: rawSlots.map((value) => Number(value)),
  };
}

export async function updateScheduleAction(
  revalidateTarget: string,
  _prevState: UpdateScheduleState,
  formData: FormData,
): Promise<UpdateScheduleState> {
  const parsed = updateScheduleSchema.safeParse(parsePayload(formData));

  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;

    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        "Input perubahan agenda tidak valid.",
      errors: fieldErrors,
    };
  }

  const { start, end } = normalizeRange(parsed.data.slotNumbers);

  try {
    const [existing, targetSlots, existingSchedules] = await Promise.all([
      db.schedule.findFirst({
        where: {
          id: parsed.data.id,
          roomId: parsed.data.roomId,
        },
        select: {
          id: true,
          roomId: true,
        },
      }),
      db.timeslot.findMany({
        where: {
          slotNumber: {
            in: [start, end],
          },
        },
        select: {
          id: true,
          slotNumber: true,
        },
      }),
      db.schedule.findMany({
        where: {
          roomId: parsed.data.roomId,
          day: parsed.data.day,
          id: {
            not: parsed.data.id,
          },
        },
        select: {
          id: true,
          startTimeSlot: {
            select: {
              slotNumber: true,
            },
          },
          endTimeSlot: {
            select: {
              slotNumber: true,
            },
          },
        },
      }),
    ]);

    if (!existing) {
      return {
        success: false,
        message: "agenda tidak ditemukan.",
      };
    }

    const startSlot = targetSlots.find((item) => item.slotNumber === start);
    const endSlot = targetSlots.find((item) => item.slotNumber === end);

    if (!startSlot || !endSlot) {
      return {
        success: false,
        message: "Timeslot tidak ditemukan.",
        errors: {
          slotNumbers: ["Range timeslot tidak valid."],
        },
      };
    }

    const isOverlapping = existingSchedules.some((schedule) => {
      const existingStart = Math.min(
        schedule.startTimeSlot.slotNumber,
        schedule.endTimeSlot.slotNumber,
      );
      const existingEnd = Math.max(
        schedule.startTimeSlot.slotNumber,
        schedule.endTimeSlot.slotNumber,
      );

      return !(end < existingStart || start > existingEnd);
    });

    if (isOverlapping) {
      return {
        success: false,
        message: "Range timeslot bertabrakan dengan agenda lain.",
        errors: {
          slotNumbers: ["Pilih range yang tidak terpotong agenda lain."],
        },
      };
    }

    await db.schedule.update({
      where: {
        id: existing.id,
      },
      data: {
        subject: parsed.data.subject,
        day: parsed.data.day,
        startTimeSlotId: startSlot.id,
        endTimeSlotId: endSlot.id,
      },
    });

    revalidatePath(revalidateTarget);
    revalidatePath(`${revalidateTarget}/${parsed.data.roomId}`);

    return {
      success: true,
      message: "agenda berhasil diperbarui.",
      errors: {},
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui agenda.",
    };
  }
}
