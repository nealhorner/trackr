import { defineConfig } from "prisma/config";

/**
 * Prisma 7 config for **SQLite** (desktop local API). Use `--config prisma.config.sqlite.ts`.
 * Do not use `POSTGRES_DATABASE_URL` here — server Postgres stays in `prisma.config.ts`.
 */
export default defineConfig({
  schema: "prisma/sqlite/schema.prisma",
  datasource: {
    url: process.env.SQLITE_DATABASE_URL ?? "file:./.local/trackr.sqlite",
  },
  migrations: {
    path: "prisma/sqlite/migrations",
  },
});
