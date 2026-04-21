import { z } from 'zod';
import { createRoomSchema } from './create-room-schema';

export const updateRoomSchema = createRoomSchema.extend({
  id: z
    .number({ error: 'ID ruangan tidak valid.' })
    .int('ID ruangan tidak valid.')
    .positive('ID ruangan tidak valid.'),
});
