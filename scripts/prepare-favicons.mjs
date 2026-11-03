import sharp from "sharp";
import { writeFile } from "node:fs/promises";

// Preserve the supplied complete logo. Trim transparent margins; never redraw it.
const logo = await sharp("assets/source/majestic-logo.png")
  .trim()
  .png()
  .toBuffer();
const icons = new Map();
for (const size of [16, 32, 48, 180, 192, 512]) {
  const inset = Math.max(1, Math.round(size * 0.06));
  const artwork = await sharp(logo)
    .resize(size - inset * 2, size - inset * 2, { fit: "inside" })
    .png()
    .toBuffer();
  const buffer = await sharp({
    create: { width: size, height: size, channels: 4, background: "#fff" },
  })
    .composite([{ input: artwork, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  const filename =
    size === 180
      ? "apple-touch-icon.png"
      : size >= 192
        ? `icon-${size}.png`
        : `favicon-${size}x${size}.png`;
  await writeFile(`public/${filename}`, buffer);
  icons.set(size, buffer);
}
const sizes = [16, 32, 48];
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, index) => {
  const entry = 6 + index * 16;
  const data = icons.get(size);
  header[entry] = size;
  header[entry + 1] = size;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(data.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += data.length;
});
await writeFile(
  "public/favicon.ico",
  Buffer.concat([header, ...sizes.map((size) => icons.get(size))]),
);
await writeFile(
  "public/favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><image width="192" height="192" href="data:image/png;base64,${icons.get(192).toString("base64")}"/></svg>\n`,
);
await writeFile(
  "public/site.webmanifest",
  JSON.stringify(
    {
      name: "Majestic Sri Lanka",
      short_name: "Majestic",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      theme_color: "#073e33",
      background_color: "#ffffff",
      display: "browser",
    },
    null,
    2,
  ) + "\n",
);
console.log("Generated complete-logo SVG, ICO, PNG and Apple touch icons.");
