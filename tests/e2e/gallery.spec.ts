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
  await expect(lightbox.locator("[data-photo-count]")).toHaveText("2 / 69");
  await page.keyboard.press("Escape");
  await expect(lightbox).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(page.locator("body")).not.toHaveClass(/dialog-is-open/);

  await opener.press("Enter");
  await expect(lightbox).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(lightbox.locator("[data-photo-count]")).toHaveText("69 / 69");
  await lightbox
    .getByRole("button", { name: "Close photo", exact: true })
    .click();
  await expect(opener).toBeFocused();
});
