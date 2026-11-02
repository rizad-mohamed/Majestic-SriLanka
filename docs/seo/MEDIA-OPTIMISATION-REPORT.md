# Media delivery review

Existing assets are preserved. There are 14 scene sets and 85 deployed WebP files including the supplied logo. The manifest records 11 generated source scenes and derived crops. They are generated photography-style assets, not authentic photographs documenting guests, staff or completed tours. Client approval or original replacements remains a launch requirement.

Baseline deployed WebP inventory is 7,026,984 bytes across all variants and all pages. This is the entire deployable inventory, not initial page transfer. One responsive source is selected per image. Existing 240/360/480/720/960/1600 filename variants retain actual pixel-width descriptors, including source-size limits; originals are not upscaled just to meet filenames. Source PNGs and masks remain unchanged.

| Significant scene                                        | Existing intended ratio / role       | Delivery and decision                                                             |
| -------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| hero-sigiriya                                            | 2:1 homepage hero                    | Eager high priority; responsive WebP; no blanket image preloads                   |
| hill-country                                             | 4:3 landscape / secondary hero       | Existing variants and scene selector preserved                                    |
| cultural-triangle, blue-train, southern-coast            | 5:3 suggested tours                  | Lazy cards, descriptive ALT; modal images remain local                            |
| elephant                                                 | 4:5 story crop                       | Existing mask and explicit ratio preserved                                        |
| reservoir-travellers                                     | 4:3 experience/planner hero          | Shared local sources; eager when page hero                                        |
| wildlife, culture, beaches, tea-country, sri-lankan-food | 3:5 experience crops                 | Experience page now describes actual scenes rather than repeating category labels |
| tea-pickers                                              | 2:1 supporting image / about hero    | Existing scene and transparent note preserved                                     |
| tropical-cta                                             | 3:1 closing strip                    | Lazy loading retained                                                             |
| supplied logo                                            | 436×436 transparent WebP source      | Existing approved header/footer framing preserved                                 |
| botanical/paper SVGs                                     | Decorative or meaningful annotations | Empty decorative ALT; text-bearing notes retain descriptions                      |

`Photo.astro` now derives default intrinsic dimensions from the selected manifest image instead of imposing 1600×1000 on every crop. Explicit dimensions are preserved where the component's design specifies them. CSS masks, focus/crops, paper notes and botanical artwork are unchanged. Open Graph/Twitter use relevant page imagery with exact manifest dimensions and descriptions; existing images are reused rather than generating arbitrary replacements.

No hero video exists; the story button opens the existing story dialog. No video was added or claimed as optimized. No CDN image service is configured. Browser tests decode all images and check natural widths; build validation verifies every manifest width, height and intended ratio. The measured Experiences hero now has four AVIF widths from the same source/crop, with native WebP fallback. The 960px AVIF is 92,784 bytes versus 146,984 bytes in WebP; the four optional files total 345,993 bytes. Other scenes retain their existing WebP delivery. Regenerate with npm run assets:hero; the original PNGs and WebP files are preserved.

Fonts are local WOFF2 with swap/fallback, selected critical preloads and no external font requests. Baseline bundle totals and final measurements are in PERFORMANCE-REPORT.md. Native static compression, cache headers and actual CDN behavior require host verification; local gzip measurements are comparative estimates only.

Expanded mobile auditing found Experiences photos advertised as full viewport width despite real side gutters and 40% desktop columns. Their sizes values now match the actual CSS widths, selecting existing smaller variants without reducing required pixel density or changing the visible crop. Offscreen rows defer rendering; original image bytes are unchanged. Before/after measurements are in PERFORMANCE-REPORT.md.
