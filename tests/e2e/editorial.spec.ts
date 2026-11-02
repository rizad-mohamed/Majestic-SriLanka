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

test("planner map adds interests without losing the traveller's form details", async ({
  page,
}) => {
  await page.goto("/plan-your-trip/");
  await page.getByLabel("Your name").fill("Alex Traveller");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.getByLabel("Approximate arrival").fill("2099-02-28");
  await page.locator("#notes").fill("Slow mornings and local food.");
  const disclosure = page.locator(".planner-map-disclosure");
  const compact = (page.viewportSize()?.width || 0) <= 1100;
  await expect(disclosure).toHaveJSProperty("open", !compact);
  if (compact) await disclosure.locator(":scope > summary").click();
  await disclosure.locator('[data-place="galle"] summary').click();
  await disclosure
    .locator('[data-place="galle"]')
    .getByRole("link", { name: "Add this interest" })
    .click();
  await expect(page).toHaveURL("/plan-your-trip/");
  await expect(
    page.getByRole("checkbox", { name: "Beaches & Coast", exact: true }),
  ).toBeChecked();
  await expect(page.locator("#map-interest-status")).toHaveText(
    "Beaches & Coast added to your interests.",
  );
  await expect(page.getByLabel("Your name")).toHaveValue("Alex Traveller");
  await expect(page.getByLabel("Email address")).toHaveValue(
    "alex@example.com",
  );
  await expect(page.locator("#notes")).toHaveValue(
    "Slow mornings and local food.",
  );
  await expect(page.locator("#consent")).not.toBeChecked();
  await page.locator("#consent").check();
  await page.getByRole("button", { name: "Create My Travel Brief" }).click();
  await expect(page.locator("#brief-text")).toContainText("Beaches & Coast");
  await expect(page.locator("#brief-text")).toContainText(
    "Slow mornings and local food.",
  );
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
    "/tours/",
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
      ".tour-image img, .editorial-photo-main, .experience-detail > img",
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
  const sigiriya = page.locator(
    '[data-tour-track] [data-photo="cultural-triangle"]',
  );
  const before = await sigiriya.evaluate(
    (image) => getComputedStyle(image).objectPosition,
  );
  await page.getByRole("button", { name: "Next featured tour" }).click();
  const after = await sigiriya.evaluate(
    (image) => getComputedStyle(image).objectPosition,
  );
  expect(before).toBe("74% 50%");
  expect(after).toBe(before);
  await expect(
    page
      .locator("[data-tour-track] article")
      .first()
      .locator(".tour-image img"),
  ).toHaveCSS("object-position", "50% 56%");
});
