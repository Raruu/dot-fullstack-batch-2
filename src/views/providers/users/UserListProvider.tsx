"use client";

import { UserListData, UserListFilters } from "@/types/users/users-list";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface UserListContextValue {
  rows: UserListData["rows"];
  filters: UserListFilters;
  paginationState: UserListData["pagination"];
  isPaginationPending: boolean;
  changePage: (nextPage: number) => void;
  changePageSize: (nextSize: number) => void;
  updateFilters: (updates: Record<string, string | null>) => void;
}

const UserListContext = createContext<UserListContextValue | null>(null);

interface Props {
  data: UserListData;
  children: ReactNode;
}

export function UserListProvider({ data, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPaginationPending, startPaginationTransition] = useTransition();

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

  const value = useMemo<UserListContextValue>(
    () => ({
      rows: data.rows,
      filters: data.filters,
      paginationState: data.pagination,
      isPaginationPending,
      changePage,
      changePageSize,
      updateFilters,
    }),
    [
      changePage,
      changePageSize,
      data.filters,
      data.pagination,
      data.rows,
      isPaginationPending,
      updateFilters,
    ],
  );

  return (
    <UserListContext.Provider value={value}>
      {children}
    </UserListContext.Provider>
  );
}

export function useUserList() {
  const context = useContext(UserListContext);

  if (!context) {
    throw new Error("useUserList must be used within UserListProvider");
  }

  return context;
}
