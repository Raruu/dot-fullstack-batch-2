import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),

    DATABASE_DRIVER: z.enum(["postgresql"]).default("postgresql"),
    DATABASE_URL: z.string(),

    PUBLIC_APP_URL: z.url().default("http://localhost:3000"),

    BETTER_AUTH_SECRET: z.string().min(10),
    BETTER_AUTH_URL: z.url(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    DATABASE_DRIVER: process.env.DATABASE_DRIVER,
    DATABASE_URL: process.env.DATABASE_URL,

    PUBLIC_APP_URL: process.env.PUBLIC_APP_URL,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
