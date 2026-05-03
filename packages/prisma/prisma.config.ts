import { defineConfig } from "prisma/config";

/**
 * Prisma 7 config for **Postgres** (server) when CLI runs with cwd = `packages/prisma`.
 * For SQLite, use `prisma.config.sqlite.ts` (see package.json scripts).
 */
export default defineConfig({
  schema: "prisma/postgres/schema.prisma",
  datasource: {
    url:
      process.env.POSTGRES_DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/trackr",
  },
  migrations: {
    path: "prisma/postgres/migrations",
  },
});
