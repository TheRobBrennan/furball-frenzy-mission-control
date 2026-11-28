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
  await page.goto("/missions/parade/thanksgiving-2026");
  await page.getByText("Listen, you can hear the drums.").click();
  await expect(page.getByTestId("firework").first()).toBeAttached();
});

test("the parade starts, ends with Little Bear, and fits the screen", async ({ page }) => {
  await page.goto("/missions/parade/thanksgiving-2026");
  await page.getByTestId("parade-start").click();
  const show = page.getByTestId("parade-show");
  await expect(show).toHaveAttribute("data-scene", "piggy-hamley");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(show).toHaveAttribute("data-scene", "bunnies");
  // The controls stay on one line, on a phone too.
  const tops = await page.getByTestId("parade-controls").locator("button").evaluateAll((all) => all.map((b) => Math.round(b.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);
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
  await expect(page.getByTestId("new-sticker")).toBeVisible();
  await expect(page.getByRole("link", { name: /start the mission/i })).toHaveAttribute("href", "/missions/lunar-south-pole");
  await expect(page.getByRole("link", { name: /watch the parade/i })).toHaveAttribute("href", "/missions/parade/thanksgiving-2026");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("the older mission addresses lead to the new ones, query and all", async ({ page }) => {
  for (const [from, to] of [
    ["/mission?judges=1", /\/missions\/lunar-south-pole\?judges=1$/],
    ["/parade", /\/missions\/parade\/thanksgiving-2026$/],
    ["/parade/thanksgiving-2026", /\/missions\/parade\/thanksgiving-2026$/],
    ["/missions/parade", /\/missions\/parade\/thanksgiving-2026$/],
  ] as const) {
    await page.goto(from);
    await expect(page).toHaveURL(to);
  }
});

test("clicking anywhere on a mission card launches it", async ({ page }) => {
  await page.goto("/missions");
  const card = page.getByRole("listitem").filter({ hasText: "Thanksgiving 2026 Parade" });
  await card.click({ position: { x: 60, y: 60 } });
  await expect(page).toHaveURL(/\/missions\/parade\/thanksgiving-2026$/);
});

test("the parade controls fit one line on the narrowest phone, without sideways scroll", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/missions/parade/thanksgiving-2026");
  await page.getByTestId("parade-start").click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  const tops = await page.getByTestId("parade-controls").locator("button").evaluateAll((all) => all.map((b) => Math.round(b.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test("breadcrumbs lead from a mission back to Missions", async ({ page }) => {
  for (const path of ["/missions/lunar-south-pole", "/missions/parade/thanksgiving-2026"]) {
    await page.goto(path);
    await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Missions" }).click();
    await expect(page).toHaveURL(/\/missions$/);
  }
});

test("the header keeps the space in Furball Frenzy", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/missions");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link").first()).toHaveText("Furball Frenzy", { useInnerText: true, ignoreCase: true });
});

test("opening Missions folds the other tabs away", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, "the folder tabs show on wide screens");
  await page.goto("/missions");
  await expect(page.getByTestId("folding-tab")).toHaveCount(4);
  await expect(page.getByText("Origin stories")).toBeHidden({ timeout: 10_000 });
});
