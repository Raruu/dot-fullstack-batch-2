"use client";

import {
  Button,
  Card,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { useMemo } from "react";
import { RoomFilter } from "./RoomFilter";
import { useRoomList } from "@/providers/rooms/RoomListProvider";
import { useRoomActions } from "@/providers/rooms/RoomActions";
import { Eye20Regular, Pen20Regular } from "@fluentui/react-icons";
import Link from "next/link";
import { useEditModalRoom } from "./components/EditModal";

export function RoomTable() {
  const {
    rows,
    paginationState,
    isPaginationPending,
    changePage,
    changePageSize,
  } = useRoomList();

  const { DialogComponent } = useRoomActions();
  const { openEditModal, DialogComponent: EditModal } = useEditModalRoom();

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500"],
      td: [
        "first:group-data-[first=true]/tr:before:rounded-none",
        "last:group-data-[first=true]/tr:before:rounded-none",
        "group-data-[middle=true]/tr:before:rounded-none",
        "first:group-data-[last=true]/tr:before:rounded-none",
        "last:group-data-[last=true]/tr:before:rounded-none",
      ],
    }),
    [],
  );

  const pageSizeItems = useMemo(
    () =>
      [1, 5, 10, 25, 50, 100].map((size) => ({
        key: String(size),
        label: String(size),
      })),
    [],
  );

  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full items-center justify-between gap-4 py-2">
        <Select
          label="Tampilkan"
          className="w-36"
          size="sm"
          selectedKeys={[String(paginationState.pageSize)]}
          onChange={(event) => changePageSize(Number(event.target.value))}
          isDisabled={isPaginationPending}
          items={pageSizeItems}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>

        <Pagination
          page={paginationState.page}
          total={paginationState.totalPages}
          onChange={changePage}
          showControls
          isCompact
          showShadow
          isDisabled={isPaginationPending}
        />
      </div>
    );
  }, [
    changePage,
    changePageSize,
    isPaginationPending,
    pageSizeItems,
    paginationState.page,
    paginationState.pageSize,
    paginationState.totalPages,
  ]);

  return (
    <Card className="bg-background/30 px-6 py-4 flex flex-col gap-4">
      {DialogComponent}
      {EditModal}
      <RoomFilter />

      <Table
        classNames={classNames}
        removeWrapper
        bottomContent={bottomContent}
      >
        <TableHeader>
          <TableColumn width="20%">KODE</TableColumn>
          <TableColumn>NAMA</TableColumn>
          <TableColumn width="10%">Lantai</TableColumn>
          <TableColumn width="5%">AKSI</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent="Data tidak ditemukan."
          isLoading={isPaginationPending}
          loadingContent={<Spinner />}
        >
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.roomCode}</TableCell>
              <TableCell>{row.roomName}</TableCell>
              <TableCell>{row.level}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Tooltip
                    content="Lihat"
                    color="primary"
                    showArrow
                    placement="left"
                  >
                    <Button
                      as={Link}
                      href={`/app/rooms/${row.id}`}
                      size="sm"
                      variant="light"
                      color="primary"
                      isIconOnly
                    >
                      <Eye20Regular />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Edit"
                    color="default"
                    placement="right"
                    showArrow
                  >
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onPress={() => openEditModal(row)}
                    >
                      <Pen20Regular />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
