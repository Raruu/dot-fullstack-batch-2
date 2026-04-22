"use client";

import { UseConfirmDialogOptions } from "@/types/dialog";
import {
  CreateUserState,
  DeleteUserState,
  UpdateUserState,
} from "@/types/users/users-actions";
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
  useRef,
} from "react";
import { useAuthClient } from "../useAuthCient";
import { fetcherJson } from "@/libs/fetch";
import { useUserList } from "./UserListProvider";

interface Context {
  confirm: (opts: UseConfirmDialogOptions) => Promise<boolean>;
  DialogComponent: ReactNode;
  isCreatePending: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  createState: CreateUserState;
  updateState: UpdateUserState;
  deleteState: DeleteUserState;
  submitCreate: (payload: FormData) => Promise<void>;
  submitUpdateById: (payload: FormData) => Promise<void>;
  submitDeleteById: (payload: FormData) => Promise<void>;
}

const Context = createContext<Context | null>(null);

interface Props {
  children: ReactNode;
  apiUrl: string;
}

export function UserActionsProvider({ children, apiUrl }: Props) {
  const targetUrl = `${apiUrl}/api/actions/users`;
  const router = useRouter();
  const { mutate } = useUserList();
  const { confirm, DialogComponent } = useConfirmDialog();

  const [isCreatePending, setIsCreatePending] = useState(false);
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);

  const [createState, setCreateState] = useState<CreateUserState>({});
  const [updateState, setUpdateState] = useState<UpdateUserState>({});
  const [deleteState, setDeleteState] = useState<DeleteUserState>({});

  const { useSession } = useAuthClient();
  const session = useSession().data;
  const userRef = useRef(session?.user);

  const submitCreate = useCallback(
    async (formData: FormData) => {
      setIsCreatePending(true);
      try {
        const res = await fetcherJson(targetUrl, "POST", formData);
        const data: CreateUserState = await res.json();
        setCreateState(data);
      } catch {
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
        const data: UpdateUserState = await res.json();
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
        const data: DeleteUserState = await res.json();
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
    async (
      success: boolean,
      message?: string,
      pushPath?: string | (() => void),
    ) => {
      mutate();
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
    [confirm, mutate, router],
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
