import { expect, test } from "@playwright/test";

// The trailer pop-up has its own test, the others skip it.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("ff-promo-seen", "1");
    } catch {
      // No storage, nothing to skip.
    }
  });
});

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

test("closing the case brings the visitor back to the top", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/#origin-stories");
  await expect(page.locator("html")).toHaveAttribute("data-binder", "open");
  await expect(page.locator("#origin-stories")).toBeVisible({ timeout: 10_000 });
  if (page.viewportSize()!.width < 640) await page.getByRole("button", { name: /mission menu/i }).click();
  await page.getByRole("link", { name: /^close the case$/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-binder", "closed", { timeout: 15_000 });
  // After the roll-up, the page is back at the top, on the cover.
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 20_000 }).toBeLessThan(60);
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


test("on a phone nothing is left blank for a reveal, and a tab opens the case and scrolls to its section at once", async ({ page }) => {
  test.skip(page.viewportSize()!.width >= 640, "the quick case is the phone behavior");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-binder", "closed");
  await page.getByRole("button", { name: /mission menu/i }).click();
  const started = Date.now();
  await page.getByRole("link", { name: /^launch sites$/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-binder", "open");
  await expect(page.locator("#launch-sites")).toBeInViewport({ timeout: 4000 });
  // It took a moment, not the three seconds the desktop roller takes.
  expect(Date.now() - started).toBeLessThan(4000);
  // No block is hidden waiting for a reveal, so there is no blank space between the photos.
  expect(await page.locator('[data-reveal="armed"]').evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity === "0").length)).toBe(0);
  await page.locator("#launch-sites").scrollIntoViewIfNeeded();
  const opacity = await page.locator("#launch-sites").evaluate((e) => getComputedStyle(e).opacity);
  expect(opacity).toBe("1");
});

test("on a phone the photo polaroids sit close together, not a screenful apart", async ({ page }) => {
  test.skip(page.viewportSize()!.width >= 640, "the gallery is a single column only on a phone");
  await page.goto("/#launch-sites");
  await expect(page.locator("html")).toHaveAttribute("data-binder", "open");
  await page.waitForTimeout(1500);
  const photos = page.locator('section[aria-label="The Polish elephants"] figure.polaroid');
  await expect(photos.first()).toBeAttached();
  await photos.first().evaluate((e) => e.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(800);
  const gaps = await photos.evaluateAll((els) => {
    const boxes = els.map((e) => e.getBoundingClientRect()).sort((a, b) => a.top - b.top);
    return boxes.slice(1).map((b, i) => Math.round(b.top - boxes[i].bottom));
  });
  expect(gaps.length).toBeGreaterThan(1);
  for (const g of gaps) expect(g).toBeLessThan(40);
});

// Every tab on the menu, on a phone and a laptop: it opens the case, lands on its own section, and that section is really visible, never blank.
const tabs = ["the-brief", "classified", "launch-sites", "origin-stories"];
for (const id of tabs) {
  test(`the ${id} tab opens its section, visible and filled, not blank, within a few seconds`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.addInitScript(() => sessionStorage.setItem("ff-elephants-cleared", "1"));
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-binder", "closed");
    if (page.viewportSize()!.width < 640) await page.getByRole("button", { name: /mission menu/i }).click();
    const tab = page.locator(`a[href="#${id}"]:visible`).first();
    await tab.click();
    await expect(page.locator("html")).toHaveAttribute("data-binder", "open");
    const section = page.locator(`#${id}`);
    await expect(section).toBeInViewport({ timeout: 12_000 });
    await expect.poll(async () => section.evaluate((e) => getComputedStyle(e).opacity), { timeout: 6000 }).toBe("1");
    // The section has real content in it, not just empty space.
    const box = await section.boundingBox();
    expect(box!.height).toBeGreaterThan(150);
    expect(await section.innerText()).not.toBe("");
  });
}

test("on a phone no section is ever left invisible after the case opens, from top to bottom", async ({ page }) => {
  test.skip(page.viewportSize()!.width >= 640, "the phone behavior");
  test.setTimeout(90_000);
  await page.goto("/#launch-sites");
  await expect(page.locator("html")).toHaveAttribute("data-binder", "open");
  await page.waitForTimeout(1500);
  // Scroll the whole page the way a thumb would, then every block must be visible.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity !== "1").map((e) => (e as HTMLElement).id || e.getAttribute("aria-label") || e.tagName),
  );
  expect(hidden).toEqual([]);
});

// Found on a real iPhone: from deep in the page, Cover in the menu closed the menu and went nowhere.
test("from Launch sites, Cover in the menu takes the visitor back to the top, and the other tabs go where they say", async ({ page }) => {
  test.setTimeout(90_000);
  await page.addInitScript(() => sessionStorage.setItem("ff-elephants-cleared", "1"));
  await page.goto("/#launch-sites");
  await expect(page.locator("html")).toHaveAttribute("data-binder", "open");
  await expect(page.locator("#launch-sites")).toBeInViewport({ timeout: 12_000 });
  const phone = page.viewportSize()!.width < 640;
  const open = async () => {
    if (phone) await page.getByRole("button", { name: /^(mission menu|close)$/i }).click();
  };
  await open();
  await page.locator('a[href="#top"]:visible').first().click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 8000 }).toBeLessThan(60);
  await page.waitForTimeout(2000);
  for (const id of ["origin-stories", "the-brief", "launch-sites"]) {
    await open();
    await page.locator(`a[href="#${id}"]:visible`).first().click();
    await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 8000 });
    await page.waitForTimeout(2000);
  }
});
