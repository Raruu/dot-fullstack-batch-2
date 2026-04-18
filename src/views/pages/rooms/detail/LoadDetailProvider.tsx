"use client";
import { useRoomActions } from "@/views/providers/rooms/RoomActions";

export default function LoadDetailProvider() {
  const { DialogComponent } = useRoomActions();
  return <>{DialogComponent}</>;
}
