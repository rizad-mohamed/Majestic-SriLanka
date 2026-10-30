import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE_URL;
export default defineConfig({
  site: site || "https://majestic-sri-lanka-journeys.palecoati256.chatgpt.site",
  output: "static",
  trailingSlash: "always",
  build: { inlineStylesheets: "never" },
  server: { port: 4321 },
});
