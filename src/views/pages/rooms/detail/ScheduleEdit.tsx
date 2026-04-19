"use client";

import { toClockString } from "@/libs/utils";
import { useRoomDetail } from "@/views/providers/rooms/RoomDetailProvider";
import {
  Button,
  ButtonGroup,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { DAY_ROWS } from "./components/schedule-shared";
import { ScheduleCreateModal } from "./components/ScheduleCreateModal";
import { useScheduleEditModal } from "./components/ScheduleEditModal";
import { Delete20Regular, Pen20Regular } from "@fluentui/react-icons";

export function ScheduleEdit() {
  const { detail } = useRoomDetail();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    DialogComponent: EditModalComponent,
    openEditModal,
    openDeleteModal,
  } = useScheduleEditModal();

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

  const dayLabelByKey = useMemo(
    () =>
      new Map(
        DAY_ROWS.map((day, index) => [day.key, { label: day.label, index }]),
      ),
    [],
  );

  const timeslotByNumber = useMemo(
    () => new Map(detail.timeslots.map((slot) => [slot.slotNumber, slot])),
    [detail.timeslots],
  );

  const flatSchedules = useMemo(() => {
    return [...detail.schedules].sort((a, b) => {
      const dayIndexA =
        dayLabelByKey.get(a.day)?.index ?? Number.MAX_SAFE_INTEGER;
      const dayIndexB =
        dayLabelByKey.get(b.day)?.index ?? Number.MAX_SAFE_INTEGER;

      if (dayIndexA !== dayIndexB) {
        return dayIndexA - dayIndexB;
      }

      return a.startSlotNumber - b.startSlotNumber;
    });
  }, [dayLabelByKey, detail.schedules]);

  const tableClassNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500"],
      td: [
        "first:group-data-[first=true]/tr:before:rounded-none",
        "last:group-data-[first=true]/tr:before:rounded-none",
        "group-data-[middle=true]/tr:before:rounded-none",
        "first:group-data-[last=true]/tr:before:rounded-none",
        "last:group-data-[last=true]/tr:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <>
      {EditModalComponent}

      <Card className="bg-background/30 p-4 overflow-x-auto space-y-3">
        <div className="flex flex-row items-center justify-between px-1">
          <h2 className="text-lg font-semibold">Agenda</h2>
          <div className="flex items-center gap-2">
            <ButtonGroup>
              <Button
                variant="solid"
                color={viewMode === "grid" ? "primary" : "default"}
                onPress={() => setViewMode("grid")}
              >
                Grid (detail)
              </Button>
              <Button
                variant="solid"
                color={viewMode === "list" ? "primary" : "default"}
                onPress={() => setViewMode("list")}
              >
                List
              </Button>
            </ButtonGroup>

            <ScheduleCreateModal />
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="min-w-245 border border-default-300 rounded-2xl overflow-auto">
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
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-center relative">
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
        ) : (
          <Table removeWrapper classNames={tableClassNames}>
            <TableHeader>
              <TableColumn width="20%">HARI</TableColumn>
              <TableColumn>MATA KULIAH</TableColumn>
              <TableColumn width="30%">JAM</TableColumn>
              <TableColumn width="5%">AKSI</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Belum ada agenda.">
              {flatSchedules.map((item) => {
                const dayLabel = dayLabelByKey.get(item.day)?.label ?? item.day;
                const startSlot = timeslotByNumber.get(item.startSlotNumber);
                const endSlot = timeslotByNumber.get(item.endSlotNumber);

                const scheduleTime =
                  startSlot && endSlot
                    ? `${toClockString(startSlot.startTime)} - ${toClockString(endSlot.endTime)}`
                    : `Slot ${item.startSlotNumber} - ${item.endSlotNumber}`;

                return (
                  <TableRow key={item.id}>
                    <TableCell>{dayLabel}</TableCell>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell>{scheduleTime}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tooltip
                          content="Edit"
                          color="default"
                          placement="left"
                          showArrow
                        >
                          <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            onPress={() => openEditModal(item)}
                          >
                            <Pen20Regular />
                          </Button>
                        </Tooltip>
                        <Tooltip
                          content="Hapus"
                          color="danger"
                          placement="right"
                          showArrow
                        >
                          <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            onPress={() => openDeleteModal(item)}
                            color="danger"
                          >
                            <Delete20Regular />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </>
  );
}
