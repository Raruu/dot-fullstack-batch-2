export type CreateUserState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  createdId?: string;
};

export type UpdateUserState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  updatedId?: string;
};

export type DeleteUserState = {
  success?: boolean;
  message?: string;
};

export type CreateUserAction = (
  prevState: CreateUserState,
  formData: FormData,
) => Promise<CreateUserState>;

export type UpdateUserAction = (
  prevState: UpdateUserState,
  formData: FormData,
) => Promise<UpdateUserState>;

export type DeleteUserAction = (
  prevState: DeleteUserState,
  formData: FormData,
) => Promise<DeleteUserState>;
