import { z } from 'zod';
import { slotNumbersSchema } from '../timeslot/slot-numbers-schema';
import { dayEnum } from '../enums/day';

export const updateScheduleSchema = z
  .object({
    id: z
      .number({ error: 'Agenda tidak valid.' })
      .int('Agenda tidak valid.')
      .positive('Agenda tidak valid.'),
    roomId: z
      .number({ error: 'Ruangan tidak valid.' })
      .int('Ruangan tidak valid.')
      .positive('Ruangan tidak valid.'),
    subject: z
      .string({ error: 'Agenda wajib diisi.' })
      .trim()
      .min(1, 'Agenda wajib diisi.')
      .max(30, 'Agenda maksimal 30 karakter.'),
    day: dayEnum,
    slotNumbers: slotNumbersSchema,
  })
  .superRefine((value, ctx) => {
    const [start, end] = [...value.slotNumbers].sort((a, b) => a - b);

    if (start === undefined || end === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['slotNumbers'],
        message: 'Range slot wajib dipilih.',
      });
      return;
    }
  });

export type UpdateScheduleSchema = z.infer<typeof updateScheduleSchema>;
