export type UpdateRoomState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type CreateRoomState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  createdId?: number;
};

export type DeleteRoomState = {
  success?: boolean;
  message?: string;
};

export type CreateRoomAction = (
  prevState: CreateRoomState,
  formData: FormData,
) => Promise<CreateRoomState>;
