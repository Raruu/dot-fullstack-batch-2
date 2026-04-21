export type CreateScheduleState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type DeleteScheduleState = {
  success?: boolean;
  message?: string;
};

export type UpdateScheduleState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
