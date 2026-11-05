import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

test("Ella scenery cannot cover the protected original photo", async () => {
  const alpha = await sharp(
    "public/assets/majestic-sri-lanka/photography/ella-side-extensions-1165.webp",
  )
    .extract({ left: 170, top: 0, width: 825, height: 1100 })
    .extractChannel("alpha")
    .raw()
    .toBuffer();
  assert.ok(
    alpha.every((value) => value === 0),
    "Generated center must be entirely transparent",
  );
  const manifest = JSON.parse(
    await readFile("docs/gallery/watermark-manifest.json", "utf8"),
  );
  const photo = await readFile(
    "public/assets/majestic-sri-lanka/guests/img_6747.webp",
  );
  assert.equal(
    createHash("sha256").update(photo).digest("hex"),
    manifest.photos.find((photo) => photo.id === "6747").full.sha256,
  );
});
