import { NextResponse } from "next/server";
import { getUnauthorizedIfNoSession } from "@/controllers/auth/auth-session";
import { getRoomListData } from "@/models/queries/rooms/get-room-list";
import { RoomListQueryInput } from "@/types/rooms/rooms-list";

export async function GET(request: Request) {
  const unauthorizedResponse = await getUnauthorizedIfNoSession();

  if (unauthorizedResponse !== true) {
    return unauthorizedResponse;
  }

  try {
    const { searchParams } = new URL(request.url);

    const input: RoomListQueryInput = {
      floor: searchParams.get("floor") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    };

    const data = await getRoomListData(input);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to get room list." },
      { status: 500 },
    );
  }
}
