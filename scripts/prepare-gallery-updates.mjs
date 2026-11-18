import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { watermarkPhoto } from "./lib/guest-watermark.mjs";
import { guestPhotoVersion } from "../src/data/guest-photos.ts";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const hash = (input) => createHash("sha256").update(input).digest("hex");
const sourceDirectory = "assets/source/november-updates";
const directory = "public/assets/majestic-sri-lanka/gallery-updates";
await mkdir(directory, { recursive: true });
if (process.argv.includes("--video")) {
  const run = promisify(execFile);
  const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";
  const original = `${sourceDirectory}/gallery-journey.mp4`;
  await mkdir(".local", { recursive: true });
  await run(
    ffmpeg,
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      original,
      "-map_metadata",
      "-1",
      "-an",
      "-c:v",
      "libx264",
      "-profile:v",
      "baseline",
      "-level:v",
      "3.1",
      "-preset",
      "slow",
      "-crf",
      "28",
      "-r",
      "30",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      `${directory}/crocodile-by-the-water.mp4`,
    ],
    { windowsHide: true },
  );
  await run(
    ffmpeg,
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-ss",
      "1",
      "-i",
      original,
      "-frames:v",
      "1",
      ".local/gallery-poster.png",
    ],
    { windowsHide: true },
  );
  await sharp(".local/gallery-poster.png")
    .webp({ quality: 78 })
    .toFile(`${directory}/crocodile-by-the-water-poster.webp`);
}
const input = await readFile(`${sourceDirectory}/gallery-elephant.jpeg`);
const variants = [];
for (const width of [360, 720, 1100]) {
  const normalized = await sharp(input).rotate().resize(width).png().toBuffer();
  const result = await watermarkPhoto(normalized);
  const file = `gallery-updates/elephant-on-rocky-shore-${width}.webp`;
  await writeFile(`public/assets/majestic-sri-lanka/${file}`, result.buffer);
  variants.push({
    file,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    sha256: hash(result.buffer),
  });
}
// The edited master already retains the original logo. Do not watermark it twice.
const edited = await readFile(`${sourceDirectory}/gallery-8515-edited.png`);
const manifestPath = "docs/gallery/watermark-manifest.json";
const watermarks = JSON.parse(await readFile(manifestPath, "utf8"));
const record = watermarks.photos.find((photo) => photo.id === "8515");
for (const [name, folder] of [
  ["full", ""],
  ["card", "cards/"],
]) {
  let pipeline = sharp(edited);
  if (name === "card")
    pipeline = pipeline.resize(620, 820, { fit: "cover", position: "centre" });
  const buffer = await pipeline.webp({ quality: 82, effort: 6 }).toBuffer();
  const metadata = await sharp(buffer).metadata();
  await writeFile(
    `public/assets/majestic-sri-lanka/guests/${folder}img_8515.webp`,
    buffer,
  );
  record[name] = {
    width: metadata.width,
    height: metadata.height,
    bytes: buffer.length,
    sha256: hash(buffer),
  };
}
record.editedSource = `${sourceDirectory}/gallery-8515-edited.png`;
record.editedSourceSha256 = hash(edited);
record.edit =
  "Only the highlighted person removed; reconstructed background confined to gallery-8515-removal-mask.svg. Original retained in assets/source/november-updates/gallery-8515-original.webp.";
watermarks.version = guestPhotoVersion;
await writeFile(manifestPath, JSON.stringify(watermarks, null, 2) + "\n");
const video = await readFile(`${directory}/crocodile-by-the-water.mp4`);
const poster = await readFile(
  `${directory}/crocodile-by-the-water-poster.webp`,
);
await writeFile(
  `${directory}/manifest.json`,
  JSON.stringify(
    {
      photo: {
        source: `${sourceDirectory}/gallery-elephant.jpeg`,
        sourceSha256: hash(input),
        provenance:
          "User-supplied photograph; no specific location independently verified. Resized, branded and encoded as WebP.",
        variants,
      },
      video: {
        source: `${sourceDirectory}/gallery-journey.mp4`,
        sourceSha256: hash(
          await readFile(`${sourceDirectory}/gallery-journey.mp4`),
        ),
        file: "gallery-updates/crocodile-by-the-water.mp4",
        sha256: hash(video),
        bytes: video.length,
        width: 832,
        height: 464,
        duration: 20.6,
        changes:
          "H.264 Baseline level 3.1, 30 fps, CRF 28, fast start; audio removed for a silent wildlife clip. No autoplay.",
        poster: "gallery-updates/crocodile-by-the-water-poster.webp",
        posterBytes: poster.length,
      },
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "Prepared gallery photograph, edited photo 8515, and video provenance.",
);
