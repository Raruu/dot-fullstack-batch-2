"use client";

import { UseConfirmDialogOptions } from "@/types/dialog";
import {
  CreateRoomAction,
  CreateRoomState,
  DeleteRoomAction,
  DeleteRoomState,
  UpdateRoomAction,
  UpdateRoomState,
} from "@/types/rooms/rooms-actions";
import { useConfirmDialog } from "@/views/hooks/useConfirmDialog";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  startTransition,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

interface Context {
  confirm: (opts: UseConfirmDialogOptions) => Promise<boolean>;
  DialogComponent: ReactNode;
  isCreatePending: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  createState: CreateRoomState;
  updateState: UpdateRoomState;
  deleteState: DeleteRoomState;
  submitCreate: (payload: FormData) => void;
  submitUpdateById: (payload: FormData) => void;
  submitDeleteById: (payload: FormData) => void;
}

const Context = createContext<Context | null>(null);

interface Props {
  children: ReactNode;
  createClassAction?: CreateRoomAction;
  updateRoomAction?: UpdateRoomAction;
  deleteRoomAction?: DeleteRoomAction;
}

export function RoomActionsProvider({
  children,
  createClassAction,
  updateRoomAction,
  deleteRoomAction,
}: Props) {
  const router = useRouter();
  const { confirm, DialogComponent } = useConfirmDialog();
  const [createState, dispatchCreate, isCreatePending] = useActionState(
    createClassAction!,
    {},
  );
  const [updateState, dispatchUpdate, isUpdatePending] = useActionState(
    updateRoomAction!,
    {},
  );
  const [deleteState, dispatchDelete, isDeletePending] = useActionState(
    deleteRoomAction!,
    {},
  );

  const submitCreate = useCallback(
    (formData: FormData) => {
      startTransition(() => {
        dispatchCreate(formData);
      });
    },
    [dispatchCreate],
  );

  const submitUpdateById = useCallback(
    (formData: FormData) => {
      startTransition(() => {
        dispatchUpdate(formData);
      });
    },
    [dispatchUpdate],
  );

  const submitDeleteById = useCallback(
    (formData: FormData) => {
      startTransition(() => {
        dispatchDelete(formData);
      });
    },
    [dispatchDelete],
  );

  const showSuccess = useCallback(
    async (success: boolean, message?: string, pushPath?: string) => {
      await confirm({
        title: success ? "Berhasil" : "Gagal",
        message: message ?? (success ? "Operasi berhasil" : "Operasi gagal"),
        variant: success ? "success" : "danger",
        noCancle: true,
        confirmText: "Oke",
      });

      if (success) {
        if (pushPath) {
          router.push(pushPath);
          return;
        }
        router.refresh();
      }
    },
    [confirm, router],
  );

  useEffect(() => {
    if (typeof createState.success !== "boolean") {
      return;
    }

    showSuccess(
      createState.success,
      createState.message,
      createState.success && createState.createdId
        ? `/app/rooms/${createState.createdId}`
        : undefined,
    );
  }, [
    createState,
    createState.createdId,
    createState.message,
    createState.success,
    showSuccess,
  ]);

  useEffect(() => {
    if (typeof updateState.success !== "boolean") {
      return;
    }

    showSuccess(updateState.success, updateState.message);
  }, [showSuccess, updateState, updateState.message, updateState.success]);

  useEffect(() => {
    console.log(deleteState);
    if (typeof deleteState.success !== "boolean") {
      return;
    }

    showSuccess(deleteState.success, deleteState.message, "/app/rooms");
  }, [deleteState, deleteState.message, deleteState.success, showSuccess]);

  const data = useMemo(
    () => ({
      confirm,
      DialogComponent,
      createState,
      deleteState,
      updateState,
      submitCreate,
      submitDeleteById,
      submitUpdateById,
      isCreatePending,
      isDeletePending,
      isUpdatePending,
    }),
    [
      confirm,
      DialogComponent,
      createState,
      deleteState,
      isCreatePending,
      isDeletePending,
      isUpdatePending,
      submitCreate,
      submitDeleteById,
      submitUpdateById,
      updateState,
    ],
  );

  return <Context.Provider value={data}>{children}</Context.Provider>;
}

export function useRoomActions() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useRoomActions must be used within RoomActionsProvider");
  }

  return context;
}
