import { UserListRow } from "@/types/users/users-list";
import { useConfirmDialogFixed } from "@/hooks/useConfirmDialogFixed";
import { useUserActions } from "@/providers/users/UserActions";
import { useEffect, useState } from "react";

export function useDeleteModalUser() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [detail, setDetail] = useState<UserListRow>();
  const { deleteState, submitDeleteById, isDeletePending } = useUserActions();
  const {
    confirm: confirmDelete,
    DialogComponent,
    closeDialog,
    setIsLoading,
  } = useConfirmDialogFixed({
    message: () => (
      <p className="text-sm text-default-600">
        User <span className="font-semibold">{detail?.email || ""}</span> akan
        dihapus permanen.
      </p>
    ),
    onConfirm: () => {
      setIsLoading(true);
      const formData = new FormData();
      formData.set("id", detail?.id || "");
      submitDeleteById(formData);
      return false;
    },
  });

  useEffect(() => {
    (() => setIsSuccess(deleteState.success ?? false))();
  }, [deleteState]);

  useEffect(() => {
    setIsLoading(false);

    if (isSuccess === true) {
      closeDialog(true);
    }
  }, [closeDialog, deleteState, isSuccess, setIsLoading]);

  const openDeleteModal = async (detail: UserListRow) => {
    setDetail(detail);
    setIsLoading(false);
    setIsSuccess(false);

    await confirmDelete({
      title: `Hapus ${detail.name}`,
      confirmText: "Hapus",
      cancelText: "Batal",
      disabled: isDeletePending,
      variant: "danger",
    });
  };

  return { openDeleteModal, DialogComponent };
}
