# Asset plan and provenance

No individual original photographic assets were supplied. The full homepage reference is never used as a flattened page. Photography is generated as independent approximate recreations with the built-in image tool; it is not recovered original photography or a verified documentary record. Prompts and production dimensions are recorded in `public/assets/majestic-sri-lanka/manifest.json` after preparation.

| Asset | Scene / placement | Intended aspect | Alpha | Source |
|---|---|---|---|---|
| hero-sigiriya | Rock right of center, misty jungle sunrise / hero | 2:1 | no | generated |
| elephant | Frontal Sri Lankan elephant among foliage / story | 4:5 | no | generated |
| hill-country | Tea terraces and mountains / story inset | 4:3 | no | generated |
| cultural-triangle | Sigiriya / tour | 5:3 | no | hero-derived crop |
| blue-train | Blue train crossing stone viaduct in green hills / tour | 5:3 | no | generated |
| southern-coast | Sunset, palms, tropical shore / tour | 5:3 | no | generated |
| reservoir-travellers | Two people seen from behind on rocky overlook / experiences | 4:3 | no | generated |
| wildlife | Elephant in tropical greenery / experience | 3:5 | no | elephant-derived crop |
| culture | Ancient Sri Lankan brick temple / experience | 3:5 | no | generated |
| beaches | Palms and turquoise sea / experience | 3:5 | no | generated |
| tea-country | Green tea hills / experience | 3:5 | no | hill-country-derived crop |
| sri-lankan-food | Rice and curry in earthenware / experience | 3:5 | no | generated |
| tea-pickers | Sri Lankan women at work among tea terraces / why us | 2:1 | no | generated |
| tropical-cta | Turquoise bay, palms, boulders / closing CTA | 3:1 | no | generated |
| botanical-leaves | Muted green foliage cluster / story left | portrait | yes | authored SVG |
| botanical-branch | Bronze fine-line branch / story right | portrait | yes | authored SVG |
| locally-curated-stamp | Circular lettering and leaf / story | square | yes | authored SVG |
| floating-leaf | Individual outlined leaf | portrait | yes | authored SVG |
| sticky-note-local | Ivory paper and annotation / story | square | yes around paper | authored SVG |
| sticky-note-people | Ivory paper and annotation / why us | portrait | yes around paper | authored SVG |
| handwritten-annotations | Independent travel annotation / hero | landscape | yes | authored SVG |
| logo | Elephant symbol and Majestic Sri Lanka wordmark / shared header and footer | landscape display frame | yes | user-supplied PNG; resized lossless WebP delivery |

The supplied logo is preserved unchanged at `assets/source/majestic-logo.png` (1254 × 1254, 252,041 bytes). Run `npm run assets:logo` to regenerate `public/assets/majestic-sri-lanka/branding/logo.webp` (436 × 436, 26,208 bytes), sized for twice the largest rendered width. WebP encoding is lossless after resizing; CSS frames the transparent margins without stretching the artwork. The earlier approximate `logo.svg` is no longer used by the site.

Additional portraits are deliberately illustrated monograms rather than fabricated client photographs. Original sample names/quotes from the supplied design are labelled illustrative in preview and excluded from structured data. Production photography has 240/480/720/960/1600px WebP variants where relevant, without enlarging source images. Responsive descriptors use actual dimensions from the generated manifest. Source PNGs remain in the archive. Organic silhouettes are application masks, documented in the CSS, not destroyed source backgrounds.

The delivery ZIP also contains the six self-hosted WOFF2 font files (static DM Sans 400/500/600, Cormorant Garamond 500 normal/italic and the Caveat decorative subset), their font/icon license notices and the generation/design documentation. Font files are build inputs, not claimed as original Majestic artwork. System-font fallbacks inside authored SVG notes are not redistributed.
