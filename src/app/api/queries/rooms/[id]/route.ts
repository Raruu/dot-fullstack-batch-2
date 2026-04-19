import { NextResponse } from "next/server";
import { getUnauthorizedIfNoSession } from "@/controllers/auth/auth-session";
import { getRoomDetail } from "@/models/queries/rooms/get-room-detail";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: Props) {
  const unauthorizedResponse = await getUnauthorizedIfNoSession();

  if (unauthorizedResponse !== true) {
    return unauthorizedResponse;
  }

  const { id } = await params;
  const roomId = Number(id);

  if (!Number.isInteger(roomId) || roomId <= 0) {
    return NextResponse.json({ message: "Invalid room id." }, { status: 400 });
  }

  try {
    const data = await getRoomDetail(roomId);

    if (!data) {
      return NextResponse.json({ message: "Room not found." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to get room detail." },
      { status: 500 },
    );
  }
}
