"use client";

import { RoomDetailData } from "@/types/rooms/rooms-detail";
import { createContext, ReactNode, useContext } from "react";

interface RoomDetailContextValue {
  detail: RoomDetailData;
}

const RoomDetailContext = createContext<RoomDetailContextValue | null>(null);

interface Props {
  detail: RoomDetailData;
  children: ReactNode;
}

export function RoomDetailProvider({ detail, children }: Props) {
  return (
    <RoomDetailContext.Provider value={{ detail }}>
      {children}
    </RoomDetailContext.Provider>
  );
}

export function useRoomDetail() {
  const context = useContext(RoomDetailContext);

  if (!context) {
    throw new Error("useRoomDetail must be used within RoomDetailProvider");
  }

  return context;
}
