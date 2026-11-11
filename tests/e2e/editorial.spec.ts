import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("destination map supports keyboard exploration and experience links", async ({
  page,
}) => {
  await page.goto("/tailor-made/");
  const map = page.locator(".travel-map");
  await expect(map.locator(".map-place[open] h3")).toHaveText(
    "Culture & Heritage",
  );
  const ella = map.locator('[data-place="ella"] summary');
  await ella.focus();
  await page.keyboard.press("Enter");
  await expect(map.locator(".map-place[open]")).toHaveCount(1);
  await expect(map.locator(".map-place[open] h3")).toHaveText(
    "Hill Country & Tea",
  );
  await expect(ella).toBeFocused();
  for (const marker of await map.locator("summary").all()) {
    const box = await marker.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  const results = await new AxeBuilder({ page })
    .include(".discovery-layout")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await map.locator(".map-place[open]").getByRole("link").click();
  await expect(page).toHaveURL("/experiences/#tea");
  await expect(page.locator("#tea-title")).toBeInViewport();
});

test("planner process stays expanded and form works without interest choices or a duplicate map", async ({
  page,
}) => {
  await page.goto("/plan-your-trip/");
  await expect(page.locator(".planner-process")).toHaveJSProperty(
    "tagName",
    "SECTION",
  );
  await expect(page.locator(".planner-process li")).toHaveCount(3);
  for (const step of await page.locator(".planner-process li").all())
    await expect(step).toBeVisible();
  await expect(
    page.locator(
      ".trip-form .travel-map, .interest-options, .planner-map-disclosure",
    ),
  ).toHaveCount(0);
  await expect(page.getByRole("checkbox")).toHaveCount(1);
  await page.getByLabel("Your name").fill("Alex Traveller");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.getByLabel("Approximate arrival").fill("2099-02-28");
  await page.locator("#notes").fill("Slow mornings and local food.");
  await page.locator("#consent").check();
  await page.getByRole("button", { name: "Create My Travel Brief" }).click();
  await expect(page.locator("#brief-text")).toContainText(
    "Slow mornings and local food.",
  );
  await expect(page.locator("#brief-text")).toContainText("Open to ideas");
});

test("map exploration still works without JavaScript and respects reduced motion", async ({
  browser,
  baseURL,
  page,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  });
  try {
    const fallback = await context.newPage();
    await fallback.goto("/tailor-made/");
    const map = fallback.locator(".travel-map");
    await map.locator('[data-place="galle"] summary').click();
    await expect(map.locator(".map-place[open] h3")).toHaveText(
      "Beaches & Coast",
    );
    await map.locator(".map-place[open]").getByRole("link").click();
    await expect(fallback).toHaveURL("/experiences/#beaches");
  } finally {
    await context.close();
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/tailor-made/");
  await page.locator('[data-place="ella"] summary').click();
  const motion = await page.locator(".travel-map").evaluate((element) => ({
    names: Array.from(element.querySelectorAll(".map-pin, .map-route")).map(
      (node) => getComputedStyle(node).animationName,
    ),
    // WebKit can report the global 0.01ms reduced-motion transition as
    // running until its next frame. Check its duration, not that frame's timing.
    runningDurations: element
      .getAnimations({ subtree: true })
      .filter((animation) => animation.playState === "running")
      .map((animation) => animation.effect?.getComputedTiming().duration),
  }));
  expect(motion.names.every((name) => name === "none")).toBe(true);
  for (const duration of motion.runningDurations) {
    expect(typeof duration).toBe("number");
    expect(duration).toBeLessThanOrEqual(1);
  }
});

test("content photographs keep a consistent landscape frame across routes", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/itineraries/",
    "/tailor-made/",
    "/experiences/",
    "/about-us/",
    "/contact-us/",
  ]) {
    await page.goto(route);
    await page.addStyleTag({
      content:
        ".deferred-section, .experience-detail { content-visibility: visible !important; }",
    });
    const photographs = page.locator(
      ".tour-image img:visible, .editorial-photo-main:visible, .experience-detail > img:visible",
    );
    for (const photo of await photographs.all()) {
      const metrics = await photo.evaluate((image) => {
        const box = image.getBoundingClientRect();
        const style = getComputedStyle(image);
        return { ratio: box.width / box.height, fit: style.objectFit };
      });
      expect(metrics.ratio, route).toBeCloseTo(5 / 3, 1);
      expect(metrics.fit, route).toBe("cover");
    }
    if (route === "/contact-us/" && (page.viewportSize()?.width || 0) <= 700) {
      const contact = await page.locator(".contact-grid").boundingBox();
      const copy = await page
        .locator(".contact-grid > div")
        .first()
        .boundingBox();
      expect(copy!.width).toBeGreaterThan(contact!.width * 0.95);
    }
  }
});

test("featured tour crops remain attached to the photograph when reordered", async ({
  page,
}) => {
  await page.goto("/");
  const wildlife = page.locator('[data-tour-track] [data-photo="wildlife"]');
  const before = await wildlife.evaluate(
    (image) => getComputedStyle(image).objectPosition,
  );
  await page.getByRole("button", { name: "Next featured tour" }).click();
  const after = await wildlife.evaluate(
    (image) => getComputedStyle(image).objectPosition,
  );
  expect(before).toBe("50% 50%");
  expect(after).toBe(before);
  await expect(
    page
      .locator("[data-tour-track] article")
      .first()
      .locator(".tour-image img"),
  ).toHaveAttribute("src", /experiences\/culture-720\.webp$/);
});
