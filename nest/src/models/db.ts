import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../libs/env';
import {
  PrismaClient as PrismaClientClass,
  type PrismaClient,
} from '@prisma/client';

const prismaClientSingleton = (): PrismaClient => {
  const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
  });

  const prisma = new PrismaClientClass({ adapter });

  return prisma;
};

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const globalForPrisma = globalThis as typeof globalThis & {
  prismaGlobal: PrismaClient | undefined;
};

const db = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

export default db;

if (env.NODE_ENV !== 'production') globalForPrisma.prismaGlobal = db;
