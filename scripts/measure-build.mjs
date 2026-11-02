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
    else if (/\.(html|js|css|woff2|webp|avif)$/.test(file)) {
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
  ["html", "js", "css", "woff2", "webp", "avif"].map((type) => {
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
// Transfer estimates use gzip only as a consistent comparison, not measured host compression.
const result = {
  measuredAt: new Date().toISOString(),
  directory,
  summary,
  documents: files.filter((file) => file.path.endsWith(".html")),
  scripts: files.filter((file) => file.path.endsWith(".js")),
  styles: files.filter((file) => file.path.endsWith(".css")),
};
await mkdir(join(output, ".."), { recursive: true });
await writeFile(output, JSON.stringify(result, null, 2) + "\n");
if (
  summary.avif.bytes > 400000 ||
  summary.woff2.bytes > 240000 ||
  summary.webp.bytes > 7400000 ||
  summary.js.gzipBytes > 6000 ||
  summary.css.gzipBytes > 14000 ||
  result.documents.some((file) => file.gzipBytes > 15000)
)
  throw new Error(
    "Compressed build budget exceeded: JS 6KB, CSS 14KB, each HTML 15KB; font inventory 240KB and WebP inventory 7.4MB. Review measured changes.",
  );
console.log(JSON.stringify(summary));
