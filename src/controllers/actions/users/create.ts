"use server";

import db from "@/libs/db";
import { createUserSchema } from "@/models/validations/users/create-user-schema";
import { CreateUserState } from "@/types/users/users-actions";
import { revalidatePath } from "next/cache";
import { saveProfileImage } from "./image-upload";
import z from "zod";

export async function createUserAction(
  revalidateTarget: string,
  _prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    emailVerified: String(formData.get("emailVerified")) === "true",
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
    let imagePath: string | null = null;

    if (imageFile instanceof File && imageFile.size > 0) {
      imagePath = await saveProfileImage(imageFile);
    }

    const user = await db.user.create({
      data: {
        id: crypto.randomUUID(),
        name: parsed.data.name,
        email: parsed.data.email,
        image: imagePath,
        emailVerified: parsed.data.emailVerified,
      },
    });

    revalidatePath(revalidateTarget);

    return {
      success: true,
      message: "User berhasil ditambahkan.",
      errors: {},
      createdId: user.id,
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
        : "Gagal menambah user.";

    const errorConflict = {
      email: [message],
    };

    const errorUpload = {
      imageFile: [message],
    };

    return {
      success: false,
      message,
      errors: isEmailConflict
        ? errorConflict
        : isUploadError
          ? errorUpload
          : {},
    };
  }
}
