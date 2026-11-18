import { test, expect } from "@playwright/test";

test("new experience interests reach the planner and remain searchable", async ({
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
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const id of [
    "snorkelling-diving",
    "private-beach-parties",
    "upper-diyaluma",
    "gal-oya",
    "rathugala",
  ]) {
    await page.goto(`/experiences/#${id}`);
    await page
      .locator(`#${id}`)
      .getByRole("link", { name: "Add to My Journey" })
      .click();
    await expect(page).toHaveURL(new RegExp(`interest=${id}`));
    await expect(page.locator(`[data-interest="${id}"]`)).toBeEnabled();
  }
  await page.goto("/");
  await expect(page.locator(".experience-card")).toHaveCount(5);
  await page.getByRole("button", { name: "Search journeys" }).click();
  await page.locator("#site-search").fill("Upper Diyaluma");
  await expect(
    page.locator('#search-dialog a[href="/experiences/#upper-diyaluma"]'),
  ).toBeVisible();
});
