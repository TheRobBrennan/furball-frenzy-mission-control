import { expect, test, type Page } from "@playwright/test";

const pick = (page: Page, name: RegExp) => page.getByRole("button", { name }).click();
const balanced = [/medium launcher/i, /navigation camera/i, /spectrometer/i, /medium solar array/i, /x-band dish/i];

// The launch plays a sequence first. Most tests skip it, one watches it.
const launchAndSkip = async (page: Page) => {
  await page.getByTestId("launch").click();
  await page.getByRole("button", { name: /skip to the debrief/i }).click();
};

test("the mission page starts locked, with the six gauges", async ({ page }) => {
  await page.goto("/mission");
  await expect(page.getByRole("heading", { level: 1, name: /design the mission/i })).toBeVisible();
  await expect(page.getByTestId("launch")).toBeDisabled();
  for (const id of ["mass", "power", "budget", "data", "comms", "time"]) await expect(page.getByTestId(`gauge-${id}`)).toBeVisible();
});

test("a balanced design launches and the debrief says success", async ({ page }) => {
  await page.goto("/mission");
  for (const n of [/medium launcher/i, /navigation camera/i, /spectrometer/i, /medium solar array/i, /x-band dish/i]) await pick(page, n);
  await expect(page.getByTestId("launch")).toBeEnabled();
  await launchAndSkip(page);
  await expect(page.getByRole("heading", { name: /mission success/i })).toBeVisible();
  await expect(page.getByTestId("science")).toContainText("100%");
});

test("a rover that is too heavy cannot launch, and says why", async ({ page }) => {
  await page.goto("/mission");
  for (const n of [/small launcher/i, /navigation camera/i, /seismometer/i, /spectrometer/i, /radar/i, /sample drill/i, /large solar array/i, /ka-band dish/i]) await pick(page, n);
  await expect(page.getByTestId("launch")).toBeDisabled();
  await expect(page.getByTestId("issues")).toContainText(/too heavy/);
});

test("no horizontal scroll on the mission page", async ({ page }) => {
  await page.goto("/mission");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("the hero's Start the mission button goes to the mission page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /start the mission/i }).click();
  await expect(page).toHaveURL(/\/mission$/);
});

test("on a phone the gauges stay in view while scrolling through the steps", async ({ page, isMobile }) => {
  test.skip(!isMobile, "the strip is for phones");
  await page.goto("/mission");
  await page.getByRole("heading", { name: /pick a solar array/i }).scrollIntoViewIfNeeded();
  await expect(page.getByTestId("gauge-compact-mass")).toBeInViewport();
});

test("the launch plays a countdown and liftoff, then the debrief arrives and comes into view", async ({ page }) => {
  await page.goto("/mission");
  for (const n of balanced) await pick(page, n);
  await page.getByTestId("launch").click();
  await expect(page.getByTestId("launch-sequence")).toBeVisible();
  await expect(page.getByTestId("launch-count")).toHaveText("3");
  await expect(page.getByTestId("launch-count")).toHaveText("Liftoff!", { timeout: 6000 });
  await expect(page.getByTestId("debrief")).toBeVisible({ timeout: 12_000 });
  await expect(page.getByTestId("launch-sequence")).toBeHidden();
  await expect(page.getByTestId("debrief")).toBeInViewport();
});

test("the binder tabs are on the home page, not the mission page", async ({ page }) => {
  await page.goto("/mission");
  await expect(page.getByRole("navigation", { name: /mission menu/i })).toHaveCount(0);
});
