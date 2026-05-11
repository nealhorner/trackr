import path from "node:path";
import { pathToFileURL } from "node:url";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@trackr/prisma/sqlite";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function resolveSqliteUrl(): string {
  if (process.env.SQLITE_DATABASE_URL) return process.env.SQLITE_DATABASE_URL;
  const root = path.resolve(__dirname, "../../..");
  const dbFile = path.join(
    root,
    "packages",
    "prisma",
    ".local",
    "trackr.sqlite",
  );
  return pathToFileURL(dbFile).href;
}

const url = resolveSqliteUrl();
const adapter = new PrismaBetterSqlite3({ url });

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
