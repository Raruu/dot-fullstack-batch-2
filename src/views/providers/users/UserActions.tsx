"use client";

import { UseConfirmDialogOptions } from "@/types/dialog";
import {
  CreateUserAction,
  CreateUserState,
  DeleteUserAction,
  DeleteUserState,
  UpdateUserAction,
  UpdateUserState,
} from "@/types/users/users-actions";
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
  useRef,
} from "react";
import { useAuthClient } from "../useAuthCient";

interface Context {
  confirm: (opts: UseConfirmDialogOptions) => Promise<boolean>;
  DialogComponent: ReactNode;
  isCreatePending: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  createState: CreateUserState;
  updateState: UpdateUserState;
  deleteState: DeleteUserState;
  submitCreate: (payload: FormData) => void;
  submitUpdateById: (payload: FormData) => void;
  submitDeleteById: (payload: FormData) => void;
}

const Context = createContext<Context | null>(null);

interface Props {
  children: ReactNode;
  createUserAction: CreateUserAction;
  updateUserAction: UpdateUserAction;
  deleteUserAction: DeleteUserAction;
}

export function UserActionsProvider({
  children,
  createUserAction,
  updateUserAction,
  deleteUserAction,
}: Props) {
  const router = useRouter();
  const { confirm, DialogComponent } = useConfirmDialog();
  const [createState, dispatchCreate, isCreatePending] = useActionState(
    createUserAction!,
    {},
  );
  const [updateState, dispatchUpdate, isUpdatePending] = useActionState(
    updateUserAction!,
    {},
  );
  const [deleteState, dispatchDelete, isDeletePending] = useActionState(
    deleteUserAction!,
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
    async (
      success: boolean,
      message?: string,
      pushPath?: string | (() => void),
    ) => {
      await confirm({
        title: success ? "Berhasil" : "Gagal",
        message: message ?? (success ? "Operasi berhasil" : "Operasi gagal"),
        variant: success ? "success" : "danger",
        noCancle: true,
        confirmText: "Oke",
      });

      if (success) {
        if (pushPath && typeof pushPath === "string") {
          router.push(pushPath);
          return;
        } else if (pushPath && typeof pushPath === "function") {
          pushPath();
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

    showSuccess(createState.success, createState.message);
  }, [
    createState,
    createState.createdId,
    createState.message,
    createState.success,
    showSuccess,
  ]);

  const { useSession } = useAuthClient();
  const user = useSession().data?.user;
  const userRef = useRef(user);

  useEffect(() => {
    if (typeof updateState.success !== "boolean") {
      return;
    }

    showSuccess(updateState.success, updateState.message, () => {
      if (userRef.current) {
        if (
          updateState.success &&
          updateState.updatedId === userRef.current.id
        ) {
          window.location.reload();
        }
      }
    });
  }, [showSuccess, updateState]);

  useEffect(() => {
    if (typeof deleteState.success !== "boolean") {
      return;
    }

    showSuccess(deleteState.success, deleteState.message, "/app/user");
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

export function useUserActions() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useUserActions must be used within UserActionsProvider");
  }

  return context;
}
