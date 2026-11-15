import { expect, test } from "@playwright/test";

test("the landing page loads with the project title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Furball Frenzy/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("no horizontal scroll at this width", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("the mission menu is reachable", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await expect(page.getByRole("button", { name: /mission menu/i })).toBeVisible();
  } else {
    await expect(page.getByRole("link", { name: /launch sites/i }).first()).toBeVisible();
  }
});

test("Storybook is served at /storybook", async ({ page }) => {
  await page.goto("/storybook");
  await expect(page).toHaveURL(/\/storybook\/index\.html/);
  await expect(page).toHaveTitle(/Storybook/);
});
