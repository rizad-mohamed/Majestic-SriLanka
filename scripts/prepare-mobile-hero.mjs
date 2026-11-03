import sharp from "sharp";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const source = "assets/source/hero-sigiriya.png";
const input = await readFile(source);
const metadata = await sharp(input).metadata();
const crop = {
  width: Math.round((metadata.height * 390) / 740),
  height: metadata.height,
  top: 0,
};
// Preserve the 84% horizontal focal point in the tall phone hero.
crop.left = Math.round((metadata.width - crop.width) * 0.84);
const directory = "public/assets/majestic-sri-lanka/hero-mobile";
await mkdir(directory, { recursive: true });
const variants = [];
for (const width of [360, crop.width]) {
  const name = `hero-sigiriya-${width}.webp`;
  const result = await sharp(input)
    .extract(crop)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 76, effort: 6 })
    .toFile(`${directory}/${name}`);
  variants.push({
    file: `hero-mobile/${name}`,
    width: result.width,
    height: result.height,
    bytes: result.size,
  });
}
await writeFile(
  `${directory}/manifest.json`,
  JSON.stringify(
    {
      source,
      sourceSha256: createHash("sha256").update(input).digest("hex"),
      crop,
      variants,
    },
    null,
    2,
  ) + "\n",
);
console.log(JSON.stringify(variants));
