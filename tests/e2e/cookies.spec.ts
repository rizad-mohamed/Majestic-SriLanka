import { test, expect } from "@playwright/test";

test("cookie choices persist and can be withdrawn through settings", async ({
  page,
  context,
  baseURL,
}) => {
  const trackingRequests: string[] = [];
  page.on("request", (request) => {
    if (/googletagmanager|google-analytics/.test(request.url()))
      trackingRequests.push(request.url());
  });
  await page.goto("/");
  const banner = page.locator("[data-cookie-banner]");
  await expect(banner).toBeVisible();
  expect(trackingRequests).toEqual([]);
  await banner
    .getByRole("button", { name: "Reject optional", exact: true })
    .click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(banner).toBeHidden();
  await page
    .getByRole("button", { name: "Cookie Settings", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Cookie preferences",
    exact: true,
  });
  await expect(dialog.getByLabel("Allow analytics")).not.toBeChecked();
  await dialog.getByLabel("Allow analytics").check();
  await dialog.getByRole("button", { name: "Save preferences" }).click();
  const saved = (await context.cookies()).find(
    (cookie) => cookie.name === "majestic_consent",
  );
  expect(JSON.parse(decodeURIComponent(saved!.value))).toEqual({
    version: 1,
    analytics: true,
  });
  await context.addCookies([{ name: "_ga", value: "test", url: baseURL! }]);
  await page
    .getByRole("button", { name: "Cookie Settings", exact: true })
    .click();
  await expect(dialog.getByLabel("Allow analytics")).toBeChecked();
  await dialog.getByRole("button", { name: "Reject optional" }).click();
  expect(
    (await context.cookies()).some((cookie) => cookie.name === "_ga"),
  ).toBe(false);
  await page.reload();
  await page
    .getByRole("button", { name: "Cookie Settings", exact: true })
    .click();
  await expect(dialog.getByLabel("Allow analytics")).not.toBeChecked();
});
