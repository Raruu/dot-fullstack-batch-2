import db from '@/models/db';
import { RoomDetailData } from '@/types/rooms/rooms-detail';
import { RoomScheduleDay } from '@/types/schedule';

export async function getRoomDetail(
  id: number,
): Promise<RoomDetailData | null> {
  const [room, timeslots] = await Promise.all([
    db.room.findUnique({
      where: { id },
      select: {
        id: true,
        roomCode: true,
        roomName: true,
        level: true,
        createdAt: true,
        schedules: {
          select: {
            id: true,
            subject: true,
            day: true,
            startTimeSlot: {
              select: {
                slotNumber: true,
              },
            },
            endTimeSlot: {
              select: {
                slotNumber: true,
              },
            },
          },
          orderBy: [
            { day: 'asc' },
            {
              startTimeSlot: {
                slotNumber: 'asc',
              },
            },
          ],
        },
      },
    }),
    db.timeslot.findMany({
      orderBy: {
        slotNumber: 'asc',
      },
      select: {
        id: true,
        slotNumber: true,
        startTime: true,
        endTime: true,
      },
    }),
  ]);

  if (!room) {
    return null;
  }

  return {
    id: room.id,
    roomCode: room.roomCode,
    roomName: room.roomName,
    level: room.level,
    createdAt: room.createdAt,
    timeslots,
    schedules: room.schedules.map((item) => ({
      id: item.id,
      subject: item.subject,
      day: item.day as RoomScheduleDay,
      startSlotNumber: item.startTimeSlot.slotNumber,
      endSlotNumber: item.endTimeSlot.slotNumber,
    })),
  };
}
