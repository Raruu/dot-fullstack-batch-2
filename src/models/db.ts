import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../libs/env";

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
  });

  const prisma = new PrismaClient({ adapter });

  return prisma;
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
