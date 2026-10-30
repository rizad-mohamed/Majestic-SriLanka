import sharp from "sharp";
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = "public/assets/majestic-sri-lanka";
const photos = {
  "hero-sigiriya": ["hero-sigiriya", 2, "Hero; misty rock fortress sunrise"],
  elephant: ["elephant", 0.8, "Story; frontal elephant among foliage"],
  "hill-country": [
    "hill-country",
    4 / 3,
    "Story inset; tea terraces and mountain layers",
  ],
  "cultural-triangle": ["hero-sigiriya", 5 / 3, "Tour; Sigiriya hero crop"],
  "blue-train": ["blue-train", 5 / 3, "Tour; blue train on a stone viaduct"],
  "southern-coast": [
    "southern-coast",
    5 / 3,
    "Tour; palm-fringed sunset beach",
  ],
  "reservoir-travellers": [
    "reservoir-travellers",
    4 / 3,
    "Experiences; two travellers at a reservoir viewpoint",
  ],
  wildlife: ["elephant", 0.6, "Experience; elephant portrait crop"],
  culture: ["culture", 0.6, "Experience; ancient temple and Buddha"],
  beaches: ["beaches", 0.6, "Experience; palms and turquoise ocean"],
  "tea-country": ["hill-country", 0.6, "Experience; tea-terrace crop"],
  "sri-lankan-food": ["sri-lankan-food", 0.6, "Experience; rice and curry"],
  "tea-pickers": ["tea-pickers", 2, "Why us; tea pickers at work"],
  "tropical-cta": ["tropical-cta", 3, "CTA; turquoise tropical bay"],
};
await mkdir(join(root, "photography"), { recursive: true });
const manifest = [];
for (const [name, [source, ratio, description]] of Object.entries(photos)) {
  const input = `assets/source/${source}.png`;
  const original = await sharp(input).metadata();
  const variants = [];
  for (const width of [240, 480, 720, 960, 1600]) {
    // Smaller source photos retain their real resolution; no artificial upscaling.
    const actualWidth = Math.min(
      width,
      original.width,
      Math.floor(original.height * ratio),
    );
    const height = Math.round(actualWidth / ratio);
    const output = join(root, "photography", `${name}-${width}.webp`);
    const info = await sharp(input)
      .resize(actualWidth, height, {
        fit: "cover",
        position: name === "cultural-triangle" ? "right" : "centre",
        withoutEnlargement: true,
      })
      .webp({ quality: 70, effort: 6 })
      .toFile(output);
    variants.push({
      file: `photography/${name}-${width}.webp`,
      width: info.width,
      height: info.height,
      bytes: info.size,
    });
  }
  manifest.push({
    name,
    description,
    source: `source/${source}.png`,
    provenance:
      name === source
        ? "AI-generated approximate recreation"
        : `Crop of generated ${source}`,
    tool: "built-in image_gen",
    alpha: false,
    intendedAspectRatio: ratio,
    originalDimensions: [original.width, original.height],
    variants,
  });
}

const wrap = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const branch = `<g fill="none" stroke="#b28b66" stroke-width="1.6" stroke-linecap="round"><path d="M24 285Q120 178 164 28M65 235Q62 178 91 113Q98 171 65 235M84 209Q126 199 179 123Q116 150 84 209M111 161Q103 108 125 57Q135 108 111 161M128 124Q169 111 194 47Q148 78 128 124M144 84Q145 31 173 5Q172 49 144 84M42 265Q23 224 31 177Q60 212 42 265"/></g>`;
const leaf = `<g fill="none" stroke="#b28b66" stroke-width="2"><path d="M24 82Q12 31 69 12Q76 60 24 82ZM24 82Q38 47 62 23M24 82L17 99"/></g>`;
const botanicals = `<g fill="#6d8d70" stroke="#526c57" stroke-width=".8" opacity=".86"><path d="M38 330Q75 175 151 9" fill="none" stroke-width="2"/><path d="M64 239Q5 202 2 159Q54 171 64 239M77 210Q112 165 172 145Q153 193 77 210M91 177Q37 143 39 93Q91 116 91 177M108 138Q149 91 187 89Q177 128 108 138M127 93Q89 58 102 20Q137 49 127 93M143 52Q153 12 175 0Q182 35 143 52M46 292Q7 272 7 226Q40 241 46 292"/></g>`;
const stamp = `<defs><path id="ring" d="M73 13a60 60 0 1 1-.1 0"/></defs><text fill="#b28b66" font-family="Arial,sans-serif" font-size="9" letter-spacing="3.1"><textPath href="#ring" startOffset="3%">LOCALLY CURATED · SRI LANKA · </textPath></text><g transform="translate(40 35) scale(.77)">${leaf}</g>`;
const note = (lines, w = 210, h = 150) =>
  wrap(
    w,
    h,
    `<path d="M5 6L${w - 9} 0L${w} ${h - 12}L10 ${h}Z" fill="#faf6ee"/><path d="M10 ${h}l11-12h${w - 37}l16 0" fill="#eee7dc" opacity=".6"/>${lines.map((line, i) => `<text x="${w / 2}" y="${44 + i * 30}" text-anchor="middle" font-family="'Segoe Print','Comic Sans MS',cursive" font-size="${w === 210 ? 19 : 23}" font-style="italic" fill="#756d60">${line}</text>`).join("")}`,
  );
const decorative = {
  "botanical-leaves.svg": wrap(190, 330, botanicals),
  "botanical-branch.svg": wrap(200, 300, branch),
  "floating-leaf.svg": wrap(90, 110, leaf),
  "locally-curated-stamp.svg": wrap(146, 146, stamp),
  "sticky-note-local.svg": note(["Authentic", "Local Experiences"]),
  "sticky-note-people.svg": note(["People", "Places", "Stories"], 160, 180),
  "handwritten-annotations.svg": wrap(
    300,
    120,
    '<g fill="#6d7d70" font-family="Segoe Print,cursive" font-style="italic" font-size="32" transform="rotate(-8 150 60)"><text x="75" y="43">More</text><text x="18" y="82">Than a Destination</text></g>',
  ),
};
await mkdir(join(root, "decorative"), { recursive: true });
for (const [file, svg] of Object.entries(decorative)) {
  await writeFile(join(root, "decorative", file), svg);
  const meta = await sharp(Buffer.from(svg)).metadata();
  const { data, info } = await sharp(Buffer.from(svg))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let transparentPixels = 0;
  for (let i = 3; i < data.length; i += info.channels)
    if (data[i] === 0) transparentPixels++;
  if (!transparentPixels)
    throw new Error(`No genuine transparent pixels in ${file}`);
  manifest.push({
    name: file,
    description: "Independently positioned authored decorative SVG",
    provenance: "Original code-authored SVG approximation of reference",
    alpha: true,
    dimensions: [meta.width, meta.height],
    transparentPixels,
  });
}
const elephantMark = `<g fill="#113c32" stroke="#113c32" stroke-linejoin="round"><path d="M8 48Q2 53 0 46Q7 48 11 38L17 23Q25 10 42 13Q59 9 68 24L76 31L80 59Q84 67 87 58L87 48L92 49L92 63Q88 76 79 71Q70 68 71 52L68 44L63 44L65 72L54 72L52 48L35 48L32 72L22 72L22 45L16 48Z" stroke-width="1"/><path d="M53 23Q67 14 73 32L70 48Q53 46 50 34Z" fill="#285243"/><path d="M18 26Q36 14 53 23L53 39L20 37Z" fill="#b58d4e"/><path d="M22 26L28 23L34 27L40 23L46 27M24 31L29 34L35 30L41 34L47 30" fill="none" stroke="#164637" stroke-width="1.5"/><circle cx="73" cy="31" r="1.6" fill="#f9e6b5"/><path d="M71 41L76 45L72 46" fill="#fff1cd" stroke="none"/></g>`;
const logo = wrap(
  340,
  92,
  `<g transform="translate(1 0) scale(1)">${elephantMark}</g><text x="111" y="38" font-family="Georgia,serif" font-size="24" font-weight="bold" letter-spacing="2.4" fill="#173b32">MAJESTIC</text><text x="112" y="60" font-family="Georgia,serif" font-size="14" font-weight="bold" letter-spacing="5.2" fill="#a48051">SRI LANKA</text>`,
);
await mkdir(join(root, "branding"), { recursive: true });
await writeFile(join(root, "branding/logo.svg"), logo);
await writeFile(
  "public/favicon.svg",
  wrap(96, 96, `<g transform="translate(2 8)">${elephantMark}</g>`),
);
manifest.push({
  name: "branding/logo.svg",
  provenance:
    "Authored approximate recreation; original brand vector not supplied",
  alpha: true,
  dimensions: [340, 92],
});
await writeFile(
  join(root, "manifest.json"),
  JSON.stringify(
    {
      generatedBy: "Majestic Sri Lanka asset preparation",
      photographyCount: Object.keys(photos).length,
      sourceCount: (await readdir("assets/source")).filter((n) =>
        n.endsWith(".png"),
      ).length,
      assets: manifest,
    },
    null,
    2,
  ),
);
await writeFile(
  join(root, "manifest.md"),
  await readFile("docs/image-asset-manifest.md"),
);
console.log(
  `Prepared ${Object.keys(photos).length} photographic scenes, ${Object.keys(decorative).length} transparent decorations and one logo.`,
);
