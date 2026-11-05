import { readFile, access } from "node:fs/promises";
import { resolve, join } from "node:path";
import assert from "node:assert/strict";
import sharp from "sharp";
const root = resolve(process.env.SEO_DIST_DIR || "dist");
const routes = [
  "/",
  "/tours/",
  "/gallery/",
  "/tailor-made/",
  "/experiences/",
  "/about-us/",
  "/plan-your-trip/",
  "/contact-us/",
];
const decode = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCodePoint(parseInt(n, 16)),
    )
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const attrs = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/\s([\w:-]+)(?:="([^"]*)")?(?=\s|\/?>)/g)].map(
      ([, key, value]) => [key, decode(value ?? "")],
    ),
  );
const titleSet = new Set(),
  descriptionSet = new Set();
const documents = new Map(
  await Promise.all(
    routes.map(async (route) => [
      route,
      await readFile(join(root, route, "index.html"), "utf8"),
    ]),
  ),
);
let site, indexing;
for (const [route, html] of documents) {
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `One h1: ${route}`,
  );
  assert.match(html, /<html lang="en"/);
  const title = decode(html.match(/<title>(.*?)<\/title>/)?.[1] || "");
  assert.ok(title && !titleSet.has(title), `Unique title: ${route}`);
  titleSet.add(title);
  const meta = [...html.matchAll(/<meta\s[^>]*>/g)].map((match) =>
    attrs(match[0]),
  );
  const content = (key) => {
    const found = meta.filter(
      (item) => item.name === key || item.property === key,
    );
    assert.equal(found.length, 1, `Exactly one ${key}: ${route}`);
    return found[0].content;
  };
  const description = content("description");
  assert.ok(
    description && !descriptionSet.has(description),
    `Unique description: ${route}`,
  );
  descriptionSet.add(description);
  assert.equal(content("og:title"), title);
  assert.equal(content("twitter:title"), title);
  assert.equal(content("og:description"), description);
  assert.equal(content("twitter:description"), description);
  assert.equal(content("twitter:card"), "summary_large_image");
  assert.ok(content("og:image:alt"));
  assert.ok(content("twitter:image:alt"));
  const canonicals = [...html.matchAll(/<link\s[^>]*>/g)]
    .map((match) => attrs(match[0]))
    .filter((item) => item.rel === "canonical");
  assert.equal(canonicals.length, 1, `One canonical: ${route}`);
  const canonical = new URL(canonicals[0].href);
  site ??= canonical.origin;
  assert.equal(canonical.href, `${site}${route}`, `Canonical path: ${route}`);
  if (process.env.SEO_EXPECT_ORIGIN)
    assert.equal(site, process.env.SEO_EXPECT_ORIGIN);
  const robots = content("robots");
  indexing ??= robots === "index, follow";
  assert.equal(robots, indexing ? "index, follow" : "noindex, nofollow");
  if (process.env.SEO_EXPECT_INDEXABLE)
    assert.equal(indexing, process.env.SEO_EXPECT_INDEXABLE === "true");
  assert.equal(content("og:url"), canonical.href);
  const imageUrl = new URL(content("og:image"));
  assert.equal(imageUrl.origin, site);
  assert.equal(content("twitter:image"), imageUrl.href);
  const image = await sharp(join(root, imageUrl.pathname)).metadata();
  assert.equal(Number(content("og:image:width")), image.width);
  assert.equal(Number(content("og:image:height")), image.height);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Unique IDs: ${route}`);
  const schemas = [
    ...html.matchAll(
      /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
    ),
  ];
  assert.equal(schemas.length, 1);
  const schema = JSON.parse(schemas[0][1]);
  assert.equal(schema["@context"], "https://schema.org");
  const graph = schema["@graph"];
  assert.ok(Array.isArray(graph));
  const graphIds = graph.map((node) => node["@id"]);
  assert.equal(new Set(graphIds).size, graphIds.length);
  const organization = graph.filter((node) => node["@type"] === "Organization");
  assert.equal(organization.length, 1);
  assert.equal(organization[0]["@id"], `${site}/#organization`);
  assert.ok(!("address" in organization[0]));
  assert.ok(!("aggregateRating" in organization[0]));
  const pageType =
    route === "/about-us/"
      ? "AboutPage"
      : route === "/contact-us/"
        ? "ContactPage"
        : ["/tours/", "/experiences/", "/gallery/"].includes(route)
          ? "CollectionPage"
          : "WebPage";
  const page = graph.find((node) => node["@type"] === pageType);
  assert.equal(page?.url, canonical.href);
  assert.equal(page?.isPartOf["@id"], `${site}/#website`);
  if (route !== "/") {
    const breadcrumb = graph.find((node) => node["@type"] === "BreadcrumbList");
    assert.equal(breadcrumb?.itemListElement.at(-1).item, canonical.href);
    assert.match(html, /aria-label="Breadcrumb"/);
  }
  for (const match of html.matchAll(/<img\s[^>]*>/g)) {
    const image = attrs(match[0]);
    assert.ok("alt" in image, `Image ALT: ${route}`);
    assert.ok(
      Number(image.width) > 0 && Number(image.height) > 0,
      `Image dimensions: ${route}`,
    );
    assert.ok(image.src.startsWith("/"), "No hotlinked images");
  }
  for (const match of html.matchAll(/(?:src|href)="(\/[^" ]*|#[^"]*)"/g)) {
    const url = new URL(decode(match[1]), canonical.href);
    if (url.pathname.endsWith("/")) {
      const target = documents.get(url.pathname);
      assert.ok(target, `Internal route ${url.pathname} in ${route}`);
      if (url.hash)
        assert.ok(
          target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
          `Anchor ${url.href}`,
        );
    } else await access(join(root, url.pathname));
  }
}
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
assert.match(
  sitemap,
  /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/,
);
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
  decode(match[1]),
);
assert.deepEqual(
  locations.sort(),
  indexing ? routes.map((route) => `${site}${route}`).sort() : [],
);
assert.ok(!sitemap.includes("<lastmod>"), "No fabricated lastmod");
const robots = await readFile(join(root, "robots.txt"), "utf8");
assert.match(robots, /User-agent: \*/);
assert.match(robots, /Allow: \//);
assert.doesNotMatch(robots, /Disallow: \//);
if (indexing) assert.ok(robots.includes(`Sitemap: ${site}/sitemap.xml`));
else assert.ok(!robots.includes("Sitemap:"));
const notFound = await readFile(join(root, "404.html"), "utf8");
assert.match(notFound, /name="robots" content="noindex, nofollow"/);
assert.doesNotMatch(notFound, /rel="canonical"/);
const redirects = await readFile(join(root, "_redirects"), "utf8");
const rules = redirects
  .trim()
  .split(/\r?\n/)
  .map((line) => line.trim().split(/\s+/));
assert.deepEqual(
  rules,
  routes
    .filter((route) => route !== "/")
    .map((route) => [route.slice(0, -1), route, "301"]),
);
const manifest = JSON.parse(
  await readFile("public/assets/majestic-sri-lanka/manifest.json", "utf8"),
);
assert.equal(manifest.photographyCount, 14);
assert.equal(manifest.sourceCount, 11);
for (const asset of manifest.assets)
  for (const variant of asset.variants || []) {
    const image = await sharp(
      `public/assets/majestic-sri-lanka/${variant.file}`,
    ).metadata();
    assert.equal(image.width, variant.width);
    assert.equal(image.height, variant.height);
    assert.ok(
      Math.abs(image.width / image.height - asset.intendedAspectRatio) < 0.01,
    );
  }
for (const asset of manifest.assets.filter(
  (asset) => asset.transparentPixels !== undefined,
))
  assert.ok(asset.transparentPixels > 0);

const formats = JSON.parse(
  await readFile(
    join(root, "assets/majestic-sri-lanka/hero-formats.json"),
    "utf8",
  ),
);
for (const variants of Object.values(formats))
  for (const variant of variants) {
    const image = await sharp(
      join(root, "assets/majestic-sri-lanka", variant.file),
    ).metadata();
    assert.equal(image.width, variant.width);
    assert.equal(image.height, variant.height);
  }
assert.match(documents.get("/experiences/"), /<source type="image\/avif"/);
console.log(
  `PASS: ${routes.length} ${indexing ? "indexable production" : "noindex preview"} pages; metadata, canonicals, schema graph, links/anchors, image metadata, sitemap, robots and 404.`,
);
