export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ActionResult = {
  success?: boolean;
  message?: string;
};

export type ActionHandler = (
  revalidateTarget: string,
  prevState: Record<string, never>,
  formData: FormData,
) => Promise<ActionResult>;
