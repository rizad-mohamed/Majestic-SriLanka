import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = "public/assets/majestic-sri-lanka";
const sourceDirectory = "assets/source/homepage-photography";
const sources = JSON.parse(
  await readFile(`${sourceDirectory}/sources.json`, "utf8"),
);
const baseline = JSON.parse(await readFile(`${root}/manifest.json`, "utf8"));
const baselineMobile = JSON.parse(
  await readFile(`${root}/hero-mobile/manifest.json`, "utf8"),
);
const selection = {
  "hero-sigiriya": {
    source: "sigiriya",
    crop: { left: 0, top: 3400, width: 3500, height: 1750 },
    alt: "Sigiriya rock fortress above Sri Lankan forest in warm evening light",
  },
  "cultural-triangle": {
    source: "sigiriya",
    crop: { left: 0, top: 3400, width: 3500, height: 1750 },
    alt: "Sigiriya rock fortress and forest at sunset",
  },
  elephant: {
    source: "elephant",
    alt: "An Asian elephant among dense green foliage in Yala, Sri Lanka",
  },
  wildlife: {
    source: "elephant",
    alt: "An Asian elephant in the green foliage of Yala",
  },
  "hill-country": {
    source: "tea-landscape",
    alt: "Green tea-covered hills and trees in the mist near Nuwara Eliya",
  },
  "tea-country": {
    source: "tea-landscape",
    alt: "Tea terraces and trees on a misty Nuwara Eliya hillside",
  },
  "blue-train": {
    source: "blue-train",
    alt: "A blue passenger train crossing Nine Arch Bridge in Ella, Sri Lanka",
  },
  "southern-coast": {
    source: "southern-coast",
    crop: { left: 0, top: 2000, width: 3759, height: 2255 },
    alt: "Palm fronds framing the Indian Ocean at sunset in Matara, Sri Lanka",
  },
  "reservoir-travellers": {
    source: "reservoir",
    alt: "Randenigala Reservoir surrounded by wooded hills in Sri Lanka",
  },
  culture: {
    source: "culture",
    alt: "Ancient brick ruins and stone steps at Polonnaruwa, Sri Lanka",
  },
  beaches: {
    source: "beaches",
    alt: "Coconut palms and the rocky shoreline of Mirissa, Sri Lanka",
  },
  "sri-lankan-food": {
    source: "food",
    alt: "Sri Lankan vegetable curries and dhal served in Hikkaduwa",
  },
  "tea-pickers": {
    source: "tea-worker",
    alt: "A woman picking tea leaves at Talawakelle, Sri Lanka",
  },
  "tropical-cta": {
    source: "tropical-cta",
    alt: "Turquoise water, coastal rocks and coconut palms at Mirissa Beach, Sri Lanka",
  },
};

await mkdir(`${root}/homepage/photography`, { recursive: true });
await mkdir(`${root}/homepage/hero-mobile`, { recursive: true });
const assets = [];
let heroMaster;
for (const [name, choice] of Object.entries(selection)) {
  const source = sources.photos.find((item) => item.id === choice.source);
  if (
    !source?.commercialUse ||
    !source.modificationPermitted ||
    source.attributionRequired
  )
    throw new Error(`Source rights require review: ${name}`);
  const input = await readFile(source.file);
  if (createHash("sha256").update(input).digest("hex") !== source.sha256)
    throw new Error(`Photographic master changed: ${name}`);
  // Explicit crops are taken from the licensed frame, without generative fill,
  // object replacement, mirroring, upscaling or changes to the page's CSS crop.
  const master = await (
    choice.crop
      ? sharp(input).rotate().extract(choice.crop)
      : sharp(input).rotate()
  )
    .png()
    .toBuffer();
  if (name === "hero-sigiriya") heroMaster = master;
  const reference = baseline.assets.find((item) => item.name === name);
  const variants = [];
  const avifVariants = [];
  for (const original of reference.variants) {
    const file = `homepage/photography/${name}-${original.file.match(/-(\d+)\.webp$/)[1]}.webp`;
    const output = sharp(master).resize(original.width, original.height, {
      fit: "cover",
      position: name === "cultural-triangle" ? "right" : "centre",
      withoutEnlargement: true,
    });
    const result = await output
      .clone()
      .webp({ quality: original.width <= 480 ? 72 : 78, effort: 6 })
      .toFile(`${root}/${file}`);
    if (result.width !== original.width || result.height !== original.height)
      throw new Error(`Source cannot fill the approved dimensions: ${name}`);
    variants.push({
      file,
      width: result.width,
      height: result.height,
      bytes: result.size,
    });
    if (
      ["hero-sigiriya", "hill-country", "southern-coast"].includes(name) &&
      original.width >= 480
    ) {
      const avifFile = file.replace(/\.webp$/, ".avif");
      const avif = await output
        .clone()
        .avif({ quality: 54, effort: 5 })
        .toFile(`${root}/${avifFile}`);
      avifVariants.push({
        file: avifFile,
        width: avif.width,
        height: avif.height,
        bytes: avif.size,
      });
    }
  }
  assets.push({
    name,
    alt: choice.alt,
    sourceId: source.id,
    photographer: source.photographer,
    sourceUrl: source.sourceUrl,
    license: source.license,
    licenseUrl: source.licenseUrl,
    attributionRequired: source.attributionRequired,
    verifiedOn: source.verifiedOn,
    sourceSha256: source.sha256,
    ...(choice.crop ? { sourceCrop: choice.crop } : {}),
    variants,
    avifVariants,
  });
}
// Keep the exact approved phone output dimensions and 84% focal convention.
const meta = await sharp(heroMaster).metadata();
const crop = {
  width: Math.round(
    (meta.height * baselineMobile.crop.width) / baselineMobile.crop.height,
  ),
  height: meta.height,
  top: 0,
};
crop.left = Math.round((meta.width - crop.width) * 0.84);
const mobileVariants = [];
for (const reference of baselineMobile.variants) {
  for (const format of ["webp", "avif"]) {
    const file = `homepage/hero-mobile/hero-sigiriya-${reference.width}.${format}`;
    const resized = sharp(heroMaster)
      .extract(crop)
      .resize(reference.width, reference.height, { withoutEnlargement: true });
    const result = await resized[format]({
      quality: format === "webp" ? 78 : 54,
      effort: format === "webp" ? 6 : 5,
    }).toFile(`${root}/${file}`);
    mobileVariants.push({
      file,
      width: result.width,
      height: result.height,
      bytes: result.size,
      format,
    });
  }
}
const manifest = {
  collection: "Homepage documentary photography",
  verifiedOn: sources.verifiedOn,
  baselineCommit: "e5d432b9028563d0fbcf6f2fd5fdca48e64c084d",
  sourceCount: sources.photos.length,
  assets,
  mobile: {
    crop,
    width: baselineMobile.crop.width,
    height: baselineMobile.crop.height,
    variants: mobileVariants,
  },
};
await writeFile(
  `${root}/homepage/manifest.json`,
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    scenes: assets.length,
    sources: sources.photos.length,
    webpBytes: assets
      .flatMap((a) => a.variants)
      .reduce((n, a) => n + a.bytes, 0),
    avifBytes: assets
      .flatMap((a) => a.avifVariants)
      .reduce((n, a) => n + a.bytes, 0),
    mobileBytes: mobileVariants.reduce((n, a) => n + a.bytes, 0),
  }),
);
