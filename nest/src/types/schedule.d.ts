const DAY_ROWS = [
  { key: 'MONDAY', label: 'Senin' },
  { key: 'TUESDAY', label: 'Selasa' },
  { key: 'WEDNESDAY', label: 'Rabu' },
  { key: 'THURSDAY', label: 'Kamis' },
  { key: 'FRIDAY', label: 'Jumat' },
  { key: 'SATURDAY', label: 'Sabtu' },
  { key: 'SUNDAY', label: 'Minggu' },
] as const;

export type RoomScheduleDay = (typeof DAY_ROWS)[number]['key'];
