"use client";

import { Search20Regular } from "@fluentui/react-icons";
import { Input, Select, SelectItem } from "@heroui/react";
import { useMemo, useRef } from "react";
import { useRoomList } from "@/views/providers/rooms/RoomListProvider";
import { RoomCreateDialog } from "./components/CreateModal";

export function RoomFilter() {
  const { filters, floors, updateFilters } = useRoomList();
  const searchDebounceRef = useRef<number | null>(null);

  const floorItems = useMemo(
    () => [
      { key: "all", label: "Semua" },
      ...floors.map((floor) => ({
        key: String(floor),
        label: `Lantai ${floor}`,
      })),
    ],
    [floors],
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
          label="Lantai"
          className="w-48 rounded-lg bg-background/30"
          size="sm"
          selectedKeys={[filters.floor]}
          onChange={(event) =>
            updateFilters({ floor: event.target.value, page: "1" })
          }
          items={floorItems}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
        <RoomCreateDialog />
      </div>
    </div>
  );
}
