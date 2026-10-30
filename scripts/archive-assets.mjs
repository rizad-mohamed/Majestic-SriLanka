import { ZipArchive } from "archiver";
import { createWriteStream } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
await mkdir("deliverables", { recursive: true });
const file = "deliverables/majestic-sri-lanka-image-assets.zip";
const archive = new ZipArchive({ zlib: { level: 6 } });
const output = createWriteStream(file);
const done = new Promise((resolve, reject) => {
  output.on("close", resolve);
  output.on("error", reject);
  archive.on("error", reject);
});
archive.pipe(output);
archive.directory("public/assets/majestic-sri-lanka", "majestic-sri-lanka");
archive.directory("assets/source", "majestic-sri-lanka/source");
archive.directory("public/fonts", "majestic-sri-lanka/fonts");
archive.directory("public/licenses", "majestic-sri-lanka/licenses");
archive.file("public/favicon.svg", {
  name: "majestic-sri-lanka/branding/favicon.svg",
});
for (const style of ["normal", "italic"])
  archive.file(
    `node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-${style}.woff2`,
    {
      name: `majestic-sri-lanka/fonts/cormorant-garamond-latin-500-${style}.woff2`,
    },
  );
archive.file("docs/design-reference.md", {
  name: "majestic-sri-lanka/design-reference.md",
});
archive.file("docs/image-generation-prompts.md", {
  name: "majestic-sri-lanka/image-generation-prompts.md",
});
await archive.finalize();
await done;
const bytes = await readFile(file);
const checksum = createHash("sha256").update(bytes).digest("hex");
await import("node:fs/promises").then((fs) =>
  fs.writeFile(
    `${file}.sha256`,
    `${checksum}  majestic-sri-lanka-image-assets.zip\n`,
  ),
);
console.log(`${file}: ${bytes.length} bytes; SHA-256 ${checksum}`);
