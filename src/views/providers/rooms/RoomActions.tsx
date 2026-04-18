"use client";

import { UseConfirmDialogOptions } from "@/types/dialog";
import { CreateRoomAction, CreateRoomState } from "@/types/rooms/rooms-actions";
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
  createState: CreateRoomState;
  submitCreate: (payload: FormData) => void;
}

const Context = createContext<Context | null>(null);

interface Props {
  children: ReactNode;
  createClassAction: CreateRoomAction;
}

export function RoomActionsProvider({ children, createClassAction }: Props) {
  const router = useRouter();
  const { confirm, DialogComponent } = useConfirmDialog();
  const [createState, dispatchCreate, isCreatePending] = useActionState(
    createClassAction,
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

  const data = useMemo(
    () => ({
      confirm,
      DialogComponent,
      createState,
      submitCreate,
      isCreatePending,
    }),
    [confirm, DialogComponent, createState, submitCreate, isCreatePending],
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
