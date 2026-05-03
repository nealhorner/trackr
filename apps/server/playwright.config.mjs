import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  globalSetup: "./e2e/global-setup.ts",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "server-shell",
      testMatch: /ui-shell-smoke\.spec\.ts/,
      use: {
        baseURL: "http://127.0.0.1:3000",
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "web-onboarding",
      testMatch: /onboarding\.spec\.ts/,
      use: {
        baseURL: "http://127.0.0.1:5173",
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: {
    command: "npm run dev:e2e",
    cwd: repoRoot,
    url: "http://127.0.0.1:5173",
    // Always start a fresh stack so ports 3000/5173 match this run (set REUSE_E2E_SERVERS=1 to skip).
    reuseExistingServer: process.env.REUSE_E2E_SERVERS === "1",
    timeout: 180_000,
  },
});
