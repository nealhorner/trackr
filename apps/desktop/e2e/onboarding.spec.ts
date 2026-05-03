import { test, expect } from "@playwright/test";

import { installTauriE2EBridge } from "./tauri-e2e-bridge";

const API = "http://127.0.0.1:3000";

async function waitForApi(): Promise<void> {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`${API}/health`);
      if (r.ok) return;
    } catch {
      /* not ready */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("API did not become ready at /health");
}

async function completeSetupIfNeeded(): Promise<void> {
  const status = await fetch(`${API}/api/v1/setup/status`);
  const body = (await status.json()) as {
    data?: { needsSetup?: boolean };
  };
  const needs = body.data?.needsSetup ?? true;
  if (!needs) return;

  const res = await fetch(`${API}/api/v1/setup/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tenantName: "E2E Desktop Tenant",
      adminEmail: "e2e-desktop-remote@example.com",
      adminPassword: "E2E_Desktop_9!",
      authSettings: { password: true },
    }),
  });
  if (!res.ok) {
    throw new Error(`setup failed: ${res.status} ${await res.text()}`);
  }
}

test.describe("desktop onboarding (remote)", () => {
  test.beforeAll(async () => {
    await waitForApi();
    await completeSetupIfNeeded();
  });

  test.beforeEach(async ({ page }) => {
    await installTauriE2EBridge(page);
  });

  test("server URL, connect screen, email sign-in", async ({ page }) => {
    const adminEmail = "e2e-desktop-remote@example.com";
    const adminPassword = "E2E_Desktop_9!";

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Welcome to Trackr/i }),
    ).toBeVisible();

    await page.getByLabel(/Server URL/i).fill(API);
    await page.getByRole("button", { name: /Use remote server/i }).click();

    await expect(page).toHaveURL(/\/connect/, { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: /Sign in to remote Trackr/i }),
    ).toBeVisible();

    await page.getByLabel(/^Email$/i).fill(adminEmail);
    await page.getByLabel(/^Password$/i).fill(adminPassword);
    await page.getByRole("button", { name: /^Sign in$/i }).click();

    await expect(page).toHaveURL(/127\.0\.0\.1:1420\/?$/, { timeout: 30_000 });
    await expect(
      page.getByRole("heading", { name: /^Desktop$/i }),
    ).toBeVisible();
    await expect(page.getByText(/127\.0\.0\.1:3000/)).toBeVisible();
  });
});

test.describe("desktop onboarding (local)", () => {
  test.beforeEach(async ({ page }) => {
    await installTauriE2EBridge(page, { mockLocalApiBaseUrl: API });
  });

  test("continue locally reaches desktop home", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Welcome to Trackr/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /Continue locally/i }).click();

    await expect(page.getByText(/workspace label is/i)).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/e2e-local-workspace/i)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /^Desktop$/i }),
    ).toBeVisible();
  });
});
