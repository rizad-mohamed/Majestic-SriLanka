import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { tours } from "../../src/data/tours.ts";

const original = JSON.parse(
  await readFile("tests/fixtures/original-itineraries.json", "utf8"),
);
const tour = (id) => tours.find((item) => item.id === id);

test("requested itineraries preserve every protected day and exact day counts", () => {
  const birds = tour("birds-and-beasts");
  const ancient = tour("ancient-secrets");
  const romantic = tour("romantic-island");
  assert.equal(birds.days, 18);
  assert.equal(birds.itinerary.length, 18);
  assert.deepEqual(birds.itinerary.slice(0, 5), original[birds.id].slice(0, 5));
  assert.deepEqual(birds.itinerary.map((day) => day[0]).slice(5), [
    "Habarana",
    "Habarana",
    "Kandy",
    "Nuwara Eliya",
    "Nuwara Eliya",
    "Ella",
    "Yala",
    "Yala",
    "Sinharaja",
    "Sinharaja",
    "Bentota",
    "Bentota",
    "Airport Transfer",
  ]);
  assert.deepEqual(birds.itinerary[14], original[birds.id][12]);
  assert.equal(ancient.days, 15);
  assert.equal(ancient.itinerary.length, 15);
  for (const day of [0, 1, 2, 3, 4, 7, 8])
    assert.deepEqual(ancient.itinerary[day], original[ancient.id][day]);
  assert.deepEqual(ancient.itinerary.map((day) => day[0]).slice(9), [
    "Nuwara Eliya",
    "Ella",
    "Galle",
    "Galle",
    "Bentota",
    "Airport Transfer",
  ]);
  assert.equal(romantic.itinerary.length, original[romantic.id].length);
  for (let day = 0; day < romantic.itinerary.length; day++) {
    if (day !== 8)
      assert.deepEqual(romantic.itinerary[day], original[romantic.id][day]);
  }
  assert.match(
    romantic.itinerary[8][1],
    /evening safari.*romantic dinner beside the lake/,
  );
  assert.deepEqual(
    tour("tropical-bliss").itinerary,
    original["tropical-bliss"],
  );
});

test("new licensed photographs have reproducible local assets and unchanged frame ratios", async () => {
  const { assets } = JSON.parse(
    await readFile(
      "public/assets/majestic-sri-lanka/experience-updates/manifest.json",
      "utf8",
    ),
  );
  assert.equal(assets.length, 8);
  for (const asset of assets) {
    assert.equal(asset.commercialUse, true);
    assert.ok(asset.source.startsWith("https://"));
    assert.ok(asset.licenseUrl.startsWith("https://"));
    const input = await readFile(asset.localSource);
    assert.equal(
      createHash("sha256").update(input).digest("hex"),
      asset.sourceSha256,
    );
    for (const variant of asset.variants) {
      const metadata = await sharp(
        `public/assets/majestic-sri-lanka/${variant.file}`,
      ).metadata();
      assert.equal(metadata.width, variant.width);
      assert.equal(metadata.height, variant.height);
      const ratio = asset.key.endsWith("Inset") ? 4 / 3 : 5 / 3;
      assert.ok(Math.abs(metadata.width / metadata.height - ratio) < 0.01);
    }
  }
  assert.equal(
    assets.some((asset) => asset.key.startsWith("rathugala")),
    false,
  );
});

test("photo 8515 reconstruction changes no pixels outside the removal mask", async () => {
  const original = await sharp(
    "assets/source/november-updates/gallery-8515-original.webp",
  )
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const edited = await sharp(
    "assets/source/november-updates/gallery-8515-edited.png",
  )
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const mask = await sharp(
    "assets/source/november-updates/gallery-8515-removal-mask.svg",
  )
    .ensureAlpha()
    .extractChannel("alpha")
    .raw()
    .toBuffer();
  assert.deepEqual(edited.info, original.info);
  let changed = 0;
  for (let pixel = 0; pixel < mask.length; pixel++) {
    for (let channel = 0; channel < 3; channel++) {
      const index = pixel * 3 + channel;
      if (mask[pixel] === 0)
        assert.equal(edited.data[index], original.data[index]);
      else if (edited.data[index] !== original.data[index]) changed++;
    }
  }
  assert.ok(changed > 1000);
});
