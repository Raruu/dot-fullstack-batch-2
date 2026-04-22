import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    BACKEND_API_URL: z.url().default("http://localhost:3000"),

    PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    PUBLIC_APP_URL: process.env.PUBLIC_APP_URL,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
