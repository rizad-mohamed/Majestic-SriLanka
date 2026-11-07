import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// General page tests use a returning visitor who rejected optional cookies.
// Fresh-visitor consent behavior is covered separately in cookies.spec.ts.
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

const routeHeadings: Record<string, RegExp> = {
  "/": /Extraordinary\s*Journeys,\s*Real Connections/,
  "/itineraries/": /Journeys to\s*Remember/,
  "/gallery/": /Their journeys.\s*Real memories./,
  "/tailor-made/": /Your Sri Lanka.\s*Your Story/,
  "/experiences/": /Moments That\s*Stay With You/,
  "/about-us/": /Local People.\s*Meaningful Journeys/,
  "/plan-your-trip/": /Plan Your\s*Sri Lankan Journey/,
  "/contact-us/": /Let.s Talk\s*Sri Lanka/,
};

for (const route of routes)
  test(`renders ${route} with working assets, metadata and no overflow`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    const foreignRequests: string[] = [];
    page.on("request", (request) => {
      if (
        /^https?:/.test(request.url()) &&
        new URL(request.url()).hostname !== "127.0.0.1"
      )
        foreignRequests.push(request.url());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toContainText(routeHeadings[route]);
    await expect(page).toHaveTitle(/Sri Lanka/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      await page.title(),
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      await page.title(),
    );
    await expect(page.locator("header .brand")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      new RegExp(`${route.replaceAll("/", "\\/")}$`),
    );
    await expect(page.locator("meta[name=description]")).toHaveAttribute(
      "content",
      /\S.{50}/,
    );
    await expect(page.locator("meta[name=robots]")).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await page.evaluate(async () => {
      for (const image of document.images) image.loading = "eager";
      await Promise.all(
        Array.from(document.images).map((image) =>
          image.decode().catch(() => {}),
        ),
      );
      await document.fonts.ready;
    });
    const measurements = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth,
    }));
    expect(measurements.page).toBeLessThanOrEqual(measurements.viewport + 1);
    for (const img of await page.locator("main img").all()) {
      await expect(img).toHaveJSProperty("complete", true);
      await expect(img).not.toHaveJSProperty("naturalWidth", 0);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath(
        `${route === "/" ? "home" : route.replaceAll("/", "")}-${testInfo.project.name}.png`,
      ),
      fullPage: !["firefox", "webkit"].includes(testInfo.project.name),
      scale: "css",
      animations: "disabled",
      style:
        ".deferred-section, .experience-detail { content-visibility: visible !important; }",
    });
    expect(errors).toEqual([]);
    expect(foreignRequests).toEqual([]);
  });

test("search finds a journey and handles no results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search journeys" }).click();
  const dialog = page.getByRole("dialog", { name: "Find your Sri Lanka" });
  await expect(dialog).toBeVisible();
  await page.locator("#site-search").fill("hill country");
  await expect(
    dialog.getByRole("link", { name: /Hill Country Explorer/ }),
  ).toBeVisible();
  await page.locator("#site-search").fill("not-a-real-place");
  await expect(page.locator("#search-status")).toContainText("No matches");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Search journeys" }),
  ).toBeFocused();
});

test("preview sitemap and 404 retain safe indexing behavior", async ({
  page,
  request,
}) => {
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain(
    "<loc>",
  );
  expect(await (await request.get("/robots.txt")).text()).toContain("Allow: /");
  const response = await page.goto("/missing-page-for-test/");
  expect(response?.status()).toBe(404);
  await expect(page.locator("meta[name=robots]")).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await expect(page.locator("link[rel=canonical]")).toHaveCount(0);
});

test("keyboard skip link, dialog focus containment and reduced motion work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const tabKey = "Tab";
  await page.keyboard.press(tabKey);
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.click();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press(tabKey);
    expect(
      await page.evaluate(
        () => !!document.activeElement?.closest("dialog[open]"),
      ),
    ).toBeTruthy();
  }
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Shift+Tab");
    expect(
      await page.evaluate(
        () => !!document.activeElement?.closest("dialog[open]"),
      ),
    ).toBeTruthy();
  }
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).not.toBe("smooth");
});

test("WhatsApp destination uses the supplied channel without sending a message", async ({
  page,
}) => {
  await page.goto("/contact-us/");
  const links = page.locator('a[href^="https://wa.me/"]');
  expect(await links.count()).toBeGreaterThan(0);
  for (const link of await links.all())
    expect(new URL((await link.getAttribute("href"))!).pathname).toBe(
      "/94740485072",
    );
});

test("planner error and summary states remain accessible and local", async ({
  page,
}) => {
  await page.goto("/plan-your-trip/");
  await page.getByRole("button", { name: "Create My Travel Brief" }).click();
  await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByLabel("Your name").fill("<script>private</script>");
  await page.getByLabel("Email address").fill("fixture@example.com");
  await page.getByLabel("Approximate arrival").fill("2099-02-28");
  await page.locator("#consent").check();
  await page.getByRole("button", { name: "Create My Travel Brief" }).click();
  await expect(page.locator("#brief-text")).toContainText(
    "<script>private</script>",
  );
  await expect(page.locator("#brief-text script")).toHaveCount(0);
  await expect(page.locator("#brief-summary")).toBeFocused();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await expect(page.locator("#whatsapp-brief")).toHaveAttribute(
    "href",
    /^https:\/\/wa.me\/94740485072\?text=/,
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Email Draft" }).click();
  expect((await download).suggestedFilename()).toBe(
    "my-majestic-sri-lanka-enquiry.eml",
  );
});

test("menu navigates and restores keyboard focus when dismissed", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Your next chapter" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "Contact Us" }).click();
  await expect(page).toHaveURL("/contact-us/");
});

test("tour filters and itinerary preview lead to the correct planner choice", async ({
  page,
}) => {
  await page.goto("/itineraries/");
  await page.getByRole("button", { name: "Coast", exact: true }).click();
  await expect(page.locator("main .tour-card:visible")).toHaveCount(1);
  await expect(page.locator("[data-filter-status]")).toHaveText(
    "1 journey to explore",
  );
  await page
    .getByRole("button", { name: "View Itinerary", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Southern Coast Escape" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "Make This Journey Yours" }).click();
  await expect(page.locator("#journey")).toHaveValue("southern-coast");
});

test("hero selectors and featured tour controls respond", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Show hill country landscape" })
    .click();
  await expect(page.locator("[data-hero-current]")).toHaveAttribute(
    "data-photo",
    "hill-country",
  );
  await expect(
    page.getByRole("button", { name: "Show hill country landscape" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Next featured tour" }).click();
  await expect(
    page.locator("[data-tour-track] article").first(),
  ).toHaveAttribute("id", "hill-country");
  await page.getByRole("button", { name: "Watch Our Story" }).click();
  await expect(
    page.getByRole("dialog", { name: "More than a destination." }),
  ).toBeVisible();
});

test("planner validates, creates and downloads a brief without sending it", async ({
  page,
}) => {
  await page.goto("/plan-your-trip/");
  await page.getByRole("button", { name: "Create My Travel Brief" }).click();
  await expect(page.locator("#name-error")).toHaveText(
    "Please enter your name.",
  );
  await expect(page.locator("#name")).toBeFocused();
  await page.getByLabel("Your name").fill("Alex Traveller");
  await page.getByLabel("Email address").fill("alex@example.com");
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);
  await page
    .getByLabel("Approximate arrival")
    .fill(future.toISOString().slice(0, 10));
  await page.locator("#notes").fill("Food & Cuisine");
  await page.locator("#consent").check();
  await page.getByRole("button", { name: "Create My Travel Brief" }).click();
  await expect(page.locator("#brief-summary")).toBeVisible();
  await expect(page.locator("#form-status")).toContainText(
    "It has not been sent",
  );
  await expect(page.locator("#brief-text")).toContainText("Food & Cuisine");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download My Brief" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe(
    "my-majestic-sri-lanka-travel-brief.txt",
  );
});

test("FAQ and policy dialogs support keyboard use", async ({ page }) => {
  await page.goto("/contact-us/#travel-faq");
  const question = page.getByText("Are train journeys guaranteed?", {
    exact: true,
  });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Train schedules and tickets are subject to availability.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Privacy Policy" }).click();
  await expect(
    page.getByRole("dialog", { name: "Privacy information" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
});

for (const route of routes)
  test(`automated accessibility ${route}`, async ({ page }) => {
    await page.goto(route);
    // Analyze every row even when its normal offscreen rendering is deferred.
    if (route === "/experiences/")
      await page.addStyleTag({
        content:
          ".experience-detail { content-visibility: visible !important; }",
      });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

test("navigation retains essential content without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Extraordinary");
  await page
    .getByRole("link", { name: "Explore Itineraries", exact: true })
    .click();
  await expect(page.locator("h1")).toContainText("Journeys to");
  await context.close();
});

test("homepage experience shortcuts reach their named sections", async ({
  page,
}) => {
  for (const [label, id] of [
    ["Unique Wildlife Encounters", "wildlife"],
    ["Stunning Beaches & Coastlines", "beaches"],
    ["Scenic Hill Country & Tea Trails", "tea"],
  ]) {
    await page.goto("/");
    await page
      .locator(".category-strip")
      .getByRole("link", { name: label })
      .click();
    await expect(page).toHaveURL(new RegExp(`/experiences/#${id}$`));
    await expect(page.locator(`#${id} h2`)).toBeInViewport();
  }
});

test("experience links retain verified context without restoring visible interest choices", async ({
  page,
}) => {
  await page.goto("/experiences/#tea");
  await expect(page.locator("#tea h2")).toBeInViewport();
  await page
    .locator("#tea")
    .getByRole("link", { name: "Add to My Journey" })
    .click();
  await expect(page).toHaveURL(/\/plan-your-trip\/\?interest=tea#trip-form$/);
  await expect(page.locator('input[data-interest="tea"]')).toBeEnabled();
  await expect(page.locator('input[data-interest="tea"]')).toHaveAttribute(
    "type",
    "hidden",
  );
  await page.goto(
    "/plan-your-trip/?interest=tea&interest=food&interest=unknown",
  );
  await expect(page.locator('input[name="interests"]:enabled')).toHaveCount(2);
  await expect(page.locator('input[data-interest="food"]')).toBeEnabled();
  await expect(page.locator('input[data-interest="unknown"]')).toHaveCount(0);
  await expect(page.getByRole("checkbox")).toHaveCount(1);
});

test("all pages reflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of routes) {
    await page.goto(route);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(321);
  }
});
