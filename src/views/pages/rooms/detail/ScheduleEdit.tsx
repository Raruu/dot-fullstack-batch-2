"use client";

import { toClockString } from "@/libs/utils";
import { useRoomDetail } from "@/views/providers/rooms/RoomDetailProvider";
import { Card } from "@heroui/react";
import { useMemo } from "react";
import { DAY_ROWS } from "./components/schedule-shared";
import { ScheduleCreateModal } from "./components/ScheduleCreateModal";
import { useScheduleEditModal } from "./components/ScheduleEditModal";

export function ScheduleEdit() {
  const { detail } = useRoomDetail();

  const { DialogComponent: EditModalComponent, openEditModal } =
    useScheduleEditModal();

  const scheduleByDay = useMemo(() => {
    return DAY_ROWS.reduce<Record<string, typeof detail.schedules>>(
      (acc, day) => {
        acc[day.key] = detail.schedules
          .filter((item) => item.day === day.key)
          .sort((a, b) => a.startSlotNumber - b.startSlotNumber);
        return acc;
      },
      {},
    );
  }, [detail]);

  const slotNumbers = detail.timeslots.map((slot) => slot.slotNumber);

  return (
    <>
      {EditModalComponent}

      <Card className="bg-background/30 p-4 overflow-x-auto space-y-3">
        <div className="flex flex-row items-center justify-between px-1">
          <h2 className="text-lg font-semibold">Agenda</h2>
          <ScheduleCreateModal />
        </div>

        <div className="min-w-245 rounded-md border border-default-300">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-36 border border-default-300 bg-default-100/40 p-3 text-left text-lg font-medium">
                  Hari
                </th>
                {detail.timeslots.map((slot) => (
                  <th
                    key={slot.id}
                    className="border border-default-300 bg-default-100/30 p-2 text-center align-top"
                  >
                    <div className="text-base font-semibold leading-tight">
                      {slot.slotNumber}
                    </div>
                    <div className="text-[11px] text-default-500 leading-tight mt-1">
                      {toClockString(slot.startTime)} -{" "}
                      {toClockString(slot.endTime)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {DAY_ROWS.map((dayRow) => {
                const daySchedules = scheduleByDay[dayRow.key] ?? [];
                const startMap = new Map(
                  daySchedules.map((item) => [item.startSlotNumber, item]),
                );
                const occupied = new Set<number>();

                daySchedules.forEach((item) => {
                  for (
                    let slot = item.startSlotNumber + 1;
                    slot <= item.endSlotNumber;
                    slot += 1
                  ) {
                    occupied.add(slot);
                  }
                });

                return (
                  <tr key={dayRow.key} className="h-28">
                    <th className="border border-default-300 bg-default-100/30 p-3 text-left text-2xl font-medium">
                      {dayRow.label}
                    </th>

                    {slotNumbers.map((slotNumber) => {
                      if (occupied.has(slotNumber)) {
                        return null;
                      }

                      const block = startMap.get(slotNumber);

                      if (!block) {
                        return (
                          <td
                            key={`${dayRow.key}-${slotNumber}`}
                            className="border border-default-300"
                          />
                        );
                      }

                      const span =
                        block.endSlotNumber - block.startSlotNumber + 1;

                      return (
                        <td
                          key={block.id}
                          colSpan={span}
                          className="border border-default-300 bg-default-50/50 hover:bg-default transition-all duration-150 cursor-pointer p-2 align-middle"
                          onClick={() => openEditModal(block)}
                        >
                          <div className="flex h-full flex-col items-center justify-center gap-2 text-center  relative">
                            <div
                              className="text-lg font-medium tracking-wide leading-none wrap-break-word"
                              style={{ width: 72 * span }}
                            >
                              {block.subject}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
