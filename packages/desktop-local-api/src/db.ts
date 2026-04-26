import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@trackr/prisma/sqlite";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const url = process.env.DATABASE_URL ?? "file:./.local/trackr.sqlite";
const adapter = new PrismaBetterSqlite3({ url });

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
