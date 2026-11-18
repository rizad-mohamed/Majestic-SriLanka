import { readFile } from "node:fs/promises";
import sharp from "sharp";

const logo = await sharp(
  await readFile("public/assets/majestic-sri-lanka/branding/logo.webp"),
)
  .trim({ background: "#00000000" })
  .png()
  .toBuffer();
const logoSize = await sharp(logo).metadata();

export async function watermarkPhoto(buffer) {
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
