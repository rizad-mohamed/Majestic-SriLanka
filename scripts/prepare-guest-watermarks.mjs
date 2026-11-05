import {
  readFile,
  readdir,
  mkdir,
  writeFile,
  unlink,
  rename,
} from "node:fs/promises";
import { resolve, join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { guestPhotos } from "../src/data/guest-photos.ts";

const run = promisify(execFile);
const sourceDirectory = resolve(process.argv[2] || "../IMG");
const preview = process.argv.includes("--preview");
const destination = preview
  ? ".local/watermark-preview"
  : "public/assets/majestic-sri-lanka/guests";
const sourceFiles = await readdir(sourceDirectory);
const logoPath = "public/assets/majestic-sri-lanka/branding/logo.webp";
const logo = await sharp(await readFile(logoPath))
  .trim({ background: "#00000000" })
  .png()
  .toBuffer();
const logoSize = await sharp(logo).metadata();
await mkdir(join(destination, "cards"), { recursive: true });
await mkdir(".local/guest-watermark", { recursive: true });
const hash = (value) => createHash("sha256").update(value).digest("hex");

async function mark(buffer) {
  const { width, height } = await sharp(buffer).metadata();
  const margin = Math.round(width * 0.025);
  const badgeWidth = Math.round(width * 0.25);
  const padding = Math.round(badgeWidth * 0.08);
  const logoWidth = badgeWidth - padding * 2;
  const logoHeight = Math.round((logoWidth * logoSize.height) / logoSize.width);
  const badgeHeight = logoHeight + padding * 2;
  const badge = Buffer.from(
    `<svg width="${badgeWidth}" height="${badgeHeight}"><rect width="${badgeWidth}" height="${badgeHeight}" rx="${Math.round(padding * 0.7)}" fill="white" fill-opacity=".78"/></svg>`,
  );
  const badgeLogo = await sharp(logo)
    .resize(logoWidth, logoHeight)
    .png()
    .toBuffer();
  const overlay = await sharp(badge)
    .composite([{ input: badgeLogo, left: padding, top: padding }])
    .png()
    .toBuffer();
  const result = await sharp(buffer)
    .composite([
      { input: overlay, left: width - badgeWidth - margin, top: margin },
    ])
    .webp({ quality: 82, effort: 6 })
    .toBuffer();
  if (result.length > 400000)
    throw new Error("Watermarked photo exceeds 400 KB");
  return { buffer: result, width, height, bytes: result.length };
}

async function saveImage(path, buffer) {
  const temporary = path + ".tmp";
  await writeFile(temporary, buffer);
  for (let attempt = 0; ; attempt++) {
    try {
      await rename(temporary, path);
      return;
    } catch (error) {
      if (
        attempt >= 5 ||
        !["UNKNOWN", "EBUSY", "EPERM", "EACCES"].includes(error.code)
      )
        throw error;
      await new Promise((done) => setTimeout(done, 200));
    }
  }
}

const records = [];
for (const [index, [id]] of guestPhotos.entries()) {
  if (preview && index > 0) break;
  const filename = sourceFiles.find((name) =>
    new RegExp(`^IMG_${id}\\.`, "i").test(name),
  );
  if (!filename) throw new Error(`Missing original photo IMG_${id}`);
  const originalPath = join(sourceDirectory, filename);
  const original = await readFile(originalPath);
  let normalized;
  try {
    normalized = await sharp(original)
      .rotate()
      .resize({
        width: 900,
        height: 1100,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();
  } catch (error) {
    if (!/\.heic$/i.test(filename)) throw error;
    const temporary = `.local/guest-watermark/img_${id}.jpg`;
    await run(
      process.env.HEIF_CONVERT_PATH || "heif-convert",
      ["--quiet", originalPath, temporary],
      { windowsHide: true },
    );
    try {
      normalized = await sharp(temporary)
        .rotate()
        .resize({
          width: 900,
          height: 1100,
          fit: "inside",
          withoutEnlargement: true,
        })
        .png()
        .toBuffer();
    } finally {
      await unlink(temporary);
    }
  }
  const full = await mark(normalized);
  const cardWidth = 620;
  const cropped = await sharp(normalized)
    .resize(cardWidth, 820, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
  const card = await mark(cropped);
  await saveImage(join(destination, `img_${id}.webp`), full.buffer);
  await saveImage(join(destination, "cards", `img_${id}.webp`), card.buffer);
  if (hash(await readFile(originalPath)) !== hash(original))
    throw new Error(`Original unexpectedly changed: ${filename}`);
  records.push({
    id,
    source: filename,
    sourceSha256: hash(original),
    full: {
      width: full.width,
      height: full.height,
      bytes: full.bytes,
      sha256: hash(full.buffer),
    },
    card: {
      width: card.width,
      height: card.height,
      bytes: card.bytes,
      sha256: hash(card.buffer),
    },
  });
}
if (!preview)
  await writeFile(
    "docs/gallery/watermark-manifest.json",
    JSON.stringify(
      {
        version: "logo-v2",
        logoSha256: hash(await readFile(logoPath)),
        placement: "upper-right",
        backingOpacity: 0.78,
        sourceFilesUnchanged: true,
        photos: records,
      },
      null,
      2,
    ) + "\n",
  );
console.log(
  JSON.stringify({
    photos: records.length,
    fullBytes: records.reduce((sum, record) => sum + record.full.bytes, 0),
    cardBytes: records.reduce((sum, record) => sum + record.card.bytes, 0),
    preview,
  }),
);
