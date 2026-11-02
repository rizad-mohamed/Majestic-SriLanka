import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const directory = "public/assets/majestic-sri-lanka/photography";
const input = "assets/source/hill-country.png";
const original = await sharp(input).metadata();
await mkdir(directory, { recursive: true });
const variants = [];
for (const requested of [480, 720, 960, 1600]) {
  const width = Math.min(
    requested,
    original.width,
    Math.floor((original.height * 4) / 3),
  );
  if (variants.some((variant) => variant.width === width)) continue;
  const file = `photography/hill-country-${width}.avif`;
  const info = await sharp(input)
    .resize(width, Math.round((width * 3) / 4), {
      fit: "cover",
      position: "centre",
      withoutEnlargement: true,
    })
    .avif({ quality: 50, effort: 5 })
    .toFile(`public/assets/majestic-sri-lanka/${file}`);
  variants.push({
    file,
    width: info.width,
    height: info.height,
    bytes: info.size,
  });
}
await writeFile(
  "public/assets/majestic-sri-lanka/hero-formats.json",
  JSON.stringify({ "hill-country": variants }, null, 2) + "\n",
);
console.log(
  `Prepared ${variants.length} AVIF hero widths from the existing source; WebP fallback preserved.`,
);
