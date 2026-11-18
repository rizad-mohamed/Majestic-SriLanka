import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";

const sources = JSON.parse(
  await readFile("assets/source/experience-update-sources.json", "utf8"),
);
const directory = "public/assets/majestic-sri-lanka/experience-updates";
await mkdir(directory, { recursive: true });
const assets = [];
for (const source of sources) {
  const input = await readFile(source.localSource);
  const inset = source.key.endsWith("Inset");
  const variants = [];
  for (const width of inset ? [320, 640] : [360, 720, 960]) {
    const file = `experience-updates/${source.key}-${width}.webp`;
    const result = await sharp(input)
      .rotate(source.key === "upper-diyalumaInset" ? -90 : undefined)
      .resize(width, Math.round(width / (inset ? 4 / 3 : 5 / 3)), {
        fit: "cover",
        position:
          source.key === "private-beach-partiesInset" ? "south" : "centre",
        withoutEnlargement: true,
      })
      .webp({ quality: 78, effort: 6 })
      .toFile(`public/assets/majestic-sri-lanka/${file}`);
    variants.push({
      file,
      width: result.width,
      height: result.height,
      bytes: result.size,
    });
  }
  assets.push({
    ...source,
    sourceSha256: createHash("sha256").update(input).digest("hex"),
    variants,
  });
}
await writeFile(
  `${directory}/manifest.json`,
  JSON.stringify({ assets }, null, 2) + "\n",
);
console.log(
  `Prepared ${assets.length} credited image placements (${assets.flatMap((asset) => asset.variants).reduce((sum, variant) => sum + variant.bytes, 0)} bytes across all variants).`,
);
