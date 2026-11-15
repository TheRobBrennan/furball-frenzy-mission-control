import { expect, test, type Page } from "@playwright/test";

// Tests run silent, the story plays a voice and sounds through the speakers.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("ff-story-sound", "off");
      localStorage.setItem("ff-story-hold", "none");
      localStorage.setItem("ff-story-trouble", "none");
    } catch {
      // No storage, nothing to silence.
    }
  });
});

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

test("the mission is told by the furballs, then the debrief arrives and comes into view", async ({ page }) => {
  await page.goto("/mission");
  for (const n of balanced) await pick(page, n);
  await page.getByTestId("launch").click();
  await expect(page.getByTestId("mission-story")).toBeVisible();
  await expect(page.getByTestId("scene-title")).toHaveText("Mission Control");
  for (const name of ["Piggy", "The elephants", "The Gray Elephant", "Hamley", "Blue Bear", "Little Duck"]) await expect(page.getByRole("img", { name })).toBeVisible();
  await expect(page.getByTestId("speed")).toBeVisible();
  await expect(page.getByTestId("speed-label")).toContainText("Lazy 0.5x");
  // The default is lazy, so speed it up for the test.
  await page.getByTestId("speed").fill("2");
  await page.getByTestId("speed").dispatchEvent("keyup");
  await expect(page.getByTestId("speed-label")).toContainText("Quick 2x");
  // The newest message is always on screen, never below the fold.
  await expect(page.getByTestId("story-lines").locator("p").first()).toBeInViewport();
  await expect(page.getByTestId("scene-title")).toHaveText("Liftoff", { timeout: 45_000 });
  await page.getByRole("button", { name: /skip to the debrief/i }).click();
  await expect(page.getByTestId("debrief")).toBeVisible();
  await expect(page.getByTestId("mission-story")).toBeHidden();
  await expect(page.getByTestId("debrief")).toBeInViewport();
});

test("a no-go at the final checks is fixed before the countdown, and trouble in space ends with everyone safe", async ({ page }) => {
  test.setTimeout(180_000);
  await page.addInitScript(() => {
    localStorage.setItem("ff-story-hold", "1");
    localStorage.setItem("ff-story-trouble", "abort:0");
  });
  await page.goto("/mission");
  for (const n of balanced) await pick(page, n);
  await page.getByTestId("launch").click();
  await page.getByTestId("speed").fill("2");
  await page.getByTestId("speed").dispatchEvent("keyup");
  await expect(page.getByTestId("check-nogo")).toContainText("Ground station", { timeout: 30_000 });
  await expect(page.getByTestId("story-lines").locator("p").first()).toBeInViewport();
  await expect(page.getByTestId("scene-title")).toHaveText("Trouble in space", { timeout: 60_000 });
  await expect(page.getByTestId("piggy-ipad")).toBeVisible();
  await expect(page.getByTestId("scene-title")).toHaveText("Turning for home", { timeout: 30_000 });
  await expect(page.getByTestId("scene-title")).toHaveText("Home safe", { timeout: 60_000 });
  await expect(page.getByTestId("lesson")).toContainText("Turning back is a good call");
});

test("Judges, start here: from the home page link, the elephants design a mission and launch it by themselves", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/");
  await page.getByRole("link", { name: "Start here" }).click();
  await expect(page).toHaveURL(/\/mission\?judges=1/);
  await expect(page.getByTestId("judges-line")).toContainText("medium launcher");
  await expect(page.getByTestId("mission-story")).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: /skip to the debrief/i }).click();
  await expect(page.getByTestId("debrief")).toBeVisible();
});

test("the binder tabs are on the home page, not the mission page", async ({ page }) => {
  await page.goto("/mission");
  await expect(page.getByRole("navigation", { name: /mission menu/i })).toHaveCount(0);
});
