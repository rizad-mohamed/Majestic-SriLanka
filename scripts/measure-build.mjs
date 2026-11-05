import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
const directory = process.env.SEO_DIST_DIR || "dist";
const output =
  process.env.BUILD_METRICS_OUTPUT || "docs/seo/build-metrics.json";
const files = [];
async function walk(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = join(path, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(html|js|css|woff2|webp|avif|mp4)$/.test(file)) {
      const data = await readFile(file);
      files.push({
        path: file.slice(directory.length + 1).replaceAll("\\", "/"),
        bytes: data.length,
        gzipBytes: gzipSync(data).length,
      });
    }
  }
}
await walk(directory);
const summary = Object.fromEntries(
  ["html", "js", "css", "woff2", "webp", "avif", "mp4"].map((type) => {
    const selected = files.filter((file) => file.path.endsWith(`.${type}`));
    return [
      type,
      {
        count: selected.length,
        bytes: selected.reduce((sum, file) => sum + file.bytes, 0),
        gzipBytes: selected.reduce((sum, file) => sum + file.gzipBytes, 0),
      },
    ];
  }),
);
const routes = [];
for (const document of files.filter((file) => file.path.endsWith(".html"))) {
  const html = await readFile(join(directory, document.path), "utf8");
  const styles = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)]
    .map(([tag]) => tag.match(/href="\/([^"]+)"/)?.[1])
    .filter(Boolean);
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  const externalScripts = scripts
    .map(([, attributes]) => attributes.match(/src="\/([^"]+)"/)?.[1])
    .filter(Boolean);
  const inlineJavaScript = scripts
    .filter(
      ([, attributes]) => !/\bsrc=|application\/ld\+json/.test(attributes),
    )
    .map(([, , code]) => code)
    .join("\n");
  const transfer = (paths) =>
    [...new Set(paths)].reduce((sum, path) => {
      const asset = files.find((file) => file.path === path);
      if (!asset) throw new Error(`Missing route asset: ${path}`);
      return sum + asset.gzipBytes;
    }, 0);
  routes.push({
    path: document.path,
    cssGzipBytes: transfer(styles),
    javaScriptGzipBytes:
      transfer(externalScripts) +
      (inlineJavaScript ? gzipSync(inlineJavaScript).length : 0),
  });
}
const mediaInventories = {
  existingWebPBytes: files
    .filter(
      (file) =>
        file.path.endsWith(".webp") &&
        !/\/(experiences|video|hero-mobile|homepage)\//.test(file.path),
    )
    .reduce((sum, file) => sum + file.bytes, 0),
  experienceWebPBytes: files
    .filter((file) => /\/experiences\/.*\.webp$/.test(file.path))
    .reduce((sum, file) => sum + file.bytes, 0),
  filmPosterBytes: files
    .filter((file) => /\/video\/.*\.webp$/.test(file.path))
    .reduce((sum, file) => sum + file.bytes, 0),
  filmBytes: summary.mp4.bytes,
  mobileHeroWebPBytes: files
    .filter(
      (file) =>
        /\/hero-mobile\/.*\.webp$/.test(file.path) &&
        !file.path.includes("/homepage/"),
    )
    .reduce((sum, file) => sum + file.bytes, 0),
  existingAvifBytes: files
    .filter(
      (file) =>
        file.path.endsWith(".avif") && !file.path.includes("/homepage/"),
    )
    .reduce((sum, file) => sum + file.bytes, 0),
  homepageWebPBytes: files
    .filter((file) => /\/homepage\/.*\.webp$/.test(file.path))
    .reduce((sum, file) => sum + file.bytes, 0),
  homepageAvifBytes: files
    .filter((file) => /\/homepage\/.*\.avif$/.test(file.path))
    .reduce((sum, file) => sum + file.bytes, 0),
};
// Transfer estimates use gzip only as a consistent comparison, not measured host compression.
const result = {
  measuredAt: new Date().toISOString(),
  directory,
  summary,
  routes,
  mediaInventories,
  documents: files.filter((file) => file.path.endsWith(".html")),
  scripts: files.filter((file) => file.path.endsWith(".js")),
  styles: files.filter((file) => file.path.endsWith(".css")),
};
await mkdir(join(output, ".."), { recursive: true });
await writeFile(output, JSON.stringify(result, null, 2) + "\n");
if (
  mediaInventories.existingAvifBytes > 400000 ||
  mediaInventories.homepageWebPBytes > 6200000 ||
  mediaInventories.homepageAvifBytes > 600000 ||
  summary.woff2.bytes > 240000 ||
  mediaInventories.existingWebPBytes > 7400000 ||
  mediaInventories.experienceWebPBytes > 1300000 ||
  mediaInventories.filmPosterBytes > 50000 ||
  mediaInventories.filmBytes > 3000000 ||
  mediaInventories.mobileHeroWebPBytes > 100000 ||
  summary.js.gzipBytes > 6000 ||
  result.styles.some((file) => file.gzipBytes > 14000) ||
  routes.some(
    (route) => route.cssGzipBytes > 16000 || route.javaScriptGzipBytes > 6000,
  ) ||
  result.documents.some((file) => file.gzipBytes > 15000)
)
  throw new Error(
    "Build budget exceeded: each route JS (including inline code) 6KB gzip, CSS 16KB gzip, each stylesheet 14KB gzip, HTML 15KB gzip; fonts 240KB, existing WebP 7.4MB and AVIF 400KB, documentary WebP 1.3MB, film poster 50KB, film 3MB, mobile hero WebP 100KB; isolated homepage responsive collection WebP 6.2MB and AVIF 600KB. Review measured changes.",
  );
console.log(JSON.stringify(summary));
