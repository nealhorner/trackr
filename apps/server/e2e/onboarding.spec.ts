import { test, expect } from "@playwright/test";

/**
 * Full web onboarding: first-time setup → email login → welcome.
 * Requires Postgres (see global-setup) and both API + Vite (see playwright.config).
 */
test.describe("web onboarding", () => {
  test("setup wizard, sign in, welcome", async ({ page }) => {
    const adminEmail = "e2e-onboarding@example.com";
    const adminPassword = "E2E_Onboarding_9!";

    await page.goto("/");

    await expect(page).toHaveURL(/\/setup/, { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: /Welcome to Trackr/i }),
    ).toBeVisible();

    await page.getByLabel(/Organization \/ tenant name/i).fill("E2E Tenant");
    await page.getByLabel(/Administrator email/i).fill(adminEmail);
    await page.getByLabel(/^Administrator password$/i).fill(adminPassword);

    await page.getByRole("button", { name: /Complete setup/i }).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 30_000 });

    await page.getByLabel(/Email/i).fill(adminEmail);
    await page.getByLabel(/^Password$/i).fill(adminPassword);
    await page.getByRole("button", { name: /Sign in with email/i }).click();

    await expect(page).toHaveURL(/\/welcome/, { timeout: 30_000 });
    await expect(
      page.getByRole("heading", { name: /^Welcome$/i }),
    ).toBeVisible();
  });
});
