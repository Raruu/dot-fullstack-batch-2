"use client";

import { Button, cn, Input, Select, SelectItem, Slider } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { useRoomDetail } from "@/views/providers/rooms/RoomDetailProvider";
import { useConfirmDialogFixed } from "@/views/hooks/useConfirmDialogFixed";
import { useScheduleActions } from "@/views/providers/schedule/ScheduleActions";
import {
  DAY_ROWS,
  getAvailableSlotNumbersByDay,
  getNearestAvailableSlot,
  getSafeRangeForDay,
  MAX_SUBJECT_LENGTH,
  normalizeRange,
} from "./schedule-shared";
import { useScheduleDeleteModal } from "./ScheduleDeleteModal";
import { RoomScheduleDay } from "@/types/schedule";

type ScheduleRow = {
  id: number;
  subject: string;
  day: string;
  startSlotNumber: number;
  endSlotNumber: number;
};

export function useScheduleEditModal() {
  const { detail } = useRoomDetail();
  const { updateState, isUpdatePending, submitUpdateSchedule } =
    useScheduleActions();
  const { DialogComponent: DeleteModalComponent, openDeleteModal } =
    useScheduleDeleteModal();

  const minSlot = detail.timeslots[0]?.slotNumber ?? 1;
  const maxSlot = detail.timeslots.at(-1)?.slotNumber ?? 12;

  const [editingId, setEditingId] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState<RoomScheduleDay>("MONDAY");
  const [slotRange, setSlotRange] = useState<number[]>([
    minSlot,
    Math.min(minSlot + 1, maxSlot),
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  const [totalCharCount, setTotalCharCount] = useState(0);

  useEffect(() => {
    (() => setTotalCharCount(subject.length))();
  }, [subject]);

  const availableSlotNumbers = useMemo(
    () =>
      getAvailableSlotNumbersByDay({
        schedules: detail.schedules,
        timeslots: detail.timeslots,
        day,
        excludeScheduleId: editingId,
      }),
    [day, detail.schedules, detail.timeslots, editingId],
  );

  const sliderMarks = useMemo(
    () =>
      availableSlotNumbers.map((slotNumber) => ({
        value: slotNumber,
        label: String(slotNumber),
      })),
    [availableSlotNumbers],
  );

  const hasAvailableSlots = availableSlotNumbers.length > 0;
  const sliderMin = availableSlotNumbers[0] ?? minSlot;
  const sliderMax = availableSlotNumbers.at(-1) ?? maxSlot;

  const subjectOverloaded = totalCharCount > MAX_SUBJECT_LENGTH;

  const { confirm, DialogComponent, closeDialog, setIsLoading } =
    useConfirmDialogFixed({
      message: () => {
        const [start, end] = normalizeRange(slotRange);

        return (
          <div className="space-y-4">
            <Input
              label="Agenda"
              value={subject}
              onValueChange={setSubject}
              isRequired
              isInvalid={!!updateState.errors?.subject}
              errorMessage={updateState.errors?.subject?.join(", ")}
              endContent={
                <p
                  className={cn(
                    "w-16 text-sm flex items-center justify-center",
                    {
                      "text-danger": subjectOverloaded,
                    },
                  )}
                >{`${totalCharCount} / ${MAX_SUBJECT_LENGTH}`}</p>
              }
            />

            <Select
              label="Hari"
              selectedKeys={new Set([day])}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];

                if (selected) {
                  const nextDay = String(selected) as RoomScheduleDay;

                  setDay(nextDay);
                  setSlotRange((currentRange) =>
                    getSafeRangeForDay({
                      currentRange,
                      nextDay,
                      schedules: detail.schedules,
                      timeslots: detail.timeslots,
                      minSlot,
                      excludeScheduleId: editingId,
                    }),
                  );
                }
              }}
              isRequired
              isInvalid={!!updateState.errors?.day}
              errorMessage={updateState.errors?.day?.join(", ")}
              items={DAY_ROWS}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>

            <Slider
              label="Range Timeslot"
              minValue={sliderMin}
              maxValue={sliderMax}
              step={1}
              marks={sliderMarks}
              value={slotRange}
              isDisabled={!hasAvailableSlots}
              onChange={(value) => {
                if (Array.isArray(value)) {
                  setSlotRange(
                    value.map((item) =>
                      getNearestAvailableSlot(
                        Number(item),
                        availableSlotNumbers,
                      ),
                    ),
                  );
                }
              }}
            />

            <p className="text-small text-default-500">
              {hasAvailableSlots
                ? `Slot terpilih: ${start} - ${end}`
                : "Semua timeslot pada hari ini sudah terpakai."}
            </p>

            {updateState.errors?.slotNumbers?.length ? (
              <p className="text-small text-danger">
                {updateState.errors.slotNumbers.join(", ")}
              </p>
            ) : null}
          </div>
        );
      },
      thirdButton: () => (
        <Button
          variant="solid"
          color="danger"
          onPress={() => {
            closeDialog(true);
            return openDeleteModal({ id: editingId!, subject });
          }}
        >
          Hapus
        </Button>
      ),
      onConfirm: () => {
        if (!editingId) {
          return false;
        }

        setIsLoading(true);
        const [start, end] = normalizeRange(slotRange);
        const formData = new FormData();

        formData.set("id", String(editingId));
        formData.set("roomId", String(detail.id));
        formData.set("subject", subject);
        formData.set("day", day);
        formData.append("slotNumbers", String(start));
        formData.append("slotNumbers", String(end));
        submitUpdateSchedule(formData);

        return false;
      },
    });

  useEffect(() => {
    (() => setIsSuccess(updateState.success ?? false))();
  }, [updateState]);

  useEffect(() => {
    setIsLoading(isUpdatePending);
  }, [isUpdatePending, setIsLoading]);

  useEffect(() => {
    if (!isSuccess || !editingId) {
      return;
    }

    (() => {
      closeDialog(true);
      setEditingId(null);
      setIsSuccess(false);
    })();
  }, [closeDialog, editingId, isSuccess]);

  const openEditModal = async (item: ScheduleRow) => {
    setEditingId(item.id);
    setSubject(item.subject);
    setDay(item.day as RoomScheduleDay);
    setSlotRange([item.startSlotNumber, item.endSlotNumber]);
    setIsSuccess(false);
    setIsLoading(false);

    await confirm({
      title: `Edit Jadwal ${item.subject}`,
      confirmText: "Simpan",
      cancelText: "Batal",
      disabled: isUpdatePending,
    });
  };

  return {
    DialogComponent: (
      <>
        {DialogComponent}
        {DeleteModalComponent}
      </>
    ),
    openEditModal,
    openDeleteModal,
  };
}
