import { spawn } from "node:child_process";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const base = "http://127.0.0.1:4323";
const output = resolve(
  process.env.LIGHTHOUSE_OUTPUT_DIR || join(root, "deliverables/lighthouse"),
);
const runCount = Number(process.env.LIGHTHOUSE_RUNS || 3);
if (!Number.isInteger(runCount) || runCount < 1 || runCount > 5)
  throw new Error("LIGHTHOUSE_RUNS must be between 1 and 5.");
const builtHtml = await readFile(join(root, "dist/index.html"), "utf8");
const indexable = builtHtml.includes('name="robots" content="index, follow"');
let routes = process.argv.includes("--home-only")
  ? ["/"]
  : [
      "/",
      "/itineraries/",
      "/tailor-made/",
      "/experiences/",
      "/about-us/",
      "/plan-your-trip/",
      "/contact-us/",
    ];
const routeFlag = process.argv.indexOf("--route");
if (routeFlag >= 0) {
  const requested = process.argv[routeFlag + 1];
  if (!routes.includes(requested))
    throw new Error("--route must name an approved route.");
  routes = [requested];
}
const results = [];
await mkdir(join(output, "current"), { recursive: true });
const astroPackage = require.resolve("astro/package.json");
const pkg = JSON.parse(await readFile(astroPackage, "utf8"));
let server;
try {
  // Own a dedicated preview; never audit an unknown or stale dev server.
  const occupied = await fetch(base, {
    signal: AbortSignal.timeout(1500),
  }).then(
    () => true,
    () => false,
  );
  if (occupied)
    throw new Error(
      "Lighthouse port 4323 is already in use. Stop the previous owned audit server.",
    );
  server = spawn(
    process.execPath,
    [
      join(
        dirname(astroPackage),
        typeof pkg.bin === "string" ? pkg.bin : pkg.bin.astro,
      ),
      "preview",
      "--ignore-lock",
      "--host",
      "127.0.0.1",
      "--port",
      "4323",
    ],
    {
      cwd: root,
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
      windowsHide: true,
      stdio: "ignore",
    },
  );
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try {
      const response = await fetch(base, { signal: AbortSignal.timeout(1000) });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* retry startup */
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error("Production preview did not become ready.");
  for (const mode of process.argv.includes("--mobile-only")
    ? ["mobile"]
    : ["mobile", "desktop"]) {
    for (const route of routes) {
      const name = `${route === "/" ? "home" : route.split("/")[1]}-${mode}`;
      const runs = [];
      for (let run = 1; run <= runCount; run++) {
        const outputPath = join(output, "current", `${name}-run${run}`);
        const args = [
          join(root, "node_modules/lighthouse/cli/index.js"),
          `${base}${route}`,
          "--output=json",
          "--output=html",
          `--output-path=${outputPath}`,
          "--quiet",
          "--chrome-flags=--headless --no-sandbox",
          "--only-categories=performance,accessibility,best-practices,seo",
        ];
        if (mode === "desktop") args.push("--preset=desktop");
        await new Promise((resolve, reject) => {
          const child = spawn(process.execPath, args, {
            cwd: root,
            stdio: "inherit",
            windowsHide: true,
            timeout: 180000,
          });
          child.once("error", reject);
          child.once("exit", (code) =>
            code === 0
              ? resolve()
              : reject(new Error(`Lighthouse failed: ${name} (${code})`)),
          );
        });
        const report = JSON.parse(
          await readFile(`${outputPath}.report.json`, "utf8"),
        );
        if (report.runtimeError)
          throw new Error(JSON.stringify(report.runtimeError));
        const scores = Object.fromEntries(
          Object.entries(report.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        );
        const metrics = {
          lcp: report.audits["largest-contentful-paint"].numericValue,
          cls: report.audits["cumulative-layout-shift"].numericValue,
          tbt: report.audits["total-blocking-time"].numericValue,
        };
        const failed = Object.entries(report.audits)
          .filter(
            ([, audit]) =>
              audit.score !== null &&
              audit.score < 1 &&
              audit.scoreDisplayMode !== "informative",
          )
          .map(([id, audit]) => ({
            id,
            title: audit.title,
            score: audit.score,
          }));
        runs.push({
          scores,
          metrics,
          failed,
          report: `current/${name}-run${run}.report.html`,
          crawlability: report.audits["is-crawlable"]?.score,
          seoFailures: report.categories.seo.auditRefs
            .filter(
              (ref) => ref.weight > 0 && report.audits[ref.id].score !== 1,
            )
            .map((ref) => ref.id),
        });
      }
      const medianRun = [...runs].sort(
        (a, b) => a.scores.performance - b.scores.performance,
      )[Math.floor(runs.length / 2)];
      results.push({
        route,
        mode,
        ...medianRun,
        runs,
        measuredAt: new Date().toISOString(),
        lighthouseVersion: JSON.parse(
          await readFile(
            join(root, "node_modules/lighthouse/package.json"),
            "utf8",
          ),
        ).version,
        method: `Median performance run of ${runCount} independent audits; raw reports retained; no audits skipped.`,
        indexingNote: indexable
          ? "Indexable local production artifact."
          : "Preview is intentionally noindex. Raw SEO score includes the crawlability failure.",
      });
      await writeFile(
        join(output, "summary.json"),
        JSON.stringify(results, null, 2) + "\n",
      );
      console.log(
        `${name}: ${JSON.stringify(medianRun.scores)}; performance runs: ${runs.map((run) => run.scores.performance).join(", ")}`,
      );
    }
  }
  const failures = results.filter(
    (result) =>
      result.scores.performance < 90 ||
      result.scores.accessibility < 95 ||
      result.scores["best-practices"] < 95 ||
      result.runs.some((run) =>
        run.seoFailures.some((id) => indexable || id !== "is-crawlable"),
      ) ||
      result.crawlability !== (indexable ? 1 : 0),
  );
  if (failures.length)
    throw new Error(
      `Lighthouse thresholds failed for ${failures.length} audit(s). See ${output}/summary.json. All SEO audits must pass except the asserted intentional preview noindex failure; raw scores remain unchanged.`,
    );
} finally {
  server?.kill();
}
