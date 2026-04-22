"use client";

import { UseConfirmDialogOptions } from "@/types/dialog";
import {
  CreateRoomState,
  DeleteRoomState,
  UpdateRoomState,
} from "@/types/rooms/rooms-actions";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { fetcherJson } from "@/libs/fetch";

interface Context {
  confirm: (opts: UseConfirmDialogOptions) => Promise<boolean>;
  DialogComponent: ReactNode;
  isCreatePending: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  createState: CreateRoomState;
  updateState: UpdateRoomState;
  deleteState: DeleteRoomState;
  submitCreate: (payload: FormData) => Promise<void>;
  submitUpdateById: (payload: FormData) => Promise<void>;
  submitDeleteById: (payload: FormData) => Promise<void>;
}

const Context = createContext<Context | null>(null);

interface Props {
  children: ReactNode;
  apiUrl: string;
}

export function RoomActionsProvider({ children, apiUrl }: Props) {
  const targetUrl = `${apiUrl}/api/actions/rooms`;
  const router = useRouter();
  const { confirm, DialogComponent } = useConfirmDialog();

  const [isCreatePending, setIsCreatePending] = useState(false);
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);

  const [createState, setCreateState] = useState<CreateRoomState>({});
  const [updateState, setUpdateState] = useState<UpdateRoomState>({});
  const [deleteState, setDeleteState] = useState<DeleteRoomState>({});

  const submitCreate = useCallback(
    async (formData: FormData) => {
      setIsCreatePending(true);
      try {
        const res = await fetcherJson(targetUrl, "POST", formData);
        const data: CreateRoomState = await res.json();
        setCreateState(data);
      } catch (e) {
        console.log(e);
        setCreateState({
          success: false,
          message: "Gagal mengirim permintaan",
        });
      } finally {
        setIsCreatePending(false);
      }
    },
    [targetUrl],
  );

  const submitUpdateById = useCallback(
    async (formData: FormData) => {
      setIsUpdatePending(true);
      try {
        const res = await fetcherJson(targetUrl, "PUT", formData);
        const data: UpdateRoomState = await res.json();
        setUpdateState(data);
      } catch {
        setUpdateState({
          success: false,
          message: "Gagal mengirim permintaan",
        });
      } finally {
        setIsUpdatePending(false);
      }
    },
    [targetUrl],
  );

  const submitDeleteById = useCallback(
    async (formData: FormData) => {
      setIsDeletePending(true);
      try {
        const res = await fetcherJson(targetUrl, "DELETE", formData);
        const data: DeleteRoomState = await res.json();
        setDeleteState(data);
      } catch {
        setDeleteState({
          success: false,
          message: "Gagal mengirim permintaan",
        });
      } finally {
        setIsDeletePending(false);
      }
    },
    [targetUrl],
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
