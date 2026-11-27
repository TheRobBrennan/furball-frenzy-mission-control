import { expect, test } from "@playwright/test";

test("the home page invites visitors to the parade", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  await page.goto("/");
  const invite = page.getByTestId("parade-invite").filter({ visible: true });
  await expect(invite).toBeInViewport();
  await invite.click();
  await expect(page.getByTestId("parade-start")).toBeVisible();
});

test("the parade starts, ends with Little Bear, and fits the screen", async ({ page }) => {
  await page.goto("/parade");
  await page.getByTestId("parade-start").click();
  const show = page.getByTestId("parade-show");
  await expect(show).toHaveAttribute("data-scene", "piggy-hamley");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(show).toHaveAttribute("data-scene", "bunnies");
  await page.getByRole("button", { name: "Skip to the end" }).click();
  await expect(show).toHaveAttribute("data-scene", "moon-float");
  const picture = show.locator("img");
  await expect.poll(() => picture.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});
