import db from '@/models/db';
import { DeleteScheduleState } from '@/types/schedules/schedules-actions';

export async function deleteScheduleAction(
  revalidateTarget: string,
  _prevState: DeleteScheduleState,
  formData: FormData,
): Promise<DeleteScheduleState> {
  const id = Number(formData.get('id'));
  const roomId = Number(formData.get('roomId'));

  if (!Number.isInteger(id) || id <= 0) {
    return {
      success: false,
      message: 'ID agenda tidak valid.',
    };
  }

  if (!Number.isInteger(roomId) || roomId <= 0) {
    return {
      success: false,
      message: 'ID ruangan tidak valid.',
    };
  }

  try {
    await db.schedule.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Agenda berhasil dihapus.',
    };
  } catch {
    return {
      success: false,
      message: 'Gagal menghapus agenda.',
    };
  }
}
