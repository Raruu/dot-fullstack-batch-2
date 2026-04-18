import { betterAuth } from "better-auth";
import { env } from "./env";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";

export const auth = betterAuth({
  baseURL: {
    allowedHosts: ["*.vercel.app"],
    fallback: env.BETTER_AUTH_URL,
  },

  database: prismaAdapter(db, {
    provider: env.DATABASE_DRIVER,
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              emailVerified: true,
            },
          };
        },
      },
    },
  },
});
