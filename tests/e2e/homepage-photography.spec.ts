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
  expect(await photos.count()).toBeGreaterThanOrEqual(11);
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
  await expect(page.locator(".ella-original")).toHaveAttribute(
    "src",
    /guests\/img_6747\.webp/,
  );
  const footer = page.locator('.closing-cta img[data-photo="tropical-cta"]');
  await expect(footer).toHaveAttribute(
    "src",
    "/assets/majestic-sri-lanka/photography/tropical-cta-720.webp",
  );
  expect(await footer.getAttribute("data-photo-collection")).toBeNull();
  expect(oldPhotoRequests.length).toBeGreaterThan(0);
  expect(
    oldPhotoRequests.every((url) =>
      /\/photography\/(?:tropical-cta|ella-side-extensions)-\d+\.webp$/.test(
        url,
      ),
    ),
  ).toBe(true);
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
    "/gallery/",
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
