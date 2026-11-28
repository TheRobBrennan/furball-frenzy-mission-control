import { expect, test } from "@playwright/test";

test("the ice show starts over when the rink comes back on screen", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  await page.goto("/#launch-sites");
  const rink = page.locator(".rink");
  const centre = () => rink.evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(page.getByRole("heading", { name: "Where the crew lives" })).toBeInViewport();
  await expect(async () => {
    await centre();
    await expect(rink).toHaveClass(/rink-go/, { timeout: 500 });
  }).toPass();
  // Mark this showing, scroll far away, and come back: a new showing has replaced it.
  await rink.evaluate((e) => e.setAttribute("data-first-show", ""));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(rink).not.toBeInViewport();
  await expect(async () => {
    await centre();
    await expect(rink).not.toHaveAttribute("data-first-show", /.*/, { timeout: 500 });
  }).toPass();
  await expect(rink).toHaveClass(/rink-go/);
});
