"use client";

import { Search20Regular } from "@fluentui/react-icons";
import { Input, Select, SelectItem } from "@heroui/react";
import { useMemo, useRef } from "react";
import { useUserList } from "@/views/providers/users/UserListProvider";
import { UserCreateDialog } from "./components/CreateModal";

export function UserFilter() {
  const { filters, updateFilters } = useUserList();
  const searchDebounceRef = useRef<number | null>(null);

  const statusItems = useMemo(
    () => [
      { key: "all", label: "Semua" },
      { key: "verified", label: "Terverifikasi" },
      { key: "unverified", label: "Belum Terverifikasi" },
    ],
    [],
  );

  const onSearchChange = (nextValue: string) => {
    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = window.setTimeout(() => {
      updateFilters({ search: nextValue.trim() || null, page: "1" });
    }, 500);
  };

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <Input
        autoFocus
        isClearable
        className="max-w-72 rounded-lg bg-background/30"
        label={
          <div className="flex flex-row items-center gap-2">
            <Search20Regular className="h-4 w-4 text-default-400" /> Cari
          </div>
        }
        size="sm"
        key={filters.search}
        defaultValue={filters.search}
        onValueChange={onSearchChange}
      />

      <div className="flex flex-row items-center gap-2">
        <Select
          label="Status"
          className="w-52 rounded-lg bg-background/30"
          size="sm"
          selectedKeys={[filters.status]}
          onChange={(event) =>
            updateFilters({ status: event.target.value, page: "1" })
          }
          items={statusItems}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
        <UserCreateDialog />
      </div>
    </div>
  );
}
