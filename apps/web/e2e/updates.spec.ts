import { expect, test } from "@playwright/test";

test("the Stay updated box loads nothing from Flodesk until asked, then loads its form script", async ({ page }) => {
  const flodesk: string[] = [];
  page.on("request", (r) => {
    if (/flodesk\.com/.test(r.url())) flodesk.push(r.url());
  });
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  await page.goto("/missions/lunar-south-pole");
  await page.getByTestId("stay-updated").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  expect(flodesk).toEqual([]);
  // Nothing in the invitation is cut off at the right edge, at desktop and phone width.
  const card = await page.getByTestId("stay-updated").boundingBox();
  expect(card!.x + card!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.getByTestId("stay-updated-open").click();
  await expect(page.getByTestId("stay-updated-dialog")).toBeVisible();
  await expect(page.getByTestId("stay-updated-close")).toBeInViewport();
  await expect(page.getByTestId("stay-updated-form")).toBeVisible();
  await expect(page.locator("script[src*='assets.flodesk.com/universal']").first()).toBeAttached();
  await page.getByTestId("stay-updated-close").click();
  await expect(page.getByTestId("stay-updated-dialog")).toBeHidden();
});

test("the thank you page opens, for Flodesk to send new subscribers to", async ({ page }) => {
  await page.goto("/thanks");
  await expect(page.getByRole("heading", { level: 1, name: "Thank you!" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Watch a mission" })).toBeVisible();
  await expect(page.getByTestId("stay-updated")).toHaveCount(0);
  // The photo of the furballs is on screen, not only text.
  await expect(page.getByTestId("thanks-photo")).toBeInViewport();
});

test("on the home page the Stay updated box is under the Polaroid on a wide screen, and under the headline on a phone", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  await page.goto("/");
  const box = page.locator('[data-testid="stay-updated"]:visible');
  await expect(box).toHaveCount(1);
  const card = await box.boundingBox();
  const width = page.viewportSize()!.width;
  expect(card!.x + card!.width).toBeLessThanOrEqual(width);
  if (width >= 1024) {
    // Wide: in the column under the Polaroid, which is on the right.
    const polaroid = await page.locator("figure").first().boundingBox();
    expect(card!.y).toBeGreaterThan(polaroid!.y);
    expect(card!.x).toBeGreaterThanOrEqual(width / 2 - 20);
  } else {
    // Phone: after the Start the mission buttons, not before the headline.
    const headline = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(card!.y).toBeGreaterThan(headline!.y);
  }
});

test("the hero text starts at the top, level with the Polaroid, not centered against a taller column", async ({ page }) => {
  test.skip(page.viewportSize()!.width < 1024, "the hero is one column on a phone");
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  await page.goto("/");
  const eyebrow = await page.getByText("Space Apps 2026").first().boundingBox();
  const polaroid = await page.locator("figure").first().boundingBox();
  // The first line of text is within 120px of the top of the Polaroid, instead of hundreds of pixels lower.
  expect(Math.abs(eyebrow!.y - polaroid!.y)).toBeLessThan(120);
});

for (const path of ["/", "/missions/lunar-south-pole"]) {
  test(`at 320 wide nothing in the hero or the Stay updated box is cut off on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
    await page.goto(path);
    const box = page.locator('[data-testid="stay-updated"]:visible');
    await box.scrollIntoViewIfNeeded();
    // The page hides overflow, so check element edges instead of scroll width.
    const targets = [box, box.getByTestId("stay-updated-crew").locator(":scope > *").last()];
    if (path === "/") targets.push(page.getByRole("link", { name: "Start the mission" }), page.getByRole("link", { name: "Meet the crew" }));
    for (const target of targets) {
      await expect(async () => {
        const b = await target.boundingBox();
        expect(b!.x).toBeGreaterThanOrEqual(0);
        expect(b!.x + b!.width).toBeLessThanOrEqual(320);
      }).toPass();
    }
    // The crew row fits inside the card too.
    const row = box.getByTestId("stay-updated-crew");
    expect(await row.evaluate((e) => e.scrollWidth - e.clientWidth)).toBeLessThanOrEqual(0);
  });
}
