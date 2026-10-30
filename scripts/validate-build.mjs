import { readFile, access } from "node:fs/promises";
import assert from "node:assert/strict";
import sharp from "sharp";
const pages = [
  "index.html",
  "tours/index.html",
  "tailor-made/index.html",
  "experiences/index.html",
  "about-us/index.html",
  "plan-your-trip/index.html",
  "contact-us/index.html",
];
const titles = new Set();
for (const path of pages) {
  const html = await readFile(`dist/${path}`, "utf8");
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One h1: ${path}`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `Unique title: ${path}`);
  titles.add(title);
  assert.match(html, /<meta name="description" content="[^"]{50,}"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /application\/ld\+json/);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Unique IDs: ${path}`);
  for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)/g)) {
    const url = match[1];
    if (url === "/") continue;
    await access(`dist${url}${url.endsWith("/") ? "index.html" : ""}`).catch(
      () => {
        throw new Error(`Missing internal destination ${url} in ${path}`);
      },
    );
  }
}
const sitemap = await readFile("dist/sitemap.xml", "utf8");
assert.equal((sitemap.match(/<loc>/g) || []).length, 7);
assert.match(await readFile("dist/robots.txt", "utf8"), /User-agent: \*/);
const manifest = JSON.parse(
  await readFile("public/assets/majestic-sri-lanka/manifest.json", "utf8"),
);
assert.equal(manifest.photographyCount, 14);
assert.equal(manifest.sourceCount, 11);
for (const asset of manifest.assets)
  for (const variant of asset.variants || []) {
    const file = `public/assets/majestic-sri-lanka/${variant.file}`;
    await access(file);
    const image = await sharp(file).metadata();
    assert.equal(
      image.width,
      variant.width,
      `Actual source width: ${variant.file}`,
    );
    assert.equal(
      image.height,
      variant.height,
      `Actual source height: ${variant.file}`,
    );
    assert.ok(
      Math.abs(image.width / image.height - asset.intendedAspectRatio) < 0.01,
      `Intended crop ratio: ${variant.file}`,
    );
  }
for (const asset of manifest.assets.filter(
  (a) => a.transparentPixels !== undefined,
))
  assert.ok(asset.transparentPixels > 0);
console.log(
  "PASS: seven pages, unique titles/h1/IDs, metadata, structured data, internal destinations, sitemap, robots, 14 photographic assets and transparent decorations.",
);
