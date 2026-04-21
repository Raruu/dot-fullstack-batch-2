import db from '@/models/db';
import { updateRoomSchema } from '@/models/validations/rooms/update-room-schema';
import { UpdateRoomState } from '@/types/rooms/rooms-actions';
import z from 'zod';

export async function updateRoomAction(
  revalidateTarget: string,
  _prevState: UpdateRoomState,
  formData: FormData,
): Promise<UpdateRoomState> {
  const parsed = updateRoomSchema.safeParse({
    id: Number(formData.get('id')),
    roomCode: formData.get('roomCode'),
    roomName: formData.get('roomName'),
    level: Number(formData.get('level')),
  });

  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;

    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        'Input perubahan ruangan tidak valid.',
      errors: fieldErrors,
    };
  }

  try {
    await db.room.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        roomCode: parsed.data.roomCode,
        roomName: parsed.data.roomName,
        level: parsed.data.level,
      },
    });

    return {
      success: true,
      message: 'Ruangan berhasil diperbarui.',
      errors: {},
    };
  } catch (error) {
    const isRoomCodeConflict =
      error instanceof Error &&
      error.message.toLowerCase().includes('unique') &&
      error.message.toLowerCase().includes('roomcode');

    const message = isRoomCodeConflict
      ? 'Kode ruangan sudah dipakai.'
      : 'Gagal memperbarui ruangan.';

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
