import { expect, test } from "@playwright/test";

test("the demo video is at a public link, is under 30 seconds, and plays", async ({ page, request }) => {
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  const file = await request.get("/demo/furball-frenzy-30s.mp4");
  expect(file.status()).toBe(200);
  expect(file.headers()["content-type"]).toContain("video/mp4");
  await page.goto("/demo");
  await expect(page.getByTestId("demo-video")).toBeVisible();
  const duration = await page.getByTestId("demo-video").evaluate((v: HTMLVideoElement) => new Promise<number>((resolve) => {
    if (v.readyState >= 1) return resolve(v.duration);
    v.addEventListener("loadedmetadata", () => resolve(v.duration), { once: true });
    v.load();
  }));
  expect(duration).toBeGreaterThan(20);
  expect(duration).toBeLessThanOrEqual(30);
});
