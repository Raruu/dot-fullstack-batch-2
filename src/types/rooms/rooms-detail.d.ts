export interface RoomDetailData {
  id: number;
  roomCode: string;
  roomName: string;
  level: number;
  createdAt: Date;
  schedules: RoomScheduleData[];
  timeslots: RoomTimeslotData[];
}
