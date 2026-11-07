import { test, expect } from "@playwright/test";
import { startRedirectHost } from "../helpers/redirect-host";

const routes = [
  "/",
  "/itineraries/",
  "/gallery/",
  "/tailor-made/",
  "/experiences/",
  "/about-us/",
  "/plan-your-trip/",
  "/contact-us/",
];
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

test("header stays aligned across desktop and menu breakpoints on every route", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Full width matrix runs once; route smoke tests cover every browser profile.",
  );
  test.setTimeout(240000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [
    320, 375, 390, 768, 1000, 1001, 1024, 1100, 1101, 1200, 1280, 1350, 1351,
    1440, 1920,
  ]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const measurements = await page
        .locator(".site-header")
        .evaluate((header) => {
          const items = [
            ...header.querySelectorAll<HTMLElement>(
              ".brand,.desktop-nav,.header-actions",
            ),
          ]
            .filter((el) => getComputedStyle(el).display !== "none")
            .map((el) => {
              const r = el.getBoundingClientRect();
              return {
                left: r.left,
                right: r.right,
                top: r.top,
                bottom: r.bottom,
              };
            });
          return {
            items,
            overflow: document.documentElement.scrollWidth > innerWidth,
            links: [...header.querySelectorAll(".desktop-nav a")].map(
              (el) => el.getBoundingClientRect().height,
            ),
          };
        });
      expect(measurements.overflow, `${route} at ${width}`).toBe(false);
      for (const [i, box] of measurements.items.entries()) {
        expect(box.left).toBeGreaterThanOrEqual(0);
        expect(box.right).toBeLessThanOrEqual(width);
        if (measurements.items[i + 1])
          expect(box.right).toBeLessThanOrEqual(measurements.items[i + 1].left);
      }
      if (width > 1100) {
        await expect(page.locator(".desktop-nav")).toBeVisible();
        expect(measurements.links.every((h) => h === 44)).toBe(true);
      } else await expect(page.locator(".desktop-nav")).toBeHidden();
      await expect(
        page.getByRole("button", { name: "Open navigation menu" }),
      ).toBeVisible();
      if (
        route !== "/contact-us/" &&
        route !== "/plan-your-trip/" &&
        width > 1100
      )
        await expect(
          page.locator('.desktop-nav [aria-current="page"]'),
        ).toHaveAttribute("href", route);
    }
  }
});

test("legacy tour URLs redirect directly with query and fragment preserved", async ({
  page,
  request,
  baseURL,
}) => {
  const host = await startRedirectHost(baseURL!, "dist");
  try {
    for (const route of ["/tours", "/tours/"]) {
      const response = await request.get(
        host.url + route + "?utm_source=legacy",
        { maxRedirects: 0 },
      );
      expect(response.status()).toBe(301);
      expect(response.headers().location).toBe(
        "/itineraries/?utm_source=legacy",
      );
      const destination = await request.get(
        host.url + response.headers().location,
        { maxRedirects: 0 },
      );
      expect(destination.status()).toBe(200);
    }
    await page.goto(host.url + "/tours/?utm_source=legacy#cultural-triangle");
    await expect(page).toHaveURL(
      host.url + "/itineraries/?utm_source=legacy#cultural-triangle",
    );
    await expect(page.locator("h1")).toContainText("Journeys to");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/itineraries\/$/,
    );
    expect(await page.locator('a[href*="/tours"]').count()).toBe(0);
  } finally {
    await host.close();
  }
});

test("itinerary gallery uses a seamless transform loop and native manual browsing", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/itineraries/");
  const gallery = page.locator("[data-guest-gallery]");
  const track = gallery.locator(".guest-gallery-track");
  const viewport = gallery.locator(".guest-gallery-window");
  await gallery.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations().length))
    .toBe(1);
  const first = gallery
    .locator(".guest-gallery-group")
    .first()
    .locator("figure")
    .first();
  const x = (await first.boundingBox())!.x;
  await expect
    .poll(async () => (await first.boundingBox())!.x)
    .toBeLessThan(x - 5);
  await gallery.getByRole("button", { name: "Pause gallery" }).click();
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations().length))
    .toBe(0);
  const still = (await first.boundingBox())!.x;
  await page.waitForTimeout(300);
  expect((await first.boundingBox())!.x).toBeCloseTo(still, 0);
  await viewport.focus();
  const scroll = await viewport.evaluate((el) => el.scrollLeft);
  await viewport.press("ArrowRight");
  await expect
    .poll(() => viewport.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(scroll);
  await gallery.getByRole("button", { name: "Play gallery" }).click();
  await page.mouse.move(0, 0);
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations().length))
    .toBe(1);
  const seam = await track.evaluate(async (el) => {
    const animation = el.getAnimations()[0];
    animation.pause();
    const duration = Number(animation.effect!.getTiming().duration);
    animation.currentTime = duration - 100;
    await new Promise(requestAnimationFrame);
    const copy = el
      .querySelectorAll(".guest-gallery-group")[1]
      .querySelector("img")!;
    const before = {
      left: copy.getBoundingClientRect().left,
      src: copy.getAttribute("src"),
    };
    animation.currentTime = duration + 100;
    await new Promise(requestAnimationFrame);
    const original = el.querySelector("img")!;
    return {
      before,
      after: {
        left: original.getBoundingClientRect().left,
        src: original.getAttribute("src"),
      },
    };
  });
  expect(seam.before.src).toBe(seam.after.src);
  expect(seam.before.left - seam.after.left).toBeCloseTo(7, 0);
  await expect(
    gallery.locator('.guest-gallery-group[aria-hidden="true"]'),
  ).toHaveCount(1);
});

test("reduced-motion and no-JavaScript visitors can browse the original gallery", async ({
  page,
  browser,
  baseURL,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/itineraries/");
  const track = page.locator(".guest-gallery-track");
  await track.scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "Pause gallery" }),
  ).toBeHidden();
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations().length))
    .toBe(0);
  const first = track.locator("img").first();
  const still = (await first.boundingBox())!.x;
  await page.waitForTimeout(250);
  expect((await first.boundingBox())!.x).toBeCloseTo(still, 0);
  // Media-query delivery and animation cancellation settle asynchronously in WebKit.
  // Also verify changing the preference stops an already running gallery.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.mouse.move(0, 0);
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations().length))
    .toBe(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations().length))
    .toBe(0);
  await expect(
    page.getByRole("button", { name: "Pause gallery" }),
  ).toBeHidden();
  await expect(
    page.locator('.guest-gallery-group[aria-hidden="true"]'),
  ).toBeHidden();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto(baseURL + "/itineraries/");
  await expect(staticPage.locator(".guest-gallery-group")).toHaveCount(1);
  expect(await staticPage.locator(".guest-gallery-group img").count()).toBe(69);
  await context.close();
});
