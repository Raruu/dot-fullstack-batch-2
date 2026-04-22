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
import useSWR, { KeyedMutator } from "swr";
import { swrFetcher } from "@/libs/fetch";
import { LoadingScreen } from "../../components/ui/LoadingScreen";

interface UserListContextValue {
  rows: UserListData["rows"];
  filters: UserListFilters;
  paginationState: UserListData["pagination"];
  isPaginationPending: boolean;
  isLoading: boolean;
  isError: boolean;
  changePage: (nextPage: number) => void;
  changePageSize: (nextSize: number) => void;
  updateFilters: (updates: Record<string, string | null>) => void;
  mutate: KeyedMutator<UserListData>;
}

const UserListContext = createContext<UserListContextValue | null>(null);

interface Props {
  children: ReactNode;
  apiUrl: string;
}

export function UserListProvider({ children, apiUrl }: Props) {
  const targetUrl = `${apiUrl}/api/queries/users`;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPaginationPending, startPaginationTransition] = useTransition();

  const queryString = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return params.toString();
  }, [searchParams]);

  const { data, isLoading, error, mutate } = useSWR<UserListData>(
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

  const value = useMemo<UserListContextValue>(
    () => ({
      rows: data?.rows ?? [],
      filters: data?.filters ?? { status: "all", search: "" },
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
      mutate,
    }),
    [
      data?.rows,
      data?.filters,
      data?.pagination,
      isPaginationPending,
      isLoading,
      error,
      changePage,
      changePageSize,
      updateFilters,
      mutate,
    ],
  );

  if (isLoading) {
    return (
      <LoadingScreen
        title="Memuat daftar user"
        description="Data user sedang disiapkan."
      />
    );
  }

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
