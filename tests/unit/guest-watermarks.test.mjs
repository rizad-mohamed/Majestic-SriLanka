import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { guestPhotos, guestPhotoVersion } from "../../src/data/guest-photos.ts";

test("every public gallery photo and cropped card matches its watermarked asset record", async () => {
  const manifest = JSON.parse(
    await readFile("docs/gallery/watermark-manifest.json", "utf8"),
  );
  assert.equal(manifest.version, guestPhotoVersion);
  assert.deepEqual(
    manifest.photos.map((photo) => photo.id),
    guestPhotos.map(([id]) => id),
  );
  for (const photo of manifest.photos) {
    for (const [variant, folder] of [
      ["full", ""],
      ["card", "cards/"],
    ]) {
      const bytes = await readFile(
        `public/assets/majestic-sri-lanka/guests/${folder}img_${photo.id}.webp`,
      );
      assert.equal(
        createHash("sha256").update(bytes).digest("hex"),
        photo[variant].sha256,
        `Watermarked ${variant} ${photo.id}`,
      );
      assert.ok(bytes.length < 400000);
      const image = await sharp(bytes).metadata();
      assert.equal(image.width, photo[variant].width);
      assert.equal(image.height, photo[variant].height);
      if (variant === "card") {
        assert.equal(image.width, 620);
        assert.equal(image.height, 820);
      }
      assert.equal(image.exif, undefined);
    }
  }
  const publicPhotos = await readdir("public/assets/majestic-sri-lanka/guests");
  assert.equal(
    publicPhotos.filter((name) => name.endsWith(".webp")).length,
    guestPhotos.length,
  );
});
