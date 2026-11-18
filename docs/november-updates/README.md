# Content and media update delivery

The existing Astro components, forest green and bronze palette, typefaces, alternating experience rows, 5:3 main photos, 4:3 inset photos, paper notes and botanical treatments remain the design authority. This is a content and media update, with no new runtime dependencies.

## Completed content

- Replaced all four tour photographs with the supplied files, using 360, 720 and 1200 px WebP variants in the existing frames. Originals and SHA-256 provenance are retained in `assets/source/november-updates` and `public/assets/majestic-sri-lanka/updates/manifest.json`.
- Birds & Beasts contains exactly 18 days. Days 1–5 remain identical to the committed original. Days 6–18 follow the supplied sequence. **Day 15 interpretation:** reused the original itinerary’s Sinharaja rainforest walk and endemic birdwatching description (previously Day 13), retaining Sinharaja as the destination. The new Yala Day 13 safari was not copied into Sinharaja.
- Ancient Secrets contains exactly 15 days. Days 1–5, 8 and 9 are unchanged. The route summary now reflects the added highland and Bentota stops.
- Romantic Island changes only Day 9 of its itinerary. Tropical Bliss’s itinerary is unchanged. The original day data is retained in `tests/fixtures/original-itineraries.json` for regression checks.
- The bottom About Us section introduces Mr. Lasith Koralage in third person, uses his supplied portrait and the note “Your journey, personally cared for.” No awards, certifications or experience claims were added.
- Added Snorkelling & Diving, Private Beach Parties, Upper Diyaluma, Gal Oya National Park and Rathugala after the existing five experiences. Search and planner interest links include the additions. The homepage retains its approved five-card selection. The compact journey navigation scrolls horizontally, keeping readable labels and 44 px or larger targets.
- Gallery retains all 69 original photographs, adds the supplied elephant photograph as a seventieth photo, and preserves lightbox navigation and focus return. The itinerary’s existing guest carousel remains intact.
- Added the supplied wildlife video with a poster, native controls, `playsinline`, `preload="none"` and no autoplay. The optimized 20.6-second clip is silent, with an accompanying visual description. It is H.264 Baseline level 3.1 at 832×464 and 30 fps, with fast-start metadata. The 2,160,737-byte original is retained; the published video is 1,352,284 bytes (37.4% smaller).
- Connected the prepared person-removal edit to photo 8515 and its carousel card. The original, edited PNG master and removal mask are retained. A pixel-level test confirms that every pixel outside the mask is identical in the decoded original and edited master. The other four foreground people and the original watermark remain. WebP delivery necessarily recompresses the image.

## Photography sources and licensing

Verified against the original source and licence pages on 17–18 November 2026. Every photograph is hosted locally; no external image requests are needed. Machine-readable creator, source, licence, location evidence, modification and hash records are in `assets/source/experience-update-sources.json` and the published `experience-updates/manifest.json`.

| Use | Photograph and creator | Licence and location evidence |
| --- | --- | --- |
| Snorkelling/diving main | [Dive in pigeon island.jpg](https://commons.wikimedia.org/wiki/File:Dive_in_pigeon_island.jpg) — Kalana Weeramuni | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Source identifies a research dive at Pigeon Island near Nilaveli. |
| Snorkelling/diving inset | [The Beauty of Pigeon Island - Diving Area.jpg](https://commons.wikimedia.org/wiki/File:The_Beauty_of_Pigeon_Island_-_Diving_Area.jpg) — Mishen D.Perera | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Source identifies Pigeon Island National Park off Nilaveli. |
| Beach celebration main and inset crops | [Beachfront Dining in Sri Lanka with Ocean Views](https://www.pexels.com/photo/beachfront-dining-in-sri-lanka-with-ocean-views-37355589/) — Priyanshi Garg | [Pexels License](https://www.pexels.com/license/). Source identifies Sri Lanka. Commercial website use and modification permitted; attribution optional, provided voluntarily. The caption and adjacent copy identify this as inspiration, with no venue ownership or endorsement claim. It depicts daytime dining, not a documented Majestic event. |
| Upper Diyaluma main | [Upper diyaluma fall.jpg](https://commons.wikimedia.org/wiki/File:Upper_diyaluma_fall.jpg) — Venushka Fonseka | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Source identifies the top of Diyaluma Falls. |
| Upper Diyaluma inset | [Upper diyaluma falls.jpg](https://commons.wikimedia.org/wiki/File:Upper_diyaluma_falls.jpg) — Venushka Fonseka | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Source identifies the waterfall’s edge. |
| Gal Oya main | [Senanayake Samudraya (Gal Oya).jpg](https://commons.wikimedia.org/wiki/File:Senanayake_Samudraya_(Gal_Oya).jpg) — AntanO | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Source identifies Senanayake Samudraya, Gal Oya National Park. |
| Gal Oya inset | [Gal Oya National Park (Senanayake Samudhraya).JPG](https://commons.wikimedia.org/wiki/File:Gal_Oya_National_Park_(Senanayake_Samudhraya).JPG) — AntanO | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Source identifies the park near the reservoir. |
| Rathugala main and inset | [Rathugala Heritage Centre — First Voices (2025)](https://www.preprints.org/manuscript/202505.0239/v1) — Mudalige et al., photograph credited to the authors | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Publisher caption identifies Rathugala's Vedda Heritage Centre, 2025; the entrance sign confirms the location. The two panels show a community member with woven baskets and the entrance. The individual photographer is not specified. |

All Commons derivatives retain their source licence. The existing “Photography credits” disclosures include source links, creator names, licence links and change notices. Photos are cropped, resized and compressed as WebP; the sideways Diyaluma inset is also rotated upright. The two Rathugala panels are extracted separately and their decorative source borders removed; no people or objects are generated. Main variants are 360/720/960 px, insets 320/640 px. The completed new experience image inventory totals 1,033,050 bytes across all variants.

**Rathugala asset resolved:** the initial delivery used a labelled placeholder while an accurately identified, commercially reusable photograph was unavailable. Generic Vedda, farming and other-location portraits were rejected. The placeholder has now been replaced with the licensed Heritage Centre photographs above, preserving the established main/inset layout.

User-supplied tour, owner and gallery media are recorded as supplied assets rather than independently verified documentary location photography. No new specific location is asserted for the elephant photograph or crocodile video.

The publisher's current image URL returned HTTP 403. The original image was successfully retrieved from the [Internet Archive's 31 October 2025 capture](https://web.archive.org/web/20251031004945/https://www.preprints.org/frontend/picture/ms_xml/manuscript/763b8e5acd0c3746904a9a30a642f6a9/preprints-158279-g001.png), visually verified and retained locally. Retrieval provenance and crop coordinates are recorded in the source manifest. The photographs document the Centre in 2025; they do not imply an endorsement, affiliation or guaranteed encounter with a pictured individual. The source is credited for photography, not used to make medical claims on the travel website.

## Reproduction and checks

Use the committed npm lockfile. Asset preparation:

```powershell
node scripts/prepare-november-updates.mjs
node scripts/prepare-experience-updates.mjs
$env:FFMPEG_PATH = 'path/to/ffmpeg.exe'
node scripts/prepare-gallery-updates.mjs --video
```

The existing guest-watermark preparation reuses the shared watermark helper and reapplies the selected edit after a full gallery regeneration. Original guest media is still required for that full regeneration.

Build from the real workspace path when this Windows checkout is opened through the Desktop junction. Building through that junction was observed to omit CSS links in Astro 7.4.5; a real-path build restores them. `validate-build.mjs` now explicitly rejects production pages with missing stylesheet links or missing local CSS files. No framework or hosting identity change was made to work around this local issue.

The existing HTML, JavaScript, stylesheet and original media budgets remain enforced. New collections have separate explicit inventory caps: 1.2 MB experience photos, 1.3 MB supplied tour/owner photos, 600 KB gallery photo/poster and 1.5 MB gallery video. The experience inventory cap was increased from 1 MB to accommodate the two additional Rathugala photo placements; their five responsive variants add 155,706 bytes. Search avoids repeating visible descriptions in hidden search attributes and uses concise excerpts for the additions.

Final test counts, measurements and Git verification are recorded in `validation.md` after the final checks. Screenshots are in `after/`; measurements include desktop, tablet and phone widths. Existing baseline measurements from the initial workspace are preserved in `before-measurements.json`.

## Remaining launch review

Client acceptance and real-device media playback review remain human requirements. Preview pages remain `noindex, nofollow`. Existing launch requirements for verified testimonials, contact details, booking policies and production-domain approval remain applicable; this update does not approve a public launch or claim that suggested services have been booked.
