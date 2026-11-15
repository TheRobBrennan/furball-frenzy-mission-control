import { chromium } from "/Users/rob/repos/furball-frenzy-mission-control/apps/web/node_modules/@playwright/test/index.mjs";
import fs from "node:fs";
const browser = await chromium.launch({ channel: "chrome", args: ["--mute-audio"] });
const dir = "/tmp/claude-501/demo/raw";
const log = [];
// Clip A: the home page and the trailer
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir, size: { width: 1280, height: 720 } } });
  const page = await ctx.newPage();
  const t0 = Date.now();
  await page.addInitScript(() => { try { localStorage.setItem("ff-story-sound", "off"); } catch {} });
  await page.goto("http://localhost:3000/"); await page.waitForTimeout(3500);
  await page.getByTestId("promo").waitFor({ timeout: 10000 }); await page.waitForTimeout(6500);
  log.push(["A-end", Date.now() - t0]);
  await ctx.close();
}
// Clip B: Judges, start here, the whole mission
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir, size: { width: 1280, height: 720 } } });
  const page = await ctx.newPage();
  await page.addInitScript(() => { try { localStorage.setItem("ff-story-sound", "off"); localStorage.setItem("ff-story-speed", "2"); localStorage.setItem("ff-story-hold", "1"); localStorage.setItem("ff-story-trouble", "continue:0"); sessionStorage.setItem("ff-promo-seen", "1"); } catch {} });
  const t0 = Date.now();
  await page.goto("http://localhost:3000/mission?judges=1");
  let last = "";
  const deadline = Date.now() + 240000;
  while (Date.now() < deadline) {
    const title = await page.getByTestId("scene-title").textContent({ timeout: 500 }).catch(() => "");
    const key = title || (await page.getByTestId("judges-line").textContent().catch(() => "")).slice(0, 30);
    if (key !== last) { log.push([key, Date.now() - t0]); last = key; }
    if (title === "Mission success!") break;
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(2500);
  await page.getByRole("button", { name: /see the debrief/i }).click();
  await page.waitForTimeout(500);
  log.push(["debrief-click", Date.now() - t0]);
  await page.getByTestId("real-mission").scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(4500);
  log.push(["B-end", Date.now() - t0]);
  await ctx.close();
}
await browser.close();
fs.writeFileSync("/tmp/claude-501/demo/log.json", JSON.stringify(log, null, 1));
console.log(JSON.stringify(log));
