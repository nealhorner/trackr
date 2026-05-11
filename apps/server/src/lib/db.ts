import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@trackr/prisma";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Matches [packages/prisma/prisma.config.ts](packages/prisma/prisma.config.ts) default. */
const connectionString =
  process.env.POSTGRES_DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/trackr";

const adapter = new PrismaPg({ connectionString });

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
