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
