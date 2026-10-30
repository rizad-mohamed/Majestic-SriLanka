import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/tours/",
  "/tailor-made/",
  "/experiences/",
  "/about-us/",
  "/plan-your-trip/",
  "/contact-us/",
];

for (const route of routes)
  test(`renders ${route} with working assets, metadata and no overflow`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
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
    const measurements = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth,
    }));
    expect(measurements.page).toBeLessThanOrEqual(measurements.viewport + 1);
    await page.evaluate(async () => {
      for (const image of document.images) image.loading = "eager";
      await Promise.all(
        Array.from(document.images).map((image) =>
          image.decode().catch(() => {}),
        ),
      );
    });
    for (const img of await page.locator("main img").all()) {
      await expect(img).toHaveJSProperty("complete", true);
      await expect(img).not.toHaveJSProperty("naturalWidth", 0);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath(
        `${route === "/" ? "home" : route.replaceAll("/", "")}-${testInfo.project.name}.png`,
      ),
      fullPage: true,
      style: '.deferred-section { content-visibility: visible !important; }',
    });
    expect(errors).toEqual([]);
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
  await page.goto("/tours/");
  await page.getByRole("button", { name: "Coast", exact: true }).click();
  await expect(page.locator("main .tour-card:visible")).toHaveCount(1);
  await expect(page.locator("[data-filter-status]")).toHaveText(
    "1 journey to explore",
  );
  await page.getByRole("button", { name: "View Tour", exact: true }).click();
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
  await expect(page.locator("[data-hero-image] img")).toHaveAttribute(
    "src",
    /hill-country-1600/,
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
  await page.getByLabel("Food & Cuisine", { exact: true }).check();
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
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

test("navigation retains essential content without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4321/");
  await expect(page.locator("h1")).toContainText("Extraordinary");
  await page.getByRole("link", { name: "Explore Tours", exact: true }).click();
  await expect(page.locator("h1")).toContainText("Journeys to");
  await context.close();
});

test("all seven pages reflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of routes) {
    await page.goto(route);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(321);
  }
});
