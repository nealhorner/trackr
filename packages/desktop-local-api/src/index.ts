import { execFileSync } from "node:child_process";
import path from "node:path";
import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { ensureLocalSeedData } from "./seed";

function runSqliteMigrations() {
  const root = path.resolve(__dirname, "../../..");
  const prismaCwd = path.join(root, "packages", "prisma");
  execFileSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["prisma", "migrate", "deploy", "--schema", "prisma/sqlite/schema.prisma"],
    {
      cwd: prismaCwd,
      stdio: "inherit",
      env: process.env,
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
