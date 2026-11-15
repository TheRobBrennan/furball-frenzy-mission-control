import { expect, test } from "@playwright/test";

// No skip here, this is the one test that wants the trailer.
test("the trailer pops up once, can be closed, and does not come back this visit", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("promo")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId("promo-close")).toBeInViewport();
  await expect(page.getByRole("link", { name: /watch a mission/i })).toBeInViewport();
  await page.getByTestId("promo-close").click();
  await expect(page.getByTestId("promo")).toBeHidden();
  await page.reload();
  await page.waitForTimeout(2500);
  await expect(page.getByTestId("promo")).toBeHidden();
});

test("the trailer's link starts the judges mission", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /watch a mission/i }).click();
  await expect(page).toHaveURL(/\/mission\?judges=1/);
});

test("the link /?trailer plays it again after it was closed", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("promo-close").click({ timeout: 10_000 });
  await page.goto("/?trailer");
  await expect(page.getByTestId("promo")).toBeVisible({ timeout: 10_000 });
});

test("the buttons read on one line each, at desktop and phone width", async ({ page }) => {
  await page.goto("/");
  for (const name of [/watch a mission/i, /design it myself/i]) {
    const link = page.getByRole("link", { name });
    await expect(link).toBeVisible({ timeout: 10_000 });
    const box = await link.boundingBox();
    expect(box!.height).toBeLessThan(64);
  }
});
