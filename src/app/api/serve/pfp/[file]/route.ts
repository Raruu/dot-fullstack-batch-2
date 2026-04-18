import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { PROFILE_STORAGE_DIR } from "@/libs/config";

interface Props {
  params: Promise<{
    file: string;
  }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { file } = await params;
  const fileName = path.basename(file);

  if (!fileName.toLowerCase().endsWith(".webp")) {
    return NextResponse.json({ message: "File tidak valid." }, { status: 400 });
  }

  const filePath = path.join(PROFILE_STORAGE_DIR, fileName);

  try {
    const imageBuffer = await readFile(filePath);

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Gambar tidak ditemukan." },
      { status: 404 },
    );
  }
}
