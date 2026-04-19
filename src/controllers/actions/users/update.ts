"use server";

import { auth } from "@/libs/auth";
import db from "@/libs/db";
import { updateUserSchema } from "@/models/validations/users/update-user-schema";
import { UpdateUserState } from "@/types/users/users-actions";
import { revalidatePath } from "next/cache";
import { saveProfileImage } from "./image-upload";
import z from "zod";

export async function updateUserAction(
  revalidateTarget: string,
  _prevState: UpdateUserState,
  formData: FormData,
): Promise<UpdateUserState> {
  const parsed = updateUserSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    emailVerified: String(formData.get("emailVerified")) === "true",
    newPassword: formData.get("newPassword") ?? "",
    confirmPassword: formData.get("confirmPassword") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;

    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Input user tidak valid.",
      errors: fieldErrors,
    };
  }

  try {
    const imageFile = formData.get("imageFile");
    const imageCurrent = String(formData.get("imageCurrent") ?? "").trim();
    let imagePath = imageCurrent || null;

    if (imageFile instanceof File && imageFile.size > 0) {
      imagePath = await saveProfileImage(imageFile);
    }

    await db.user.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        image: imagePath,
        emailVerified: parsed.data.emailVerified,
      },
    });

    const newPassword = (parsed.data.newPassword ?? "").trim();

    if (newPassword) {
      const token = crypto.randomUUID().replace(/-/g, "");

      await db.verification.create({
        data: {
          id: crypto.randomUUID(),
          identifier: `reset-password:${token}`,
          value: parsed.data.id,
          expiresAt: new Date(Date.now() + 60 * 1000),
        },
      });

      await auth.api.resetPassword({
        body: {
          token,
          newPassword,
        },
      });
    }

    revalidatePath(revalidateTarget);
    revalidatePath(`${revalidateTarget}/${parsed.data.id}`);

    return {
      success: true,
      message: "User berhasil diperbarui.",
      errors: {},
      updatedId: parsed.data.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    const isEmailConflict =
      error instanceof Error &&
      error.message.toLowerCase().includes("unique") &&
      error.message.toLowerCase().includes("email");
    const isUploadError =
      errorMessage.includes("File harus berupa gambar") ||
      errorMessage.includes("Ukuran gambar maksimal") ||
      errorMessage.includes("Gagal memproses gambar");

    const message = isEmailConflict
      ? "Email sudah dipakai."
      : isUploadError
        ? errorMessage
        : "Gagal memperbarui user.";

    const lowerMessage = message.toLowerCase();

    let errors = {};
    if (isEmailConflict || lowerMessage.includes("email")) {
      errors = { email: [message] };
    } else if (isUploadError) {
      errors = { imageFile: [message] };
    } else if (
      lowerMessage.includes("password") ||
      lowerMessage.includes("token")
    ) {
      errors = { newPassword: [message] };
    }

    return {
      success: false,
      message,
      errors,
    };
  }
}
