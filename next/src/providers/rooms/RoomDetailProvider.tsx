"use client";

import { swrFetcher } from "@/libs/fetch";
import { RoomDetailData } from "@/types/rooms/rooms-detail";
import { createContext, ReactNode, useContext, useMemo } from "react";
import useSWR, { KeyedMutator } from "swr";
import { LoadingScreen } from "../../components/ui/LoadingScreen";

interface RoomDetailContextValue {
  detail: RoomDetailData;
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<RoomDetailData>;
}

const RoomDetailContext = createContext<RoomDetailContextValue | null>(null);

interface Props {
  roomId: number;
  children: ReactNode;
  apiUrl: string;
}

export function RoomDetailProvider({ roomId, children, apiUrl }: Props) {
  const targetUrl = `${apiUrl}/api/queries/rooms`;

  const { data, isLoading, error, mutate } = useSWR<RoomDetailData>(
    `${targetUrl}/${roomId}`,
    swrFetcher,
  );

  const contextVal = useMemo<RoomDetailContextValue>(
    () => ({ detail: data!, isLoading, isError: !!error, mutate }),
    [data, error, isLoading, mutate],
  );

  if (isLoading) {
    return (
      <LoadingScreen
        title="Memuat detail ruangan"
        description="Informasi ruangan sedang diambil."
      />
    );
  }

  const dataAsMessage = data as unknown as { message: string };

  if (dataAsMessage?.message) {
    window.location.replace("/app/rooms");
    return <></>;
  }
  return (
    <RoomDetailContext.Provider value={contextVal}>
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
