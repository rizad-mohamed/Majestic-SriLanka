import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { basename } from "node:path";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
const input = process.argv[2];
if (!input)
  throw new Error(
    "Usage: node scripts/prepare-hero-video.mjs <supplied-video.mp4>; set FFMPEG_PATH if needed.",
  );
const run = promisify(execFile);
const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";
const directory = "public/assets/majestic-sri-lanka/video";
await mkdir(directory, { recursive: true });
await mkdir(".local/media-tools", { recursive: true });
await run(
  ffmpeg,
  [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    input,
    "-vf",
    "scale=960:-2,fps=24",
    "-c:v",
    "libx264",
    "-crf",
    "28",
    "-preset",
    "slow",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    "-map_metadata",
    "-1",
    `${directory}/island-film.mp4`,
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
    "0.5",
    "-i",
    input,
    "-frames:v",
    "1",
    "-vf",
    "scale=960:-2",
    ".local/media-tools/film-poster.png",
  ],
  { windowsHide: true },
);
await sharp(".local/media-tools/film-poster.png")
  .webp({ quality: 76 })
  .toFile(`${directory}/island-film-poster.webp`);
const original = await readFile(input);
const output = await stat(`${directory}/island-film.mp4`);
await writeFile(
  `${directory}/manifest.json`,
  JSON.stringify(
    {
      source: basename(input),
      sourceBytes: original.length,
      sourceSha256: createHash("sha256").update(original).digest("hex"),
      provenance:
        "User-supplied silent film; full sequence retained, resized and re-encoded for still-first hero and optional story playback.",
      output: "island-film.mp4",
      bytes: output.size,
      width: 960,
      height: 540,
      framesPerSecond: 24,
      codec: "H.264",
      fastStart: true,
      audio: false,
      loading:
        "Hero poster is pre-rendered on every device. The film source is attached only after an explicit Play action. The optional story dialog loads on opening.",
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Prepared hero film: ${output.size} bytes from ${original.length} supplied bytes.`,
);
