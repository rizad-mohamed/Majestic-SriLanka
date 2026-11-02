import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
const require = createRequire(import.meta.url);
const astroPackage = require.resolve("astro/package.json");
const pkg = JSON.parse(await readFile(astroPackage, "utf8"));
const cli = join(
  dirname(astroPackage),
  typeof pkg.bin === "string" ? pkg.bin : pkg.bin.astro,
);
const env = {
  ...process.env,
  PUBLIC_DEPLOYMENT_ENV: "production",
  PUBLIC_ALLOW_INDEXING: "true",
  PUBLIC_SITE_URL: "https://seo-fixture.majesticsrilanka.com",
  PUBLIC_GA4_MEASUREMENT_ID: "G-TEST12345",
  PUBLIC_CONTACTS_CONFIRMED: "false",
  ASTRO_TELEMETRY_DISABLED: "1",
  SEO_DIST_DIR: ".local/production-fixture",
  SEO_EXPECT_ORIGIN: "https://seo-fixture.majesticsrilanka.com",
  SEO_EXPECT_INDEXABLE: "true",
};
async function run(args) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      env,
      stdio: "inherit",
      windowsHide: true,
    });
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`Production fixture command failed (${code})`)),
    );
  });
}
// Isolated, never published fixture. Does not replace the safe noindex dist/ build.
await run([cli, "build", "--outDir", ".local/production-fixture"]);
await run(["scripts/validate-build.mjs"]);
await run([
  "node_modules/@playwright/test/cli.js",
  "test",
  "--config",
  "playwright.production.config.ts",
]);
