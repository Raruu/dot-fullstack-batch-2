import { RoomScheduleDay } from "@/types/schedule";

export const DAY_ROWS = [
  { key: "MONDAY", label: "Senin" },
  { key: "TUESDAY", label: "Selasa" },
  { key: "WEDNESDAY", label: "Rabu" },
  { key: "THURSDAY", label: "Kamis" },
  { key: "FRIDAY", label: "Jumat" },
  { key: "SATURDAY", label: "Sabtu" },
  { key: "SUNDAY", label: "Minggu" },
] as const;

export const MAX_SUBJECT_LENGTH = 30;

type RoomScheduleLike = {
  id: number;
  day: string;
  startSlotNumber: number;
  endSlotNumber: number;
};

type RoomTimeslotLike = {
  slotNumber: number;
};

export function normalizeRange(values: number[]): [number, number] {
  if (values.length < 2) {
    const value = values[0] ?? 1;
    return [value, value + 1];
  }

  const sorted = [...values].sort((a, b) => a - b);
  return [sorted[0], sorted[sorted.length - 1]];
}

export function getAvailableSlotNumbersByDay({
  schedules,
  timeslots,
  day,
  excludeScheduleId,
}: {
  schedules: RoomScheduleLike[];
  timeslots: RoomTimeslotLike[];
  day: RoomScheduleDay;
  excludeScheduleId?: number | null;
}) {
  const usedSlots = new Set<number>();

  for (const schedule of schedules) {
    if (schedule.day !== day) {
      continue;
    }

    if (excludeScheduleId && schedule.id === excludeScheduleId) {
      continue;
    }

    const start = Math.min(schedule.startSlotNumber, schedule.endSlotNumber);
    const end = Math.max(schedule.startSlotNumber, schedule.endSlotNumber);

    for (let slot = start; slot <= end; slot += 1) {
      usedSlots.add(slot);
    }
  }

  return timeslots
    .map((slot) => slot.slotNumber)
    .filter((slotNumber) => !usedSlots.has(slotNumber));
}

export function getNearestAvailableSlot(value: number, slotNumbers: number[]) {
  if (!slotNumbers.length) {
    return value;
  }

  return slotNumbers.reduce((nearest, current) => {
    if (Math.abs(current - value) < Math.abs(nearest - value)) {
      return current;
    }

    return nearest;
  }, slotNumbers[0]);
}

function getContiguousSlotBlocks(slotNumbers: number[]) {
  if (!slotNumbers.length) {
    return [] as number[][];
  }

  const sorted = [...slotNumbers].sort((a, b) => a - b);
  const blocks: number[][] = [[sorted[0]]];

  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i];
    const previous = sorted[i - 1];

    if (current === previous + 1) {
      blocks[blocks.length - 1].push(current);
      continue;
    }

    blocks.push([current]);
  }

  return blocks;
}

export function getDefaultRange(slotNumbers: number[]) {
  if (!slotNumbers.length) {
    return [1, 1] as number[];
  }

  if (slotNumbers.length === 1) {
    return [slotNumbers[0], slotNumbers[0]];
  }

  const blocks = getContiguousSlotBlocks(slotNumbers);

  for (const block of blocks) {
    if (block.length >= 2) {
      return [block[0], block[1]];
    }
  }

  for (let i = 0; i < slotNumbers.length - 1; i += 1) {
    const current = slotNumbers[i];
    const next = slotNumbers[i + 1];

    if (next === current + 1) {
      return [current, next];
    }
  }

  return [slotNumbers[0], slotNumbers[0]];
}

export function isRangeFullyAvailable(
  start: number,
  end: number,
  slotNumbers: number[],
) {
  const [normalizedStart, normalizedEnd] = normalizeRange([start, end]);
  const available = new Set(slotNumbers);

  for (let slot = normalizedStart; slot <= normalizedEnd; slot += 1) {
    if (!available.has(slot)) {
      return false;
    }
  }

  return true;
}

function clampRangeToAvailable(
  values: number[],
  slotNumbers: number[],
): number[] {
  if (!slotNumbers.length) {
    return [1, 1];
  }

  const blocks = getContiguousSlotBlocks(slotNumbers);
  const [rawStart, rawEnd] = normalizeRange(values);
  const start = getNearestAvailableSlot(rawStart, slotNumbers);
  const end = getNearestAvailableSlot(rawEnd, slotNumbers);

  if (isRangeFullyAvailable(start, end, slotNumbers)) {
    return [start, end];
  }

  const containingBlock = blocks.find(
    (block) => start >= block[0] && start <= block[block.length - 1],
  );

  if (!containingBlock) {
    return getDefaultRange(slotNumbers);
  }

  const blockStart = containingBlock[0];
  const blockEnd = containingBlock[containingBlock.length - 1];
  const clampedEnd = Math.min(Math.max(end, blockStart), blockEnd);

  return normalizeRange([start, clampedEnd]);
}

export function getSafeRangeForDay({
  currentRange,
  nextDay,
  schedules,
  timeslots,
  minSlot,
  excludeScheduleId,
}: {
  currentRange: number[];
  nextDay: RoomScheduleDay;
  schedules: RoomScheduleLike[];
  timeslots: RoomTimeslotLike[];
  minSlot: number;
  excludeScheduleId?: number | null;
}) {
  const nextAvailable = getAvailableSlotNumbersByDay({
    schedules,
    timeslots,
    day: nextDay,
    excludeScheduleId,
  });

  if (!nextAvailable.length) {
    return [minSlot, minSlot];
  }

  const [currentStart, currentEnd] = normalizeRange(currentRange);
  const isCurrentRangeAvailable = isRangeFullyAvailable(
    currentStart,
    currentEnd,
    nextAvailable,
  );

  if (isCurrentRangeAvailable) {
    return currentRange;
  }

  return clampRangeToAvailable(currentRange, nextAvailable);
}
