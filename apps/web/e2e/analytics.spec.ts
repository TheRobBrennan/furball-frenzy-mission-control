import { expect, test } from "@playwright/test";

test("settings opens the analytics toggle and preserves the browser preference", async ({ page }) => {
  await page.goto("/missions/lunar-south-pole");
  const settings = page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "Settings", exact: true });
  const toggle = page.getByRole("switch", { name: "Analytics" });
  await expect(toggle).toBeHidden();
  await settings.click();
  await expect(toggle).toBeChecked();
  await toggle.click();
  await expect(toggle).not.toBeChecked();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeHidden();

  await page.reload();
  await settings.click();
  await expect(toggle).not.toBeChecked();
  await page.goto("/missions/lunar-south-pole?analytics=on");
  await settings.click();
  await expect(toggle).toBeChecked();
  await page.goto("/missions/lunar-south-pole?analytics=off");
  await settings.click();
  await expect(toggle).not.toBeChecked();
  await page.goto("/privacy");
  await expect(settings).toHaveCount(0);
  await expect(toggle).toHaveCount(0);
});

test("home exposes settings in the mission navigation", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("ff-promo-seen", "1"));
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Mission menu" });
  const gear = nav.getByRole("button", { name: "Settings", exact: true });
  await gear.click();
  await expect(page.getByRole("switch", { name: "Analytics" })).toBeVisible();
  const panel = page.getByRole("region", { name: "Settings" });
  await expect(panel).toBeInViewport({ ratio: 1 });
  await expect(panel.getByRole("link", { name: "Privacy policy" })).toHaveAttribute("href", "/privacy");
  await expect(panel.getByRole("link", { name: "Terms of use" })).toHaveAttribute("href", "/terms");
  const panelBox = (await panel.boundingBox())!;
  const gearBox = (await gear.boundingBox())!;
  expect(panelBox.y).toBeGreaterThanOrEqual(gearBox.y + gearBox.height);
  expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});
