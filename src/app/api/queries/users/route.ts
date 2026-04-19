import { NextResponse } from "next/server";
import { getUnauthorizedIfNoSession } from "@/libs/auth-session";
import { getUserListData } from "@/models/queries/users/get-user-list";
import { UserListQueryInput } from "@/types/users/users-list";

export async function GET(request: Request) {
  const unauthorizedResponse = await getUnauthorizedIfNoSession();

  if (unauthorizedResponse !== true) {
    return unauthorizedResponse;
  }

  try {
    const { searchParams } = new URL(request.url);

    const input: UserListQueryInput = {
      status: searchParams.get("status") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    };

    const data = await getUserListData(input);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to get user list." },
      { status: 500 },
    );
  }
}
