import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
const origin = "https://seo-fixture.majesticsrilanka.com";
const routes = [
  "/",
  "/tours/",
  "/gallery/",
  "/tailor-made/",
  "/experiences/",
  "/about-us/",
  "/plan-your-trip/",
  "/contact-us/",
];
for (const route of routes)
  test(`production indexing and canonical ${route}`, async ({ page }) => {
    const response = await page.goto(
      `${route}?utm_source=fixture&email=private%40example.com`,
    );
    expect(response?.status()).toBe(200);
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      `${origin}${route}`,
    );
    await expect(page.locator("meta[name=robots]")).toHaveAttribute(
      "content",
      "index, follow",
    );
    const schema = JSON.parse(
      await page.locator('script[type="application/ld+json"]').innerText(),
    );
    expect(
      schema["@graph"].some(
        (node: Record<string, string>) => node.url === `${origin}${route}`,
      ),
    ).toBeTruthy();
  });
test("production sitemap, crawl policy, redirects and true 404", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect((await sitemap.text()).match(/<loc>/g)).toHaveLength(routes.length);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    `Sitemap: ${origin}/sitemap.xml`,
  );
  const missing = await request.get("/this-page-does-not-exist/");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("noindex, nofollow");
  const slash = await request.get("/tours", { maxRedirects: 0 });
  // Astro's static preview does not apply host _redirects rules. Record that
  // limitation explicitly; real host redirects remain a launch verification.
  expect(slash.status()).toBe(404);
  const policy = await readFile(".local/production-fixture/_redirects", "utf8");
  for (const route of routes.filter((route) => route !== "/"))
    expect(policy).toContain(`${route.slice(0, -1)} ${route} 301`);
});
test("analytics requires consent, removes query/private data, deduplicates and revokes", async ({
  page,
}) => {
  const requests: string[] = [];
  await page.route("https://www.googletagmanager.com/**", async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ contentType: "text/javascript", body: "" });
  });
  await page.goto("/plan-your-trip/?email=private%40example.com");
  await page.getByLabel("Your name").fill("Private Person");
  expect(requests).toHaveLength(0);
  await page.evaluate(() =>
    window.dispatchEvent(
      new CustomEvent("majestic:analytics-consent", { detail: true }),
    ),
  );
  await expect.poll(() => requests.length).toBe(1);
  await page.evaluate(() =>
    window.dispatchEvent(
      new CustomEvent("majestic:analytics-consent", { detail: true }),
    ),
  );
  await page.getByLabel("Your name").fill("Private Person Again");
  await page.getByLabel("Email address").fill("private@example.com");
  const events = await page.evaluate(() =>
    Array.from(
      (window as unknown as { dataLayer: ArrayLike<unknown>[] }).dataLayer,
      (item) => Array.from(item),
    ),
  );
  expect(events.filter((item) => item[1] === "page_view")).toHaveLength(1);
  expect(events.filter((item) => item[1] === "form_start")).toHaveLength(1);
  expect(JSON.stringify(events)).not.toMatch(
    /Private Person|private%40|private@example|generate_lead/,
  );
  await page.evaluate(() =>
    window.dispatchEvent(
      new CustomEvent("majestic:analytics-consent", { detail: false }),
    ),
  );
  const count = await page.evaluate(
    () => (window as unknown as { dataLayer: unknown[] }).dataLayer.length,
  );
  await page.getByLabel("Your name").fill("After revoke");
  expect(
    await page.evaluate(
      () => (window as unknown as { dataLayer: unknown[] }).dataLayer.length,
    ),
  ).toBe(count);
});

test("responsive AVIF hero retains a working native WebP fallback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/experiences/", "/tailor-made/", "/plan-your-trip/"]) {
    await page.goto(route);
    const hero = page.locator(".page-hero picture img");
    await expect
      .poll(() =>
        hero.evaluate((image) => (image as HTMLImageElement).currentSrc),
      )
      .toMatch(/\.avif$/);
    await hero.evaluate((image) => (image as HTMLImageElement).decode());
    await expect(hero).not.toHaveJSProperty("naturalWidth", 0);
    if (route !== "/experiences/") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect
        .poll(() =>
          hero.evaluate((image: HTMLImageElement) => image.currentSrc),
        )
        .toMatch(/\.webp$/);
      await page.setViewportSize({ width: 390, height: 844 });
      await expect
        .poll(() =>
          hero.evaluate((image: HTMLImageElement) => image.currentSrc),
        )
        .toMatch(/\.avif$/);
    }
    await page.locator(".page-hero source").evaluate((source) => {
      (source as HTMLSourceElement).type = "image/unsupported";
    });
    await expect
      .poll(() =>
        hero.evaluate((image) => (image as HTMLImageElement).currentSrc),
      )
      .toMatch(/\.webp$/);
    await hero.evaluate((image) => (image as HTMLImageElement).decode());
    await expect(hero).not.toHaveJSProperty("naturalWidth", 0);
  }
});
