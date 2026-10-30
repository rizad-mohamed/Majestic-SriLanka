import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("deliverables/screenshots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
  ["narrow", 320, 800],
  ["reference-width", 2409, 1350],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (const image of document.querySelectorAll("img"))
      image.loading = "eager";
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((image) =>
        image.decode().catch(() => {}),
      ),
    );
  });
  await page.screenshot({
    path: `deliverables/screenshots/home-${name}.png`,
    fullPage: true,
    style: '.deferred-section { content-visibility: visible !important; }',
  });
  if (name === "desktop") {
    await page.screenshot({
      path: "deliverables/screenshots/home-desktop-fold.png",
    });
    for (const selector of [
      ".story-section",
      ".featured-section",
      ".experience-section",
      ".why-section",
      ".testimonials-section",
      ".closing-cta",
    ]) {
      await page
        .locator(selector)
        .screenshot({
          path: `deliverables/screenshots/${selector.slice(1)}.png`,
        });
    }
  }
  results.push(
    await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      pageHeight: document.documentElement.scrollHeight,
      h1: getComputedStyle(document.querySelector("h1")).fontFamily,
      images: document.images.length,
      broken: Array.from(document.images)
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.src),
    })),
  );
  await page.close();
}
await browser.close();
const densityBrowser = await chromium.launch({
  channel: "chrome",
  headless: true,
});
const densityPage = await densityBrowser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2409 / 1440,
});
await densityPage.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await densityPage.evaluate(async () => {
  for (const img of document.images) img.loading = "eager";
  await document.fonts.ready;
  await Promise.all(
    Array.from(document.images).map((img) => img.decode().catch(() => {})),
  );
});
await densityPage.screenshot({
  path: "deliverables/screenshots/home-reference-density.png",
  fullPage: true,
  style: '.deferred-section { content-visibility: visible !important; }',
});
await densityBrowser.close();
await writeFile(
  "deliverables/screenshots/measurements.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results));
