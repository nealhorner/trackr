import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../../../..");
const prismaCwd = path.join(root, "packages", "prisma");
const dbDir = fs.mkdtempSync(path.join(os.tmpdir(), "trackr-desktop-api-"));
const dbPath = path.join(dbDir, "test.sqlite");

process.env.SQLITE_DATABASE_URL = `file:${dbPath}`;

beforeAll(async () => {
  execFileSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["prisma", "db", "push", "--config", "prisma.config.sqlite.ts"],
    { cwd: prismaCwd, env: process.env, stdio: "inherit" },
  );

  const { ensureLocalSeedData } = await import("../seed.js");
  await ensureLocalSeedData();
});

describe("desktop local api", () => {
  it("returns health and projects", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();
    const health = await app.request("/health");
    expect(health.status).toBe(200);

    const projects = await app.request("/api/v1/projects");
    expect(projects.status).toBe(200);
    const body = (await projects.json()) as {
      data: { projects: Array<{ id: number; name: string }> };
    };
    expect(body.data.projects.length).toBeGreaterThan(0);
  });
});
