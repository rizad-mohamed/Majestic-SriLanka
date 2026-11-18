import { test, expect } from "@playwright/test";

test("gallery returns focus to its opener after another dialog and photo navigation", async ({
  page,
  context,
  baseURL,
}) => {
  await context.addCookies([
    {
      name: "majestic_consent",
      value: encodeURIComponent(
        JSON.stringify({ version: 1, analytics: false }),
      ),
      url: baseURL!,
    },
  ]);
  await page.goto("/gallery/");
  const privacyTrigger = page.getByRole("button", {
    name: "Privacy Policy",
    exact: true,
  });
  await privacyTrigger.click();
  await expect(page.locator("#privacy-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(privacyTrigger).toBeFocused();

  const opener = page.locator("[data-gallery-photo]").first();
  const lightbox = page.locator(".gallery-lightbox");
  await opener.click();
  await expect(lightbox).toBeVisible();
  await lightbox
    .getByRole("button", { name: "Next photo", exact: true })
    .click();
  await expect(lightbox.locator("[data-photo-count]")).toHaveText("2 / 70");
  await page.keyboard.press("Escape");
  await expect(lightbox).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(page.locator("body")).not.toHaveClass(/dialog-is-open/);

  await opener.press("Enter");
  await expect(lightbox).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(lightbox.locator("[data-photo-count]")).toHaveText("70 / 70");
  await lightbox
    .getByRole("button", { name: "Close photo", exact: true })
    .click();
  await expect(opener).toBeFocused();
});

test("new gallery media keeps native playback and photo lightbox behavior", async ({
  page,
}, info) => {
  test.skip(
    process.platform === "win32" && info.project.name === "webkit",
    "Windows WebKit media codecs vary by OS; verify H.264 playback on macOS WebKit/Safari or Linux CI.",
  );
  await page.goto("/gallery/");
  await expect(page.locator("[data-gallery-photo]")).toHaveCount(70);
  const photo = page.locator(
    '[data-gallery-photo][href*="elephant-on-rocky-shore"]',
  );
  await photo.click();
  await expect(page.locator(".lightbox-image")).toHaveAttribute(
    "src",
    /elephant-on-rocky-shore-1100/,
  );
  await page.keyboard.press("Escape");
  await expect(photo).toBeFocused();
  const video = page.locator(".gallery-video video");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).not.toHaveAttribute("autoplay");
  // preload is a browser hint: WebKit may request a metadata range while paused.
  await expect(video).toHaveJSProperty("paused", true);
  await expect(video).toHaveJSProperty("currentTime", 0);
  await video.scrollIntoViewIfNeeded();
  await video.evaluate((element: HTMLVideoElement) => element.play());
  await expect
    .poll(() =>
      video.evaluate((element: HTMLVideoElement) => element.currentTime),
    )
    .toBeGreaterThan(0.3);
  await video.evaluate((element: HTMLVideoElement) => element.pause());
  await expect(video).toHaveJSProperty("paused", true);
});
