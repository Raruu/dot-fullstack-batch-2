import db from '@/models/db';
import { DeleteRoomState } from '@/types/rooms/rooms-actions';

export async function deleteRoomAction(
  revalidateTarget: string,
  _prevState: DeleteRoomState,
  formData: FormData,
): Promise<DeleteRoomState> {
  const id = Number(formData.get('id'));

  if (!Number.isInteger(id) || id <= 0) {
    return {
      success: false,
      message: 'ID ruangan tidak valid.',
    };
  }

  try {
    await db.room.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Ruangan berhasil dihapus.',
    };
  } catch {
    return {
      success: false,
      message: 'Gagal menghapus ruangan.',
    };
  }
}
