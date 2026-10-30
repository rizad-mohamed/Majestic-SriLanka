import { spawn } from "node:child_process";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const base = "http://127.0.0.1:4321";
const output = join(root, "deliverables/lighthouse");
const runCount = Number(process.env.LIGHTHOUSE_RUNS || 3);
if (!Number.isInteger(runCount) || runCount < 1 || runCount > 5)
  throw new Error("LIGHTHOUSE_RUNS must be between 1 and 5.");
await mkdir(output, { recursive: true });
let server;
try {
  try {
    await fetch(base);
  } catch {
    const astroPackage = require.resolve("astro/package.json");
    const pkg = JSON.parse(await readFile(astroPackage, "utf8"));
    server = spawn(
      process.execPath,
      [
        join(
          dirname(astroPackage),
          typeof pkg.bin === "string" ? pkg.bin : pkg.bin.astro,
        ),
        "preview",
        "--host",
        "127.0.0.1",
        "--port",
        "4321",
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
        await fetch(base);
        ready = true;
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    if (!ready) throw new Error("Production preview did not become ready.");
  }
  const results = [];
  for (const mode of process.argv.includes("--mobile-only")
    ? ["mobile"]
    : ["mobile", "desktop"])
    for (const route of process.argv.includes("--home-only")
      ? ["/"]
      : ["/", "/tours/", "/plan-your-trip/"]) {
      const name = `${route === "/" ? "home" : route.split("/")[1]}-${mode}`;
      const runs = [];
      for (let run = 1; run <= runCount; run++) {
        const outputPath = join(output, `${name}-run${run}`);
        const args = [
          join(root, "node_modules/lighthouse/cli/index.js"),
          `${base}${route}`,
          "--output=json",
          "--output=html",
          `--output-path=${outputPath}`,
          "--quiet",
          "--chrome-flags=--headless --no-sandbox",
          "--skip-audits=is-crawlable",
        ];
        if (mode === "desktop") args.push("--preset=desktop");
        await new Promise((resolve, reject) => {
          const child = spawn(process.execPath, args, {
            cwd: root,
            stdio: "inherit",
            windowsHide: true,
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
          report: `${name}-run${run}.report.html`,
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
        method: `Median performance run of ${runCount} independent audits; all run results retained.`,
        indexingNote: "Preview intentionally noindex; is-crawlable excluded.",
      });
      console.log(
        `${name}: ${JSON.stringify(medianRun.scores)}; performance runs: ${runs.map((run) => run.scores.performance).join(", ")}`,
      );
    }
  await writeFile(
    join(output, "summary.json"),
    JSON.stringify(results, null, 2),
  );
  const failures = results.filter(
    (result) =>
      result.scores.performance < 90 ||
      result.scores.accessibility < 95 ||
      result.scores["best-practices"] < 95 ||
      result.scores.seo < 95,
  );
  if (failures.length)
    throw new Error(
      `Lighthouse quality thresholds failed for ${failures.length} audit(s). See deliverables/lighthouse/summary.json.`,
    );
} finally {
  server?.kill();
}
