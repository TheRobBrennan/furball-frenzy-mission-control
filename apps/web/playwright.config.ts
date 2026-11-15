import { defineConfig } from "@playwright/test";

// E2E tests at the two widths that matter, a phone (375 x 812) and a laptop (1280 x 800).
// By default Playwright starts `pnpm start` (build first, `pnpm build`). Point E2E_BASE_URL at a
// running site, such as `npr start` on http://localhost:3000, to test that instead.
// Locally the installed Chrome is used, CI installs Playwright's Chromium.
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const channel = process.env.CI ? undefined : "chrome";

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL, trace: "on-first-retry", channel },
  projects: [
    { name: "phone-375", use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
    { name: "desktop-1280", use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: "pnpm start", url: baseURL, reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
