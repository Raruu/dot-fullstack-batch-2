import { PAGINATION_DEFAULT_PAGE_SIZE } from "@/libs/config";
import db from "@/libs/db";
import { parsePositiveInt } from "@/libs/utils";
import { RoomListData, RoomListQueryInput } from "@/types/rooms/rooms-list";

export async function getRoomListData(
  input: RoomListQueryInput = {},
): Promise<RoomListData> {
  const page = parsePositiveInt(input.page, 1);
  const pageSize = parsePositiveInt(
    input.pageSize,
    PAGINATION_DEFAULT_PAGE_SIZE,
  );
  const search = (input.search ?? "").trim();
  const parsedFloor = Number(input.floor);
  const floor =
    Number.isInteger(parsedFloor) && parsedFloor > 0
      ? String(parsedFloor)
      : "all";

  const where = {
    ...(search
      ? {
          OR: [
            {
              roomCode: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              roomName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
    ...(floor !== "all" ? { level: Number(floor) } : {}),
  };

  const [rows, totalCount, floorRows] = await Promise.all([
    db.room.findMany({
      where,
      orderBy: [{ level: "asc" }, { roomCode: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        roomCode: true,
        roomName: true,
        level: true,
      },
    }),
    db.room.count({ where }),
    db.room.findMany({
      distinct: ["level"],
      orderBy: { level: "asc" },
      select: { level: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    rows,
    floors: floorRows.map((row) => row.level),
    filters: {
      floor,
      search,
    },
    pagination: {
      page: Math.min(page, totalPages),
      pageSize,
      totalPages,
      totalCount,
    },
  };
}
