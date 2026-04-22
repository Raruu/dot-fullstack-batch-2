"use client";

import { fetcherJson } from "@/libs/fetch";
import {
  UpdateScheduleState,
  CreateScheduleState,
  DeleteScheduleState,
} from "@/types/schedules/schedules-actions";
import {
  createContext,
  type ReactNode,
  useState,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useRoomDetail } from "../rooms/RoomDetailProvider";

interface ScheduleActionsContext {
  createState: CreateScheduleState;
  updateState: UpdateScheduleState;
  deleteState: DeleteScheduleState;
  isCreatePending: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  submitCreateSchedule: (formData: FormData) => Promise<void>;
  submitUpdateSchedule: (formData: FormData) => Promise<void>;
  submitDeleteSchedule: (formData: FormData) => Promise<void>;
}

const Context = createContext<ScheduleActionsContext | null>(null);

interface Props {
  children: ReactNode;
  apiUrl: string;
}

export function ScheduleActionsProvider({ children, apiUrl }: Props) {
  const targetUrl = `${apiUrl}/api/actions/schedule`;

  const { mutate } = useRoomDetail();

  const [isCreatePending, setIsCreatePending] = useState(false);
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);

  const [createState, setCreateState] = useState<CreateScheduleState>({});
  const [updateState, setUpdateState] = useState<UpdateScheduleState>({});
  const [deleteState, setDeleteState] = useState<DeleteScheduleState>({});

  const submitCreateSchedule = useCallback(
    async (formData: FormData) => {
      setIsCreatePending(true);
      try {
        const res = await fetcherJson(targetUrl, "POST", formData);
        const data: CreateScheduleState = await res.json();
        setCreateState(data);
      } catch {
        setCreateState({
          success: false,
          message: "Gagal mengirim permintaan",
        });
      } finally {
        mutate();
        setIsCreatePending(false);
      }
    },
    [mutate, targetUrl],
  );

  const submitUpdateSchedule = useCallback(
    async (formData: FormData) => {
      setIsUpdatePending(true);
      try {
        const res = await fetcherJson(targetUrl, "PUT", formData);
        const data: UpdateScheduleState = await res.json();
        setUpdateState(data);
      } catch {
        setUpdateState({
          success: false,
          message: "Gagal mengirim permintaan",
        });
      } finally {
        mutate();
        setIsUpdatePending(false);
      }
    },
    [mutate, targetUrl],
  );

  const submitDeleteSchedule = useCallback(
    async (formData: FormData) => {
      setIsDeletePending(true);
      try {
        const res = await fetcherJson(targetUrl, "DELETE", formData);
        const data: DeleteScheduleState = await res.json();
        setDeleteState(data);
      } catch {
        setDeleteState({
          success: false,
          message: "Gagal mengirim permintaan",
        });
      } finally {
        mutate();
        setIsDeletePending(false);
      }
    },
    [mutate, targetUrl],
  );

  const value = useMemo(
    () => ({
      createState,
      updateState,
      deleteState,
      isCreatePending,
      isUpdatePending,
      isDeletePending,
      submitCreateSchedule,
      submitUpdateSchedule,
      submitDeleteSchedule,
    }),
    [
      createState,
      deleteState,
      isCreatePending,
      isDeletePending,
      isUpdatePending,
      submitCreateSchedule,
      submitDeleteSchedule,
      submitUpdateSchedule,
      updateState,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useScheduleActions() {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      "useScheduleActions must be used within ScheduleActionsProvider",
    );
  }

  return context;
}
