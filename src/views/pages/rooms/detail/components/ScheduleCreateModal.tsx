"use client";

import { Button, cn, Input, Select, SelectItem, Slider } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { useRoomDetail } from "@/views/providers/rooms/RoomDetailProvider";
import { useConfirmDialogFixed } from "@/views/hooks/useConfirmDialogFixed";
import { useScheduleActions } from "@/views/providers/schedule/ScheduleActions";
import {
  DAY_ROWS,
  getAvailableSlotNumbersByDay,
  getDefaultRange,
  getNearestAvailableSlot,
  getSafeRangeForDay,
  MAX_SUBJECT_LENGTH,
  normalizeRange,
} from "./schedule-shared";
import { RoomScheduleDay } from "@/types/schedule";

function useScheduleCreateModal() {
  const { detail } = useRoomDetail();
  const { createState, isCreatePending, submitCreateSchedule } =
    useScheduleActions();

  const minSlot = detail.timeslots[0]?.slotNumber ?? 1;
  const maxSlot = detail.timeslots.at(-1)?.slotNumber ?? 12;

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
      }),
    [day, detail.schedules, detail.timeslots],
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
              isInvalid={!!createState.errors?.subject}
              errorMessage={createState.errors?.subject?.join(", ")}
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
                    }),
                  );
                }
              }}
              isRequired
              isInvalid={!!createState.errors?.day}
              errorMessage={createState.errors?.day?.join(", ")}
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

            {createState.errors?.slotNumbers?.length ? (
              <p className="text-small text-danger">
                {createState.errors.slotNumbers.join(", ")}
              </p>
            ) : null}
          </div>
        );
      },
      onConfirm: () => {
        setIsLoading(true);
        const [start, end] = normalizeRange(slotRange);
        const formData = new FormData();

        formData.set("roomId", String(detail.id));
        formData.set("subject", subject);
        formData.set("day", day);
        formData.append("slotNumbers", String(start));
        formData.append("slotNumbers", String(end));
        submitCreateSchedule(formData);

        return false;
      },
    });

  useEffect(() => {
    (() => setIsSuccess(createState.success ?? false))();
  }, [createState]);

  useEffect(() => {
    setIsLoading(isCreatePending);
  }, [isCreatePending, setIsLoading]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    (() => {
      closeDialog(true);
      setIsSuccess(false);
    })();
  }, [closeDialog, isSuccess]);

  const openCreateModal = async () => {
    const initialDay: RoomScheduleDay = "MONDAY";
    const initialAvailable = getAvailableSlotNumbersByDay({
      schedules: detail.schedules,
      timeslots: detail.timeslots,
      day: initialDay,
    });

    setSubject("");
    setDay(initialDay);
    setSlotRange(getDefaultRange(initialAvailable));
    setIsSuccess(false);
    setIsLoading(false);

    await confirm({
      title: "Tambah Agenda",
      confirmText: "Tambah",
      cancelText: "Batal",
      disabled: isCreatePending,
    });
  };

  return {
    DialogComponent,
    openCreateModal,
  };
}

export const ScheduleCreateModal = () => {
  const { openCreateModal, DialogComponent } = useScheduleCreateModal();
  return (
    <>
      {DialogComponent}
      <Button color="primary" variant="solid" onPress={openCreateModal}>
        Tambah Agenda
      </Button>
    </>
  );
};
