import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { getSiteConfig } from "./src/lib/site-config.mjs";

const env = {
  ...loadEnv(process.env.NODE_ENV || "production", process.cwd(), "PUBLIC_"),
  ...process.env,
};
const { siteUrl } = getSiteConfig(env);
export default defineConfig({
  site: siteUrl,
  output: "static",
  trailingSlash: "always",
  redirects: {
    "/tours": { destination: "/itineraries/", status: 301 },
  },
  build: { inlineStylesheets: "never" },
  server: { port: 4321 },
});
