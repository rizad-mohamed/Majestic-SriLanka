import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";

// Supplied originals are committed so these derivatives can be reproduced.
const sourceDirectory = "assets/source/november-updates";
const directory = "public/assets/majestic-sri-lanka/updates";
await mkdir(directory, { recursive: true });
const assets = [];
for (const [name, source] of [
  ["birds-and-beasts", "birds-and-beasts.jpg"],
  ["ancient-secrets", "ancient-secrets.jpeg"],
  ["romantic-island", "romantic-island.jpeg"],
  ["tropical-bliss", "tropical-bliss.png"],
  ["lasith-koralage", "lasith-koralage.jpeg"],
]) {
  const input = await readFile(`${sourceDirectory}/${source}`);
  const variants = [];
  for (const width of [360, 720, 1200]) {
    const file = `updates/${name}-${width}.webp`;
    const result = await sharp(input)
      .rotate()
      .resize(width, Math.round((width * 3) / 5), {
        fit: "cover",
        position: name === "birds-and-beasts" ? "north" : "centre",
        withoutEnlargement: true,
      })
      .webp({ quality: 80, effort: 6 })
      .toFile(`public/assets/majestic-sri-lanka/${file}`);
    variants.push({
      file,
      width: result.width,
      height: result.height,
      bytes: result.size,
    });
  }
  assets.push({
    name,
    source: `${sourceDirectory}/${source}`,
    sourceSha256: createHash("sha256").update(input).digest("hex"),
    provenance:
      "User-supplied photograph; cropped, resized and encoded as WebP. Location and documentary authenticity not independently verified.",
    variants,
  });
}
await writeFile(
  `${directory}/manifest.json`,
  JSON.stringify({ assets }, null, 2) + "\n",
);
console.log(
  `Prepared ${assets.length} supplied photographs (${assets.flatMap((a) => a.variants).reduce((sum, v) => sum + v.bytes, 0)} bytes across all variants).`,
);
