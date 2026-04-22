"use client";

import { swrFetcher } from "@/libs/fetch";
import { RoomDetailData } from "@/types/rooms/rooms-detail";
import { createContext, ReactNode, useContext } from "react";
import useSWR from "swr";

interface RoomDetailContextValue {
  detail: RoomDetailData | null;
  isLoading: boolean;
  isError: boolean;
}

const RoomDetailContext = createContext<RoomDetailContextValue | null>(null);

interface Props {
  roomId: number;
  children: ReactNode;
  apiUrl: string;
}

export function RoomDetailProvider({ roomId, children, apiUrl }: Props) {
  const targetUrl = `${apiUrl}/api/queries/rooms`;

  const { data, isLoading, error } = useSWR<RoomDetailData>(
    `${targetUrl}/${roomId}`,
    swrFetcher,
  );

  return (
    <RoomDetailContext.Provider
      value={{ detail: data ?? null, isLoading, isError: !!error }}
    >
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
