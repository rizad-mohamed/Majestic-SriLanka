import sharp from "sharp";

// Keep the supplied original intact; ship a lossless WebP at twice the largest
// rendered width instead of downloading the full 1254px source on every page.
await sharp("assets/source/majestic-logo.png")
  .resize({ width: 436, withoutEnlargement: true })
  .webp({ lossless: true, effort: 6 })
  .toFile("public/assets/majestic-sri-lanka/branding/logo.webp");
