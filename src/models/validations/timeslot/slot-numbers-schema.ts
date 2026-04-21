import z from 'zod';

export const slotNumbersSchema = z
  .array(
    z
      .number({ error: 'Timeslot tidak valid.' })
      .int('Timeslot tidak valid.')
      .positive('Timeslot tidak valid.'),
  )
  .min(1, 'Pilih minimal 1 nilai slot.');
