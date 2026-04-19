"use client";

import {
  UpdateScheduleState,
  CreateScheduleState,
  DeleteScheduleState,
} from "@/types/schedules/schedules-actions";
import {
  createContext,
  type ReactNode,
  startTransition,
  useActionState,
  useCallback,
  useContext,
  useMemo,
} from "react";

type UpdateScheduleAction = (
  prevState: UpdateScheduleState,
  formData: FormData,
) => Promise<UpdateScheduleState>;

type CreateScheduleAction = (
  prevState: CreateScheduleState,
  formData: FormData,
) => Promise<CreateScheduleState>;

type DeleteScheduleAction = (
  prevState: DeleteScheduleState,
  formData: FormData,
) => Promise<DeleteScheduleState>;

interface ScheduleActionsContext {
  createState: CreateScheduleState;
  updateState: UpdateScheduleState;
  deleteState: DeleteScheduleState;
  isCreatePending: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  submitCreateSchedule: (formData: FormData) => void;
  submitUpdateSchedule: (formData: FormData) => void;
  submitDeleteSchedule: (formData: FormData) => void;
}

const Context = createContext<ScheduleActionsContext | null>(null);

interface Props {
  children: ReactNode;
  createScheduleAction: CreateScheduleAction;
  updateScheduleAction: UpdateScheduleAction;
  deleteScheduleAction: DeleteScheduleAction;
}

export function ScheduleActionsProvider({
  children,
  createScheduleAction,
  updateScheduleAction,
  deleteScheduleAction,
}: Props) {
  const [createState, dispatchCreate, isCreatePending] = useActionState(
    createScheduleAction,
    {},
  );
  const [updateState, dispatchUpdate, isUpdatePending] = useActionState(
    updateScheduleAction,
    {},
  );
  const [deleteState, dispatchDelete, isDeletePending] = useActionState(
    deleteScheduleAction,
    {},
  );

  const submitCreateSchedule = useCallback(
    (formData: FormData) => {
      startTransition(() => {
        dispatchCreate(formData);
      });
    },
    [dispatchCreate],
  );

  const submitUpdateSchedule = useCallback(
    (formData: FormData) => {
      startTransition(() => {
        dispatchUpdate(formData);
      });
    },
    [dispatchUpdate],
  );

  const submitDeleteSchedule = useCallback(
    (formData: FormData) => {
      startTransition(() => {
        dispatchDelete(formData);
      });
    },
    [dispatchDelete],
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
