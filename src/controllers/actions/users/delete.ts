import { PROFILE_STORAGE_DIR } from '@/libs/config';
import db from '@/models/db';
import { DeleteUserState } from '@/types/users/users-actions';
import { unlink } from 'node:fs/promises';
import path from 'node:path';

async function deleteStoredProfileImage(imagePath: string) {
  const fileName = path.basename(imagePath);

  if (!fileName.toLowerCase().endsWith('.webp')) {
    return;
  }

  const absoluteFilePath = path.join(PROFILE_STORAGE_DIR, fileName);

  try {
    await unlink(absoluteFilePath);
  } catch {
    // nestjs mambooooo
  }
}

export async function deleteUserAction(
  revalidateTarget: string,
  _prevState: DeleteUserState,
  formData: FormData,
): Promise<DeleteUserState> {
  const id = String(formData.get('id') ?? '').trim();

  if (!id) {
    return {
      success: false,
      message: 'ID user tidak valid.',
    };
  }

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: { image: true },
    });

    await db.user.delete({
      where: { id },
    });

    if (user?.image) {
      await deleteStoredProfileImage(user?.image);
    }

    return {
      success: true,
      message: 'User berhasil dihapus.',
    };
  } catch {
    return {
      success: false,
      message: 'Gagal menghapus user.',
    };
  }
}
