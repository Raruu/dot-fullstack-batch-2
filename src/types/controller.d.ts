import type { Request, Response } from 'express';

export type ActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export type ActionFn = (
  revalidateTarget: string,
  prevState: Record<string, never>,
  formData: FormData,
) => Promise<ActionResult>;

export type UploadedFile = {
  fieldname: string;
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

export type NestRequest = Request;
export type NestResponse = Response;
