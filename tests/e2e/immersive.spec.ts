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

test("initial hero stays still and requests no video until a visitor acts", async ({
  page,
}) => {
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (/\.mp4(?:$|\?)/.test(request.url())) videoRequests.push(request.url());
  });
  await page.clock.install();
  await page.goto("/");
  await page.clock.runFor(20000);
  expect(videoRequests).toEqual([]);
  await expect(page.locator("[data-hero-video]")).toHaveJSProperty(
    "paused",
    true,
  );
  expect(
    await page.locator("[data-hero-video]").getAttribute("src"),
  ).toBeNull();
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-hero-video",
    "",
  );
});

test("hero selection supports keyboard, touch and reduced motion", async ({
  page,
}) => {
  const wideSigiriyaRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/photography/hero-sigiriya-"))
      wideSigiriyaRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const controls = page.locator("[data-hero-controls]");
  await expect(
    controls.getByRole("button", { name: "Play hero playback" }),
  ).toBeVisible();
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-hero-video",
    "",
  );
  expect(
    await page.locator("[data-hero-video]").getAttribute("src"),
  ).toBeNull();
  expect(wideSigiriyaRequests).toEqual([]);
  const coast = controls.getByRole("button", {
    name: "Show southern coast landscape",
  });
  await coast.click();
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-photo",
    "southern-coast",
  );
  await expect(coast).toHaveAttribute("aria-pressed", "true");
  await coast.press("ArrowRight");
  await expect(
    controls.getByRole("button", { name: "Show Sri Lanka film" }),
  ).toBeFocused();
  await controls
    .getByRole("button", { name: "Show Sri Lanka film" })
    .press("ArrowRight");
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-photo",
    "hero-sigiriya",
  );
  await expect(
    controls.getByRole("button", { name: "Show Sigiriya landscape" }),
  ).toBeFocused();
  for (const button of await controls.getByRole("button").all()) {
    const box = await button.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  if (page.viewportSize()!.width <= 700) {
    // Returning to Sigiriya keeps its portrait source and responds to resizing.
    await expect
      .poll(() =>
        page
          .locator("[data-hero-current]")
          .evaluate((image: HTMLImageElement) => image.currentSrc),
      )
      .toContain("/hero-mobile/hero-sigiriya-");
    await page.setViewportSize({ width: 900, height: 900 });
    await expect
      .poll(() =>
        page
          .locator("[data-hero-current]")
          .evaluate((image: HTMLImageElement) => image.currentSrc),
      )
      .toContain("/photography/hero-sigiriya-");
  }
  const transition = await page
    .locator("[data-hero-current]")
    .evaluate((image) => getComputedStyle(image).transitionDuration);
  expect(parseFloat(transition)).toBeLessThanOrEqual(0.001);
});

test("video waits for Play, ends naturally, then all three images cycle without replaying it", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.mouse.move(0, 0);
  const video = page.locator("[data-hero-video]");
  await expect(video).toHaveAttribute("data-hero-current", "");
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).toHaveJSProperty("loop", false);
  await expect(video).not.toHaveAttribute("autoplay", "");
  expect(await video.getAttribute("src")).toBeNull();
  await page.getByRole("button", { name: "Play hero playback" }).click();
  await expect
    .poll(
      () =>
        video.evaluate((v: HTMLVideoElement) => !v.paused && v.readyState >= 2),
      { timeout: 20000 },
    )
    .toBe(true);
  await page.getByRole("button", { name: "Pause hero playback" }).click();
  await expect(video).toHaveJSProperty("paused", true);
  await page.getByRole("button", { name: "Play hero playback" }).click();
  await page.mouse.move(0, 0);
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(false);
  await expect(video).toHaveAttribute("data-hero-current", "");
  // Seek near the end, preserving the real native ended event and controller handoff.
  await video.evaluate((v: HTMLVideoElement) => {
    v.currentTime = v.duration - 0.2;
  });
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-photo",
    "hero-sigiriya",
    { timeout: 15000 },
  );
  for (const name of ["hill-country", "southern-coast", "hero-sigiriya"]) {
    await expect(page.locator("[data-hero-current]")).toHaveAttribute(
      "data-photo",
      name,
      { timeout: 11000 },
    );
  }
  await expect(video).toHaveJSProperty("paused", true);
  await page
    .getByRole("button", { name: "Show southern coast landscape" })
    .click();
  await expect(
    page.getByRole("button", { name: "Play hero playback" }),
  ).toBeVisible();
  await page.clock.install();
  await page.mouse.move(0, 0);
  await page.clock.runFor(15000);
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-photo",
    "southern-coast",
  );
});

test("film poster falls back to images when requested playback is blocked or loading fails", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      return location.search.includes("blocked")
        ? Promise.reject(
            new DOMException("Autoplay blocked", "NotAllowedError"),
          )
        : play.call(this);
    };
  });
  await page.goto("/?blocked");
  await page.getByRole("button", { name: "Play hero playback" }).click();
  await expect(page.locator("[data-hero-video]")).toHaveAttribute(
    "poster",
    /island-film-poster.webp$/,
  );
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-photo",
    "hero-sigiriya",
    { timeout: 18000 },
  );
  // Replace the document's hero source: native media networking is not exposed
  // consistently through Playwright's request interception in every engine.
  await page.route("**/?failed-film", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      'data-src="/assets/majestic-sri-lanka/video/island-film.mp4"',
      'data-src="/missing-hero-film.mp4"',
    );
    await route.fulfill({ response, body });
  });
  await page.goto("/?failed-film");
  await page.getByRole("button", { name: "Play hero playback" }).click();
  await expect
    .poll(
      () =>
        page
          .locator("[data-hero-video]")
          .evaluate((video: HTMLVideoElement) => video.error !== null),
      { timeout: 15000 },
    )
    .toBe(true);
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-photo",
    "hero-sigiriya",
    { timeout: 18000 },
  );
});

test("optional story player loads on opening and pauses on dismissal", async ({
  page,
}) => {
  await page.goto("/");
  const film = page.locator("[data-island-film]");
  expect(await film.getAttribute("src")).toBeNull();
  await expect(film).toHaveAttribute("preload", "none");
  expect(
    await page.locator("[data-hero-video]").getAttribute("src"),
  ).toBeNull();
  await page.getByRole("button", { name: "Watch Our Story" }).click();
  await expect(
    page.getByRole("dialog", { name: "More than a destination." }),
  ).toBeVisible();
  await expect(film).toHaveAttribute("src", /island-film\.mp4$/);
  await expect
    .poll(() => film.evaluate((video: HTMLVideoElement) => video.readyState), {
      timeout: 15000,
    })
    .toBeGreaterThanOrEqual(2);
  expect(
    await film.evaluate((video: HTMLVideoElement) => video.duration),
  ).toBeCloseTo(16.2, 0);
  // WebKit's native media loader is absent from Playwright's page-request trace.
  // Decoded video metadata and currentSrc verify the same media in every engine.
  await expect(film).toHaveJSProperty(
    "currentSrc",
    new URL("/assets/majestic-sri-lanka/video/island-film.mp4", page.url())
      .href,
  );
  const close = page.getByRole("button", { name: "Close story" });
  await close.focus();
  await page.keyboard.press("Tab");
  await expect
    .poll(() => film.evaluate((video) => video.matches(":focus-within")))
    .toBe(true);
  // Preserve the native control tree rather than assuming a platform shortcut.
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => !!document.activeElement?.closest("#story-dialog[open]"),
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Read Our Story" }).focus();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(film).toHaveJSProperty("paused", true);
  await expect(
    page.getByRole("button", { name: "Watch Our Story" }),
  ).toBeFocused();
});

test("journey navigation tracks scrolling and links to all five experiences", async ({
  page,
}) => {
  await page.goto("/experiences/");
  const compact = page.viewportSize()!.width <= 1100;
  const navigation = page.locator(
    compact ? "[data-journey-nav]" : ".experience-list",
  );
  const progressElement = page.locator("[data-journey-nav]");
  await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute(
    "href",
    "#wildlife",
  );
  for (const id of ["culture", "beaches", "tea", "food"]) {
    await navigation.locator(`[href="#${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(
      navigation.locator('[aria-current="location"]'),
    ).toHaveAttribute("href", `#${id}`);
    await expect(page.locator(`#${id} h2`)).toBeInViewport();
  }
  await expect
    .poll(() =>
      progressElement.evaluate((element) =>
        Number(
          (element as HTMLElement).style.getPropertyValue("--journey-progress"),
        ),
      ),
    )
    .toBe(1);
  await expect(navigation.locator('[data-complete="true"]')).toHaveCount(4);
  const links = navigation.locator("[data-journey-link]");
  for (const link of await links.all()) {
    const box = await link.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => {
    const start =
      document.getElementById("culture")!.getBoundingClientRect().top + scrollY;
    const end =
      document.getElementById("beaches")!.getBoundingClientRect().top + scrollY;
    scrollTo({
      top: (start + end) / 2 - innerHeight * 0.36,
      behavior: "instant",
    });
  });
  const progress = () =>
    progressElement.evaluate((element) =>
      Number(
        (element as HTMLElement).style.getPropertyValue("--journey-progress"),
      ),
    );
  await expect.poll(progress).toBeGreaterThan(0.3);
  expect(await progress()).toBeLessThan(0.45);
  const track = page.locator(
    compact ? ".journey-nav .journey-track" : ".journey-spine",
  );
  const axisDeviation = await track.evaluate((element, horizontal) => {
    const line = element.getBoundingClientRect();
    const icon = element
      .querySelector(".journey-traveller")!
      .getBoundingClientRect();
    return horizontal
      ? Math.abs(line.y + line.height / 2 - icon.y - icon.height / 2)
      : Math.abs(line.x + line.width / 2 - icon.x - icon.width / 2);
  }, compact);
  expect(axisDeviation).toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const traveller of await page.locator(".journey-traveller").all())
    await expect(traveller).toBeHidden();
  await expect.poll(progress).toBe(0.25);
});

test("documentary collages expose image credits and preserve frame proportions", async ({
  page,
}) => {
  await page.goto("/experiences/");
  const collages = page.locator(".experience-collage");
  await expect(collages).toHaveCount(5);
  for (const collage of await collages.all()) {
    const photos = collage.locator("img:not([aria-hidden])");
    await expect(photos).toHaveCount(2);
    for (const photo of await photos.all()) {
      await expect(photo).toHaveAttribute("src", /\/experiences\//);
      await expect(photo).toHaveAttribute("alt", /\S.{12}/);
      await expect(photo).toHaveCSS("object-fit", "cover");
    }
    await collage.getByText("Photography credits", { exact: true }).click();
    await expect(collage.locator(".photo-credits li")).toHaveCount(2);
    await expect(
      collage.locator('.photo-credits a[href*="commons.wikimedia.org"]'),
    ).toHaveCount(2);
  }
});

test("inner heroes share sizing and phone headings remain centred on every route", async ({
  page,
}) => {
  const heights: number[] = [];
  for (const route of [
    "/",
    "/tours/",
    "/tailor-made/",
    "/experiences/",
    "/about-us/",
    "/plan-your-trip/",
    "/contact-us/",
  ]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const heading = await page.locator("main h1").boundingBox();
    const viewport = page.viewportSize()!.width;
    if (viewport <= 700)
      expect(
        Math.abs(heading!.x + heading!.width / 2 - viewport / 2),
        route,
      ).toBeLessThan(3);
    if (route !== "/")
      heights.push((await page.locator(".page-hero").boundingBox())!.height);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      route,
    ).toBeLessThanOrEqual(viewport + 1);
  }
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(2);
});

test("logo metadata serves real browser and Apple icons", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/apple-touch-icon.png",
  );
  for (const file of [
    "/favicon.ico",
    "/favicon.svg",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
    "/apple-touch-icon.png",
    "/icon-192.png",
    "/icon-512.png",
  ]) {
    const response = await request.get(file);
    expect(response.ok(), file).toBe(true);
    expect((await response.body()).length).toBeGreaterThan(100);
  }
  const manifest = await (await request.get("/site.webmanifest")).json();
  expect(manifest.name).toBe("Majestic Sri Lanka");
  expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toEqual([
    "192x192",
    "512x512",
  ]);
});

test("experience journey and credits remain usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  });
  try {
    const page = await context.newPage();
    await page.goto("/experiences/");
    await page.locator('[data-journey-link="tea"]:visible').click();
    await expect(page).toHaveURL(/#tea$/);
    await expect(page.locator("#tea h2")).toBeInViewport();
    await page.locator("#tea summary").click();
    await expect(page.locator("#tea .photo-credits ul")).toBeVisible();
    await page.goto("/");
    await expect(page.locator("[data-hero-controls]")).toBeHidden();
    await expect(page.locator("[data-hero-video]")).toBeVisible();
    await expect(page.locator("[data-hero-video]")).toHaveAttribute(
      "poster",
      /island-film-poster.webp$/,
    );
  } finally {
    await context.close();
  }
});
