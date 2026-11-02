import { test, expect } from "@playwright/test";

test("hero selection supports keyboard, touch and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const controls = page.locator("[data-hero-controls]");
  await expect(
    controls.getByRole("button", { name: "Play slideshow" }),
  ).toBeVisible();
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
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-photo",
    "hero-sigiriya",
  );
  await expect(
    controls.getByRole("button", { name: "Show Sigiriya landscape" }),
  ).toBeFocused();
  const transition = await page
    .locator("[data-hero-current]")
    .evaluate((image) => getComputedStyle(image).transitionDuration);
  expect(parseFloat(transition)).toBeLessThanOrEqual(0.001);
  for (const button of await controls.getByRole("button").all()) {
    const box = await button.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test("hero advances automatically and pauses after manual selection", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.mouse.move(0, 0);
  await expect(
    page.getByRole("button", { name: "Pause slideshow" }),
  ).toBeVisible();
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-photo",
    "hill-country",
    { timeout: 16000 },
  );
  await page.getByRole("button", { name: "Pause slideshow" }).click();
  await expect(
    page.getByRole("button", { name: "Play slideshow" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Play slideshow" }).click();
  await expect(
    page.getByRole("button", { name: "Pause slideshow" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Show southern coast landscape" })
    .click();
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-photo",
    "southern-coast",
  );
  await expect(
    page.getByRole("button", { name: "Play slideshow" }),
  ).toBeVisible();
  await page.clock.install();
  await page.mouse.move(0, 0);
  await page.clock.runFor(15000);
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-photo",
    "southern-coast",
  );
});

test("film is requested only on opening and pauses on dismissal", async ({
  page,
}) => {
  const filmRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/video/")) filmRequests.push(request.url());
  });
  await page.goto("/");
  const film = page.locator("[data-island-film]");
  await expect(film).not.toHaveAttribute("src");
  await expect(film).toHaveAttribute("preload", "none");
  expect(filmRequests).toEqual([]);
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
  await expect
    .poll(() =>
      filmRequests.some((url) => url.endsWith("island-film-poster.webp")),
    )
    .toBe(true);
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
  const navigation = page.getByRole("navigation", {
    name: "Your experience journey",
  });
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
    await expect(navigation).toBeInViewport();
  }
  await expect
    .poll(() =>
      navigation.evaluate((element) =>
        Number(
          (element as HTMLElement).style.getPropertyValue("--journey-progress"),
        ),
      ),
    )
    .toBe(1);
  await expect(navigation.locator('[data-complete="true"]')).toHaveCount(4);
  const links = navigation.getByRole("link");
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
    navigation.evaluate((element) =>
      Number(
        (element as HTMLElement).style.getPropertyValue("--journey-progress"),
      ),
    );
  await expect.poll(progress).toBeGreaterThan(0.3);
  expect(await progress()).toBeLessThan(0.45);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".journey-traveller")).toBeHidden();
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
    await page.locator('[data-journey-link="tea"]').click();
    await expect(page).toHaveURL(/#tea$/);
    await expect(page.locator("#tea h2")).toBeInViewport();
    await page.locator("#tea summary").click();
    await expect(page.locator("#tea .photo-credits ul")).toBeVisible();
    await page.goto("/");
    await expect(page.locator("[data-hero-controls]")).toBeHidden();
    await expect(page.locator("[data-hero-image] img")).toBeVisible();
  } finally {
    await context.close();
  }
});
