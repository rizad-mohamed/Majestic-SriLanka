import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  timeout: 120000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4325",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        defaultBrowserType: "chromium",
      },
    },
    {
      name: "small-mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 360, height: 800 },
        screen: { width: 360, height: 800 },
        isMobile: true,
        hasTouch: true,
      },
    },
    ...(process.env.CROSS_BROWSER === "true"
      ? [
          {
            name: "firefox",
            use: {
              ...devices["Desktop Firefox"],
              viewport: { width: 1440, height: 900 },
            },
          },
          {
            name: "webkit",
            use: {
              ...devices["Desktop Safari"],
              viewport: { width: 1440, height: 900 },
            },
          },
        ]
      : []),
  ],
  webServer: {
    command: "npm run preview -- --port 4325 --ignore-lock",
    url: "http://127.0.0.1:4325",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
