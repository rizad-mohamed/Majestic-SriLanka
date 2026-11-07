import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context, baseURL }) => {
  await context.addCookies([
    {
      name: "majestic_consent",
      value: encodeURIComponent(
        JSON.stringify({ version: 1, analytics: false }),
      ),
      url: baseURL!,
    },
  ]);
});

test("pages reflow across intermediate widths and phone landscape", async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 800 },
    { width: 600, height: 900 },
    { width: 820, height: 1180 },
    { width: 1024, height: 768 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of [
      "/",
      "/tours/",
      "/gallery/",
      "/tailor-made/",
      "/experiences/",
      "/about-us/",
      "/plan-your-trip/",
      "/contact-us/",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${route} at ${viewport.width}`,
      ).toBeLessThanOrEqual(viewport.width + 1);
      const heading = await page.locator("main h1").boundingBox();
      expect(heading!.x).toBeGreaterThanOrEqual(0);
      expect(heading!.x + heading!.width).toBeLessThanOrEqual(
        viewport.width + 1,
      );
    }
  }
});

test("gallery schedules animation only while visible and playing", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) =>
      original((time) => {
        performance.mark("test-animation-frame");
        callback(time);
      });
  });
  await page.goto("/tours/");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const frames = async () => {
    await page.evaluate(() => performance.clearMarks("test-animation-frame"));
    await page.waitForTimeout(300);
    return page.evaluate(
      () => performance.getEntriesByName("test-animation-frame").length,
    );
  };
  await page.waitForTimeout(300);
  expect(await frames()).toBeLessThanOrEqual(2);
  const viewport = page.locator(".guest-gallery-window");
  await viewport.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect.poll(frames).toBeGreaterThan(2);
  await page
    .getByRole("button", { name: "Pause gallery", exact: true })
    .click();
  expect(await frames()).toBeLessThanOrEqual(2);
  await page.getByRole("button", { name: "Play gallery", exact: true }).click();
  await expect.poll(frames).toBeGreaterThan(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await frames()).toBeLessThanOrEqual(2);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await viewport.dispatchEvent("touchstart");
  await viewport.dispatchEvent("touchend");
  await expect(
    page.getByRole("button", { name: "Play gallery", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(await frames()).toBeLessThanOrEqual(2);
});

test("landscape dialogs fit the viewport and keep their controls reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/plan-your-trip/");
  const before = await page.locator("header .brand").boundingBox();
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Your next chapter" });
  const box = await dialog.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(390);
  const after = await page.locator("header .brand").boundingBox();
  expect(Math.abs(after!.x - before!.x)).toBeLessThan(1);
  await dialog.getByRole("link", { name: "Contact Us" }).click();
  await expect(page).toHaveURL("/contact-us/");
});
