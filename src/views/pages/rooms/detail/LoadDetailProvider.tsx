"use client";
import { useRoomActions } from "@/views/providers/rooms/RoomActions";

export default function LoadDetailActionSuccess() {
  const { DialogComponent } = useRoomActions();
  return <>{DialogComponent}</>;
}
