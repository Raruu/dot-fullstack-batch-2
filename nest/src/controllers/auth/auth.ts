import { betterAuth } from 'better-auth';
import { env } from '../../libs/env';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import db from '../../models/db';
import { openAPI } from 'better-auth/plugins';

export const auth = betterAuth({
  baseURL: {
    allowedHosts: ['*.vercel.app'],
    fallback: env.BETTER_AUTH_URL,
  },
  trustedOrigins: ['http://localhost:3001'],
  plugins: [openAPI()],
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
