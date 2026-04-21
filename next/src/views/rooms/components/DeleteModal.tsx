import { RoomListRow } from "@/types/rooms/rooms-list";
import { useConfirmDialogFixed } from "@/hooks/useConfirmDialogFixed";
import { useRoomActions } from "@/providers/rooms/RoomActions";
import { useEffect } from "react";

export function useDeleteModalRoom(detail: RoomListRow) {
  const { deleteState, submitDeleteById, isDeletePending } = useRoomActions();
  const {
    confirm: confirmDelete,
    DialogComponent,
    closeDialog,
    setIsLoading,
  } = useConfirmDialogFixed({
    message: () => (
      <p className="text-sm text-default-600">
        Ruangan <span className="font-semibold">{detail.roomCode}</span> akan
        dihapus permanen.
      </p>
    ),
    onConfirm: () => {
      setIsLoading(true);
      const formData = new FormData();
      formData.set("id", String(detail.id));
      submitDeleteById(formData);
      return false;
    },
  });

  useEffect(() => {
    setIsLoading(false);

    if (deleteState.success === true) {
      closeDialog(true);
    }
  }, [closeDialog, deleteState.success, setIsLoading]);

  const openDeleteModal = async () => {
    setIsLoading(false);

    await confirmDelete({
      title: `Hapus ${detail.roomCode}`,
      confirmText: "Hapus",
      cancelText: "Batal",
      disabled: isDeletePending,
      variant: "danger",
    });
  };

  return { openDeleteModal, DialogComponent };
}
