import db from "@/libs/db";

export interface RoomDetailData {
  id: number;
  roomCode: string;
  roomName: string;
  level: number;
  createdAt: Date;
}

export async function getRoomDetail(id: number): Promise<RoomDetailData | null> {
  const room = await db.room.findUnique({
    where: { id },
    select: {
      id: true,
      roomCode: true,
      roomName: true,
      level: true,
      createdAt: true,
    },
  });

  return room;
}
