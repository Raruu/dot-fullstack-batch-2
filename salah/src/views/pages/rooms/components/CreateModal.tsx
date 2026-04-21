"use client";

import { Button, Input, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { Add20Filled } from "@fluentui/react-icons";
import { useConfirmDialogFixed } from "@/views/hooks/useConfirmDialogFixed";
import { useRoomActions } from "@/views/providers/rooms/RoomActions";

function useCreateModalRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [level, setLevel] = useState("1");
  const { createState, submitCreate, isCreatePending } = useRoomActions();
  const [isSuccess, setIsSuccess] = useState(false);

  const { confirm, DialogComponent, closeDialog, setIsLoading } =
    useConfirmDialogFixed({
      message: () => (
        <div className="w-full space-y-3">
          <Input
            label="Kode Ruangan"
            value={roomCode}
            onValueChange={setRoomCode}
            isRequired
            isInvalid={!!createState.errors?.roomCode}
            errorMessage={createState.errors?.roomCode?.join(", ")}
          />
          <Input
            label="Nama Ruangan"
            value={roomName}
            onValueChange={setRoomName}
            isRequired
            isInvalid={!!createState.errors?.roomName}
            errorMessage={createState.errors?.roomName?.join(", ")}
          />
          <Input
            type="number"
            label="Lantai"
            value={level}
            onValueChange={setLevel}
            min={1}
            isRequired
            isInvalid={!!createState.errors?.level}
            errorMessage={createState.errors?.level?.join(", ")}
          />
        </div>
      ),
      onConfirm: () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.set("roomCode", roomCode);
        formData.set("roomName", roomName);
        formData.set("level", level);
        submitCreate(formData);
        return false;
      },
    });

  useEffect(() => {
    (() => setIsSuccess(createState.success ?? false))();
  }, [createState, setIsSuccess]);

  useEffect(() => {
    setIsLoading(false);
    if (isSuccess && roomCode && roomName) {
      const resetCreateFields = () => {
        setRoomCode("");
        setRoomName("");
        setLevel("1");
      };

      closeDialog(true);
      resetCreateFields();
    }
  }, [
    closeDialog,
    createState,
    createState,
    roomCode,
    roomName,
    isSuccess,
    setIsLoading,
  ]);

  const openCreateModal = async () => {
    setIsLoading(false);
    setIsSuccess(false);
    await confirm({
      title: "Tambah Ruangan",
      confirmText: "Simpan",
      cancelText: "Batal",
      disabled: isCreatePending,
    });
  };

  return {
    openCreateModal,
    DialogComponent,
  };
}

export const RoomCreateDialog = () => {
  const { openCreateModal, DialogComponent: CreateDialogComponent } =
    useCreateModalRoom();

  return (
    <>
      {CreateDialogComponent}
      <Tooltip content="Tambah Ruangan" color="primary">
        <Button size="lg" color="primary" isIconOnly onPress={openCreateModal}>
          <Add20Filled />
        </Button>
      </Tooltip>
    </>
  );
};
