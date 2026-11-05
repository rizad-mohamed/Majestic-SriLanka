import { test, expect } from "@playwright/test";

const slides = ["hero-sigiriya", "hill-country", "southern-coast"];

test("homepage photographs decode from the licensed collection, including every slideshow image", async ({
  page,
}) => {
  const oldPhotoRequests: string[] = [];
  page.on("request", (request) => {
    if (/\/majestic-sri-lanka\/photography\//.test(request.url()))
      oldPhotoRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(async () => {
    const images = [
      ...document.querySelectorAll<HTMLImageElement>("img[data-photo]"),
    ];
    for (const image of images) image.loading = "eager";
    await Promise.all(images.map((image) => image.decode()));
  });
  const photos = page.locator(
    'img[data-photo]:not([data-photo="tropical-cta"])',
  );
  expect(await photos.count()).toBeGreaterThanOrEqual(12);
  for (const photo of await photos.all()) {
    await expect(photo).toHaveAttribute("data-photo-collection", "homepage");
    await expect(photo).toHaveJSProperty("complete", true);
    expect(
      await photo.evaluate((image: HTMLImageElement) => image.currentSrc),
    ).toContain("/homepage/");
  }
  for (const name of slides) {
    await page.locator(`[data-slide="${name}"]`).click();
    const active = page.locator("[data-hero-current]");
    await expect(active).toHaveAttribute("data-photo", name);
    await active.evaluate((image: HTMLImageElement) => image.decode());
    expect(
      await active.evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBeGreaterThan(0);
    expect(
      await active.evaluate((image: HTMLImageElement) => image.currentSrc),
    ).toContain("/homepage/");
  }
  const footer = page.locator('.closing-cta img[data-photo="tropical-cta"]');
  await expect(footer).toHaveAttribute(
    "src",
    "/assets/majestic-sri-lanka/photography/tropical-cta-720.webp",
  );
  expect(await footer.getAttribute("data-photo-collection")).toBeNull();
  expect(oldPhotoRequests.length).toBeGreaterThan(0);
  expect(
    oldPhotoRequests.every((url) =>
      /\/photography\/tropical-cta-\d+\.webp$/.test(url),
    ),
  ).toBe(true);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/homepage\/photography\/hero-sigiriya-/,
  );
});

test("all three photographs retain a working WebP fallback when AVIF is unavailable", async ({
  page,
}) => {
  await page.route("**/", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      /<source\b(?=[^>]*type="image\/avif")[^>]*>/g,
      "",
    );
    await route.fulfill({ response, body });
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const name of slides) {
    await page.locator(`[data-slide="${name}"]`).click();
    const active = page.locator("[data-hero-current]");
    await expect(active).toHaveAttribute("data-photo", name);
    await active.evaluate((image: HTMLImageElement) => image.decode());
    expect(
      await active.evaluate((image: HTMLImageElement) => image.currentSrc),
    ).toMatch(/\/homepage\/.*\.webp$/);
  }
});

test("shared photos and social images on the six other routes retain their approved collection", async ({
  page,
}) => {
  for (const route of [
    "/tours/",
    "/tailor-made/",
    "/experiences/",
    "/about-us/",
    "/plan-your-trip/",
    "/contact-us/",
  ]) {
    await page.goto(route);
    await expect(
      page.locator('[data-photo-collection="homepage"]'),
    ).toHaveCount(0);
    for (const photo of await page.locator("img[data-photo]").all())
      expect(await photo.getAttribute("src")).not.toContain("/homepage/");
    expect(
      await page.locator('meta[property="og:image"]').getAttribute("content"),
    ).not.toContain("/homepage/");
  }
});
