import { expect, test } from "@playwright/test";

// Needs a build with a form link, so it runs only when asked: E2E_FLODESK=1, against a build made with FLODESK_FORM_URL set.
test.skip(!process.env.E2E_FLODESK, "needs a build with FLODESK_FORM_URL set");

test("the Stay updated box links to the Flodesk form in a new tab, on the home page and the mission page", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  for (const path of ["/", "/mission"]) {
    await page.goto(path);
    const link = page.getByRole("link", { name: /send me the updates/i });
    await expect(link).toHaveAttribute("href", /^https:\/\/([a-z0-9-]+\.)?flodesk\.com\//);
    await expect(link).toHaveAttribute("target", "_blank");
  }
});
