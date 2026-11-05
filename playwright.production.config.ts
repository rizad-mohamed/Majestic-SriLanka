import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/production",
  timeout: 60000,
  forbidOnly: !!process.env.CI,
  workers: 2,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report/production", open: "never" }],
  ],
  outputDir: "test-results/production",
  use: {
    ...(process.env.PLAYWRIGHT_CHANNEL
      ? { channel: process.env.PLAYWRIGHT_CHANNEL }
      : {}),
    baseURL: "http://127.0.0.1:4322",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command:
      "npm run preview -- --port 4322 --outDir .local/production-fixture --ignore-lock",
    url: "http://127.0.0.1:4322",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
