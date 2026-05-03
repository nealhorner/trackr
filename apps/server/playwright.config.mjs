import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const reuseE2eServers = process.env.REUSE_E2E_SERVERS === "1";

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
  // Wait for both Vite and the API: a single url would only gate on 5173 (and reuse would skip 3000).
  webServer: [
    {
      name: "e2e-stack",
      command: "npm run dev:e2e",
      cwd: repoRoot,
      url: "http://127.0.0.1:5173",
      reuseExistingServer: reuseE2eServers,
      timeout: 180_000,
    },
    {
      name: "e2e-api",
      command: 'node -e "setInterval(()=>{}, 1<<30)"',
      url: "http://127.0.0.1:3000/health",
      reuseExistingServer: reuseE2eServers,
      timeout: 180_000,
    },
  ],
});
