import db from '@/models/db';
import {
  createScheduleSchema,
  type CreateScheduleSchema,
} from '@/models/validations/schedule/create-schedule-schema';
import { CreateScheduleState } from '@/types/schedules/schedules-actions';
import z from 'zod';

function normalizeRange(slotNumbers: number[]): { start: number; end: number } {
  const [start, end] = [...slotNumbers].sort((a, b) => a - b);

  return {
    start,
    end,
  };
}

function parsePayload(formData: FormData): CreateScheduleSchema {
  const rawSlots = formData.getAll('slotNumbers');

  return {
    roomId: Number(formData.get('roomId')),
    subject: String(formData.get('subject') ?? ''),
    day: String(formData.get('day') ?? 'MONDAY') as CreateScheduleSchema['day'],
    slotNumbers: rawSlots.map((value) => Number(value)),
  };
}

export async function createScheduleAction(
  revalidateTarget: string,
  _prevState: CreateScheduleState,
  formData: FormData,
): Promise<CreateScheduleState> {
  const parsed = createScheduleSchema.safeParse(parsePayload(formData));

  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;

    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Input agenda tidak valid.',
      errors: fieldErrors,
    };
  }

  const { start, end } = normalizeRange(parsed.data.slotNumbers);

  try {
    const [room, targetSlots, existingSchedules] = await Promise.all([
      db.room.findUnique({
        where: {
          id: parsed.data.roomId,
        },
        select: {
          id: true,
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

    if (!room) {
      return {
        success: false,
        message: 'Ruangan tidak ditemukan.',
      };
    }

    const startSlot = targetSlots.find((item) => item.slotNumber === start);
    const endSlot = targetSlots.find((item) => item.slotNumber === end);

    if (!startSlot || !endSlot) {
      return {
        success: false,
        message: 'Timeslot tidak ditemukan.',
        errors: {
          slotNumbers: ['Range timeslot tidak valid.'],
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
        message: 'Range timeslot bertabrakan dengan agenda lain.',
        errors: {
          slotNumbers: ['Pilih range yang tidak terpotong agenda lain.'],
        },
      };
    }

    await db.schedule.create({
      data: {
        roomId: parsed.data.roomId,
        subject: parsed.data.subject,
        day: parsed.data.day,
        startTimeSlotId: startSlot.id,
        endTimeSlotId: endSlot.id,
      },
    });

    return {
      success: true,
      message: 'Agenda berhasil ditambahkan.',
      errors: {},
    };
  } catch {
    return {
      success: false,
      message: 'Gagal menambahkan agenda.',
    };
  }
}
