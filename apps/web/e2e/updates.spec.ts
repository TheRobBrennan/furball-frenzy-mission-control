import { expect, test } from "@playwright/test";

test("the Stay updated box loads nothing from Flodesk until asked, then loads its form script", async ({ page }) => {
  const flodesk: string[] = [];
  page.on("request", (r) => {
    if (/flodesk\.com/.test(r.url())) flodesk.push(r.url());
  });
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  await page.goto("/mission");
  await page.getByTestId("stay-updated").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  expect(flodesk).toEqual([]);
  // The invitation reads on one line, at desktop and phone width.
  const line = await page.getByTestId("stay-updated-line").boundingBox();
  expect(line!.height).toBeLessThan(30);
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
  await expect(page.getByRole("link", { name: "Watch a mission" })).toBeInViewport();
  await expect(page.getByTestId("stay-updated")).toHaveCount(0);
});

test("on the home page the Stay updated box sits just above the footer", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  await page.goto("/");
  const box = await page.getByTestId("stay-updated").boundingBox();
  const footer = await page.locator("#footer").boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(footer!.y);
  expect(footer!.y - (box!.y + box!.height)).toBeLessThan(200);
  await expect(page.getByTestId("stay-updated")).toHaveCount(1);
});
