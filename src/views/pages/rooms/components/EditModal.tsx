"use client";

import { Input } from "@heroui/react";
import { useEffect, useState } from "react";

import { useConfirmDialogFixed } from "@/views/hooks/useConfirmDialogFixed";
import { useRoomActions } from "@/views/providers/rooms/RoomActions";
import { RoomListRow } from "@/types/rooms/rooms-list";

export function useEditModalRoom() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [level, setLevel] = useState("1");

  const { updateState, submitUpdateById, isUpdatePending } = useRoomActions();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    (() => {
      setIsSuccess(updateState.success ?? false);
    })();
  }, [updateState]);

  const { confirm, DialogComponent, closeDialog, setIsLoading } =
    useConfirmDialogFixed({
      message: () => (
        <div className="w-full space-y-3">
          <Input
            label="Kode Ruangan"
            value={roomCode}
            onValueChange={setRoomCode}
            isRequired
            isInvalid={!!updateState.errors?.roomCode}
            errorMessage={updateState.errors?.roomCode?.join(", ")}
          />
          <Input
            label="Nama Ruangan"
            value={roomName}
            onValueChange={setRoomName}
            isRequired
            isInvalid={!!updateState.errors?.roomName}
            errorMessage={updateState.errors?.roomName?.join(", ")}
          />
          <Input
            type="number"
            label="Lantai"
            value={level}
            onValueChange={setLevel}
            min={1}
            isRequired
            isInvalid={!!updateState.errors?.level}
            errorMessage={updateState.errors?.level?.join(", ")}
          />
        </div>
      ),
      onConfirm: () => {
        if (editingId === null) {
          return false;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.set("id", String(editingId));
        formData.set("roomCode", roomCode);
        formData.set("roomName", roomName);
        formData.set("level", level);
        submitUpdateById(formData);
        return false;
      },
    });

  useEffect(() => {
    setIsLoading(false);

    if (isSuccess && editingId !== null) {
      (() => {
        closeDialog(true);
        setEditingId(null);
        setIsSuccess(false);
      })();
    }
  }, [closeDialog, editingId, setIsLoading, isSuccess]);

  const openEditModal = async (row: RoomListRow) => {
    setEditingId(row.id);
    setRoomCode(row.roomCode);
    setRoomName(row.roomName);
    setLevel(String(row.level));
    setIsSuccess(false);
    setIsLoading(false);

    await confirm({
      title: `Edit ${row.roomCode}`,
      confirmText: "Simpan",
      cancelText: "Batal",
      disabled: isUpdatePending,
    });
  };

  return {
    openEditModal,
    DialogComponent,
  };
}
