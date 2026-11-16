// Builds the 7 slide PDF deck from deck.html into apps/web/public/demo/furball-frenzy-deck.pdf.
// Run from the repo root after pnpm install in apps/web: node docs/submission/build-deck.mjs
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("../../apps/web/node_modules/@playwright/test");
import { fileURLToPath } from "node:url";
const html = fileURLToPath(new URL("./deck.html", import.meta.url));
const out = fileURLToPath(new URL("../../apps/web/public/demo/furball-frenzy-deck.pdf", import.meta.url));
const browser = await chromium.launch({ channel: process.env.CI ? undefined : "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto("file://" + html);
await page.waitForTimeout(800);
await page.pdf({ path: out, width: "1280px", height: "720px", printBackground: true });
await browser.close();
console.log("wrote", out);
