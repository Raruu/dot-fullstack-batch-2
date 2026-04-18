"use client";

import {
  Avatar,
  Button,
  Card,
  Chip,
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
import { UserFilter } from "./UserFilter";
import { useUserList } from "@/views/providers/users/UserListProvider";
import { useUserActions } from "@/views/providers/users/UserActions";
import { Delete20Regular, Pen20Regular } from "@fluentui/react-icons";
import { useEditModalUser } from "./components/EditModal";
import { useDeleteModalUser } from "./components/DeleteModal";

export function UserTable() {
  const {
    rows,
    paginationState,
    isPaginationPending,
    changePage,
    changePageSize,
  } = useUserList();

  const { DialogComponent } = useUserActions();
  const { openEditModal, DialogComponent: EditModal } = useEditModalUser();
  const { openDeleteModal, DialogComponent: DeleteModal } =
    useDeleteModalUser();

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-5xl"],
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
      [5, 10, 25, 50, 100].map((size) => ({
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
      {DeleteModal}
      <UserFilter />

      <Table
        classNames={classNames}
        removeWrapper
        bottomContent={bottomContent}
      >
        <TableHeader>
          <TableColumn width="1%"> </TableColumn>
          <TableColumn>NAMA</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn width="15%">STATUS</TableColumn>
          <TableColumn width="15%">AKSI</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent="Data tidak ditemukan."
          isLoading={isPaginationPending}
          loadingContent={<Spinner />}
        >
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Avatar src={row.image ?? ""} />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <Chip
                  color={row.emailVerified ? "success" : "warning"}
                  size="sm"
                  variant="flat"
                >
                  {row.emailVerified ? "Terverifikasi" : "Belum"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Tooltip
                    content="Edit"
                    color="default"
                    placement="left"
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
                  <Tooltip
                    content="Hapus"
                    color="danger"
                    placement="right"
                    showArrow
                  >
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onPress={() => openDeleteModal(row)}
                      color="danger"
                    >
                      <Delete20Regular />
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
