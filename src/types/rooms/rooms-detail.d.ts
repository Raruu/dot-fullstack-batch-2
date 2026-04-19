interface RoomScheduleData {
  id: number;
  subject: string;
  day: RoomScheduleDay;
  startSlotNumber: number;
  endSlotNumber: number;
}

interface RoomTimeslotData {
  id: number;
  slotNumber: number;
  startTime: Date;
  endTime: Date;
}

export interface RoomDetailData {
  id: number;
  roomCode: string;
  roomName: string;
  level: number;
  createdAt: Date;
  schedules: RoomScheduleData[];
  timeslots: RoomTimeslotData[];
}
