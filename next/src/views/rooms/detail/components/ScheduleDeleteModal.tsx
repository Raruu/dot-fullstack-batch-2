"use client";

import { useEffect, useState } from "react";
import { useConfirmDialogFixed } from "@/hooks/useConfirmDialogFixed";
import { useRoomDetail } from "@/providers/rooms/RoomDetailProvider";
import { useScheduleActions } from "@/providers/schedule/ScheduleActions";

type ScheduleRow = {
  id: number;
  subject: string;
};

export function useScheduleDeleteModal() {
  const { detail } = useRoomDetail();
  const [target, setTarget] = useState<ScheduleRow | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { deleteState, isDeletePending, submitDeleteSchedule } =
    useScheduleActions();

  const { confirm, DialogComponent, closeDialog, setIsLoading } =
    useConfirmDialogFixed({
      message: () => (
        <p className="text-sm text-default-600">
          Agenda <span className="font-semibold">{target?.subject ?? ""}</span>{" "}
          akan dihapus permanen.
        </p>
      ),
      onConfirm: () => {
        if (!target) {
          return false;
        }

        setIsLoading(true);
        const formData = new FormData();

        formData.set("id", String(target.id));
        formData.set("roomId", String(detail.id));
        submitDeleteSchedule(formData);

        return false;
      },
    });

  useEffect(() => {
    (() => setIsSuccess(deleteState.success ?? false))();
  }, [deleteState]);

  useEffect(() => {
    setIsLoading(isDeletePending);
  }, [isDeletePending, setIsLoading]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    (() => {
      closeDialog(true);
      setTarget(null);
      setIsSuccess(false);
    })();
  }, [closeDialog, isSuccess]);

  const openDeleteModal = async (item: ScheduleRow) => {
    setTarget(item);
    setIsSuccess(false);
    setIsLoading(false);

    await confirm({
      title: `Hapus Jadwal ${item.subject}`,
      confirmText: "Hapus",
      cancelText: "Batal",
      disabled: isDeletePending,
      variant: "danger",
    });
  };

  return {
    DialogComponent,
    openDeleteModal,
  };
}
