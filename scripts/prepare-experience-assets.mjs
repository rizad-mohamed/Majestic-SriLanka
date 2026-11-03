import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const sources = JSON.parse(
  await readFile("assets/source/experience-sources.json", "utf8"),
);
const directory = "public/assets/majestic-sri-lanka/experiences";
await mkdir(directory, { recursive: true });
const assets = [];
for (const source of sources) {
  const cache = `.local/experience-sources/${source.key}.jpg`;
  let input;
  try {
    input = await readFile(cache);
  } catch (error) {
    if (error.code !== "ENOENT" || !process.argv.includes("--download"))
      throw new Error(
        `Missing ${cache}. Run assets:experiences -- --download to retrieve the credited original.`,
        { cause: error },
      );
  }
  if (!input) {
    const response = await fetch(source.download, {
      headers: { "User-Agent": "MajesticSriLankaAssetPreparation/1.0" },
    });
    if (!response.ok)
      throw new Error(`${source.title}: HTTP ${response.status}`);
    input = Buffer.from(await response.arrayBuffer());
    await mkdir(".local/experience-sources", { recursive: true });
    await writeFile(cache, input);
  }
  const inset = source.key.endsWith("Inset");
  const variants = [];
  for (const width of inset ? [320, 640] : [360, 720, 960]) {
    const file = `experiences/${source.key}-${width}.webp`;
    const result = await sharp(input)
      .resize(width, Math.round(width / (inset ? 4 / 3 : 5 / 3)), {
        fit: "cover",
        withoutEnlargement: true,
      })
      .webp({ quality: inset ? 64 : 62, effort: 6 })
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
  `Prepared ${assets.length} documentary photographs; ${assets.flatMap((asset) => asset.variants).reduce((sum, file) => sum + file.bytes, 0)} bytes.`,
);
