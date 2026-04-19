import { createAuthClient } from "better-auth/react";

export const authClient = (publicUrl: string) =>
  createAuthClient({
    baseURL: publicUrl,
  });
