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

test("the case starts closed, and opening it shows the sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-binder", "closed");
  await expect(page.locator("#classified")).toBeHidden();
  await expect(page.locator("#footer")).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  // On a phone the case button lives in the Mission menu sheet.
  if (page.viewportSize()!.width < 640) await page.getByRole("button", { name: /mission menu/i }).click();
  await page.getByRole("link", { name: /^open the case$/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-binder", "open");
  await expect(page.locator("#classified")).toBeVisible({ timeout: 8000 });
});

test("a link to a section opens the case, and an older link still works", async ({ page }) => {
  await page.goto("/#origin-stories");
  await expect(page.locator("html")).toHaveAttribute("data-binder", "open");
  await page.goto("/?older#stories");
  await expect(page.locator("html")).toHaveAttribute("data-binder", "open");
});

test("every binder tab points at a section on the page", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator('nav a[href^="#"]').evaluateAll((els) => els.map((el) => el.getAttribute("href")!));
  const sections = hrefs.filter((h) => h !== "#top" && h !== "#footer");
  expect(sections.length).toBeGreaterThanOrEqual(4);
  for (const href of sections) await expect(page.locator(href)).toHaveCount(1);
});


test("the hero's Meet the crew button lands on the crew lists", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /meet the crew/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-binder", "open");
  await expect(page.locator("#meet-the-crew")).toBeInViewport({ timeout: 10_000 });
  await expect(page.getByRole("heading", { name: /^crew$/i }).first()).toBeInViewport();
});

test("the privacy and terms pages open from the footer on the home page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Legal" }).getByRole("link", { name: "Privacy" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
  await page.getByRole("navigation", { name: "Legal" }).getByRole("link", { name: "Terms" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Terms" })).toBeVisible();
});
