import { expect, test } from "@playwright/test";

// Needs a build with a PostHog key, so it runs only when asked: E2E_ANALYTICS=1, against a build made with POSTHOG_KEY set.
test.skip(!process.env.E2E_ANALYTICS, "needs a build with POSTHOG_KEY set");

test("the analytics notice asks once, No is remembered, and nothing is sent", async ({ page }) => {
  const sent: string[] = [];
  page.on("request", (r) => {
    if (/posthog\.com/.test(r.url())) sent.push(r.url());
  });
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  await page.goto("/");
  const notice = page.getByTestId("analytics-consent");
  await expect(notice).toBeVisible({ timeout: 10_000 });
  await expect(notice).toBeInViewport();
  await page.getByTestId("analytics-no").click();
  await expect(notice).toBeHidden();
  await page.reload();
  await page.waitForTimeout(2500);
  await expect(notice).toBeHidden();
  expect(sent).toEqual([]);
});
