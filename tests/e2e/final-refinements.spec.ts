import { test, expect } from "@playwright/test";

test("requested widths use a desktop spine and compact horizontal navigation without changing alternation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/experiences/");
    await page.evaluate(() => document.fonts.ready);
    const sections = page.locator(".experience-detail");
    await expect(sections).toHaveCount(5);
    for (let index = 0; index < 5; index++) {
      const row = sections.nth(index);
      const photo = (await row.locator(".experience-collage").boundingBox())!;
      const copy = (await row.locator(".experience-copy").boundingBox())!;
      expect(photo.width).toBeGreaterThan(100);
      expect(copy.width).toBeGreaterThan(100);
      expect(index % 2 === 0 ? photo.x < copy.x : photo.x > copy.x).toBe(true);
      if (width > 1100) {
        const marker = row.locator(".journey-marker");
        const box = (await marker.boundingBox())!;
        expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThan(1);
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
        const left = index % 2 === 0 ? photo : copy;
        const right = index % 2 === 0 ? copy : photo;
        expect(left.x + left.width).toBeLessThanOrEqual(box.x - 7);
        expect(right.x).toBeGreaterThanOrEqual(box.x + box.width + 7);
        const rowBox = (await row.boundingBox())!;
        expect(
          Math.abs(box.y + box.height / 2 - rowBox.y - rowBox.height / 2),
        ).toBeLessThan(1);
      } else {
        await expect(row.locator(".journey-marker")).toBeHidden();
        expect(
          await row.evaluate((el) => getComputedStyle(el, "::before").display),
        ).toBe("none");
        if (width <= 700)
          await expect(row.locator(".experience-copy > p").nth(1)).toHaveCSS(
            "font-size",
            "16px",
          );
      }
    }
    const navigation = page.locator("[data-journey-nav]");
    if (width > 1100) {
      await expect(navigation).toBeHidden();
      await expect(page.locator(".journey-spine")).toBeVisible();
    } else {
      await expect(navigation).toBeVisible();
      await expect(page.locator(".journey-spine")).toBeHidden();
      await expect(navigation).toHaveCSS("position", "sticky");
      const links = navigation.locator("[data-journey-link]");
      await expect(links).toHaveCount(5);
      const boxes = await links.evaluateAll((els) =>
        els.map((el) => {
          const b = el.getBoundingClientRect();
          return { x: b.x, y: b.y, width: b.width, height: b.height };
        }),
      );
      for (const box of boxes) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(Math.abs(box.y - boxes[0].y)).toBeLessThan(1);
      }
      const track = (await navigation.locator(".journey-track").boundingBox())!;
      expect(track.height).toBe(2);
      expect(track.width).toBeGreaterThan(width * 0.5);
      const stops = await navigation
        .locator(".journey-stop")
        .evaluateAll((els) =>
          els.map((el) => {
            const b = el.getBoundingClientRect();
            return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
          }),
        );
      expect(Math.abs(track.x - stops[0].x)).toBeLessThan(1);
      expect(Math.abs(track.x + track.width - stops[4].x)).toBeLessThan(1);
      expect(Math.abs(track.y - stops[0].y)).toBeLessThan(1);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.goto("/");
    await page.addStyleTag({
      content: ".deferred-section { content-visibility: visible !important; }",
    });
    if (width <= 700) {
      for (const heading of await page.locator("main h1, main h2").all())
        await expect(heading).toHaveCSS("text-align", "center");
      for (const button of await page
        .locator(".story-copy > .button, .closing-cta .button")
        .all()) {
        const box = (await button.boundingBox())!;
        expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThan(1);
      }
      await expect(page.locator(".review-card blockquote").first()).toHaveCSS(
        "text-align",
        "center",
      );
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.goto("/plan-your-trip/");
    await expect(page.locator(".planner-process li")).toHaveCount(3);
    await expect(
      page.locator(
        ".planner-process details, .trip-form .travel-map, .interest-options",
      ),
    ).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
});

test("planning instructions remain expanded without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  });
  try {
    const page = await context.newPage();
    await page.goto("/plan-your-trip/");
    for (const step of await page.locator(".planner-process li").all())
      await expect(step).toBeVisible();
    await expect(
      page.locator(".trip-form .travel-map, .interest-options"),
    ).toHaveCount(0);
    await expect(page.getByLabel("Your name")).toBeVisible();
  } finally {
    await context.close();
  }
});
