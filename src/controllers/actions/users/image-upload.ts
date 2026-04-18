"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { imageFileSchema } from "@/models/validations/users/image-file-schema";
import { PROFILE_STORAGE_DIR } from "@/libs/config";

export async function saveProfileImage(file: File): Promise<string> {
  const parsedFile = imageFileSchema.safeParse(file);

  if (!parsedFile.success) {
    throw new Error(
      parsedFile.error.issues[0]?.message ?? "File gambar tidak valid.",
    );
  }

  const inputBuffer = Buffer.from(await parsedFile.data.arrayBuffer());
  const outputBuffer = await sharp(inputBuffer)
    .rotate()
    .resize(512, 512, {
      fit: "cover",
      position: "centre",
    })
    .webp({
      quality: 88,
      effort: 4,
    })
    .toBuffer();

  await mkdir(PROFILE_STORAGE_DIR, { recursive: true });

  const fileName = `${crypto.randomUUID()}.webp`;
  const filePath = path.join(PROFILE_STORAGE_DIR, fileName);

  await writeFile(filePath, outputBuffer);

  return `/api/serve/pfp/${fileName}`;
}
