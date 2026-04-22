"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { RoomListData, RoomListFilters } from "@/types/rooms/rooms-list";
import { swrFetcher } from "@/libs/fetch";

interface RoomListContextValue {
  rows: RoomListData["rows"];
  floors: number[];
  filters: RoomListFilters;
  paginationState: RoomListData["pagination"];
  isPaginationPending: boolean;
  isLoading: boolean;
  isError: boolean;
  changePage: (nextPage: number) => void;
  changePageSize: (nextSize: number) => void;
  updateFilters: (updates: Record<string, string | null>) => void;
}

const RoomListContext = createContext<RoomListContextValue | null>(null);

interface Props {
  children: ReactNode;
  apiUrl: string;
}

export function RoomListProvider({ children, apiUrl }: Props) {
  const targetUrl = `${apiUrl}/api/queries/rooms`;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPaginationPending, startPaginationTransition] = useTransition();

  const queryString = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return params.toString();
  }, [searchParams]);

  const { data, isLoading, error } = useSWR<RoomListData>(
    `${targetUrl}${queryString ? `?${queryString}` : ""}`,
    swrFetcher,
  );

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all") {
          nextParams.delete(key);
          return;
        }

        nextParams.set(key, value);
      });

      const query = nextParams.toString();

      startPaginationTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname);
      });
    },
    [pathname, router, searchParams],
  );

  const changePage = useCallback(
    (nextPage: number) => {
      updateFilters({ page: String(nextPage) });
    },
    [updateFilters],
  );

  const changePageSize = useCallback(
    (nextSize: number) => {
      updateFilters({ pageSize: String(nextSize), page: "1" });
    },
    [updateFilters],
  );

  const value = useMemo<RoomListContextValue>(
    () => ({
      rows: data?.rows ?? [],
      floors: data?.floors ?? [],
      filters: data?.filters ?? { floor: "all", search: "" },
      paginationState: data?.pagination ?? {
        page: 1,
        pageSize: 10,
        totalPages: 1,
        totalCount: 0,
      },
      isPaginationPending,
      isLoading,
      isError: !!error,
      changePage,
      changePageSize,
      updateFilters,
    }),
    [
      changePage,
      changePageSize,
      data?.filters,
      data?.floors,
      data?.pagination,
      data?.rows,
      isPaginationPending,
      isLoading,
      error,
      updateFilters,
    ],
  );

  return (
    <RoomListContext.Provider value={value}>
      {children}
    </RoomListContext.Provider>
  );
}

export function useRoomList() {
  const context = useContext(RoomListContext);

  if (!context) {
    throw new Error("useRoomList must be used within RoomListProvider");
  }

  return context;
}
