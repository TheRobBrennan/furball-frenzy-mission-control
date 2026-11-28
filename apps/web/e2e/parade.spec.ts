import { expect, test } from "@playwright/test";

test("the home page invites visitors to the parade", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  await page.goto("/");
  const invite = page.getByTestId("parade-invite").filter({ visible: true });
  await expect(invite).toBeInViewport();
  await invite.click();
  await expect(page.getByTestId("parade-start")).toBeVisible();
});

test("a tap on the street sets off a firework", async ({ page }) => {
  await page.goto("/parade/thanksgiving-2026");
  await page.getByText("Listen, you can hear the drums.").click();
  await expect(page.getByTestId("firework").first()).toBeAttached();
});

test("the parade starts, ends with Little Bear, and fits the screen", async ({ page }) => {
  await page.goto("/parade/thanksgiving-2026");
  await page.getByTestId("parade-start").click();
  const show = page.getByTestId("parade-show");
  await expect(show).toHaveAttribute("data-scene", "piggy-hamley");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(show).toHaveAttribute("data-scene", "bunnies");
  await page.getByRole("button", { name: "Skip to the end" }).click();
  await expect(show).toHaveAttribute("data-scene", "moon-float");
  await expect(page.getByTestId("parade-encore")).toBeInViewport({ timeout: 15_000 });
  await expect(page.getByRole("navigation", { name: "Legal" })).toHaveCount(1);
  const picture = show.locator("img").first();
  await expect.poll(() => picture.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("the Missions tab on the home page lists both missions", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Mission menu" });
  // On a phone the folder tabs are inside the menu.
  if (page.viewportSize()!.width < 1024) await nav.getByRole("button", { name: "Mission menu" }).click();
  await nav.getByRole("link", { name: "Missions", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Missions", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start the mission" })).toHaveAttribute("href", "/mission");
  await expect(page.getByRole("link", { name: "Watch the parade" })).toHaveAttribute("href", "/parade/thanksgiving-2026");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("the short parade address leads to this year's parade", async ({ page }) => {
  await page.goto("/parade");
  await expect(page).toHaveURL(/\/parade\/thanksgiving-2026$/);
});
