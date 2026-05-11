import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { ensureLocalSeedData } from "./seed";

/** SQLite URL for Prisma CLI when cwd is `packages/prisma` (must not reuse `POSTGRES_DATABASE_URL`). */
function sqliteUrlForPrismaPackage(): string {
  if (process.env.SQLITE_DATABASE_URL) return process.env.SQLITE_DATABASE_URL;
  return "file:./.local/trackr.sqlite";
}

function runSqliteMigrations() {
  const root = path.resolve(__dirname, "../../..");
  const prismaCwd = path.join(root, "packages", "prisma");
  const databaseUrl = sqliteUrlForPrismaPackage();
  if (databaseUrl === "file:./.local/trackr.sqlite") {
    fs.mkdirSync(path.join(prismaCwd, ".local"), { recursive: true });
  }
  execFileSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["prisma", "migrate", "deploy", "--config", "prisma.config.sqlite.ts"],
    {
      cwd: prismaCwd,
      stdio: "inherit",
      env: { ...process.env, SQLITE_DATABASE_URL: databaseUrl },
    },
  );
}

async function bootstrap() {
  runSqliteMigrations();
  await ensureLocalSeedData();

  const app = createApp();
  const port = Number(process.env.PORT ?? 4310);
  serve({ fetch: app.fetch, port });

  // eslint-disable-next-line no-console
  console.log(`Desktop local API listening on http://127.0.0.1:${port}`);
}

void bootstrap();
