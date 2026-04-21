"use client";
import { useRoomActions } from "@/providers/rooms/RoomActions";

export default function LoadDetailActionSuccess() {
  const { DialogComponent } = useRoomActions();
  return <>{DialogComponent}</>;
}
