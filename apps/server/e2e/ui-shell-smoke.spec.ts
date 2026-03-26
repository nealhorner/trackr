import { test, expect } from "@playwright/test";

test("ui shell placeholder renders key elements", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("title")).toHaveText(/Trackr/i);
  await expect(page.locator(".context-title")).toHaveText("Home");
  await expect(page.locator("input.global-search")).toBeVisible();
  await expect(page.locator("aside.left-nav")).toBeVisible();
});
