# Homepage integration - 6 November 2026

## Scope and preserved baseline

Latest main at integration: `27c9efa49c23a0f9eaab2f5fdcff03322f7da00d`.
Selected photography source: `ebb98d442fca4788da4865d40cb7b00911d2830f` on `feat/authentic-homepage-photography-2026-11-05`. That branch remains available unchanged for comparison. The old feature history was not merged.

Only homepage photography delivery, original masters, licences, responsive assets, its preparation script, scoped regression coverage and separate homepage asset budgets are integrated. All page source files, styles, client scripts, data, layouts, dependencies, lockfile, hosting configuration and GitHub workflows remain identical to latest main.

The user explicitly selected main's newer Ella family photograph beside Explore Experiences. Its alpha extensions and styling are preserved. The original footer photograph remains unchanged. Main's still-first hero, explicit video playback, gallery and cookie controls are preserved. No autoplay policy or video asset is changed.

## Replaced photography

Nine real photographic sources supply twelve treatments: three hero slideshow stills, Sigiriya destination, elephant and wildlife, tea country, Nine Arch Bridge train, culture, beaches, cuisine and tea picking. Reused sources have individual crops for their existing containers.

| Source         | Photographer        | Original                                                                                                             | Licence                                           |
| -------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| sigiriya       | Anil Reddy          | [Original photograph](https://unsplash.com/photos/sunset-illuminates-sigiriya-rock-fortress-r-vUs1jhhLA)             | [Unsplash License](https://unsplash.com/license)  |
| elephant       | Yagyaansh Khaneja   | [Original photograph](https://www.pexels.com/photo/elephant-in-forest-26847447/)                                     | [Pexels License](https://www.pexels.com/license/) |
| tea-landscape  | Erik Esly           | [Original photograph](https://unsplash.com/photos/lush-green-tea-plantation-on-a-misty-hillside-ZWdrM9IBBIE)         | [Unsplash License](https://unsplash.com/license)  |
| blue-train     | Domenico Bertazzo   | [Original photograph](https://www.pexels.com/photo/nine-arch-bridge-in-demodara-sri-lanka-4769075/)                  | [Pexels License](https://www.pexels.com/license/) |
| southern-coast | Sameera Madusanka   | [Original photograph](https://www.pexels.com/photo/sunset-scenery-from-behind-a-palm-tree-13302116/)                 | [Pexels License](https://www.pexels.com/license/) |
| culture        | Alfred Franz        | [Original photograph](https://www.pexels.com/photo/ancient-ruins-in-polonnaruwa-sri-lanka-33171754/)                 | [Pexels License](https://www.pexels.com/license/) |
| beaches        | Shafky Zubair       | [Original photograph](https://www.pexels.com/photo/scenic-view-of-mirissa-beach-with-palm-trees-35637889/)           | [Pexels License](https://www.pexels.com/license/) |
| food           | Zoshua Colah        | [Original photograph](https://unsplash.com/photos/a-variety-of-delicious-appetizing-curry-dishes-i0Dd1oxMz6c)        | [Unsplash License](https://unsplash.com/license)  |
| tea-worker     | Asantha Abeysooriya | [Original photograph](https://unsplash.com/photos/woman-picking-up-green-plants-in-field-during-daytime-beNiTTa8Pp8) | [Unsplash License](https://unsplash.com/license)  |

Commercial use and modification are permitted under the linked platform licences; attribution is optional for all nine sources. Original licence verification date: 5 November 2026. The [source register](../assets/source/homepage-photography/sources.json) records camera evidence, location, exact dimensions, bytes, SHA-256, original links and rights notes. The [delivery manifest](../public/assets/majestic-sri-lanka/homepage/manifest.json) records every crop, derivative dimension and byte count. No generative edits or hotlinked images are used.

## Delivery and optimisation

- 12 treatments, nine source masters and 88 responsive variants.
- WebP collection: 5,656,758 bytes; AVIF collection: 591,770 bytes across all responsive sizes. These are stored inventories, not a single page transfer.
- Dedicated phone hero: WebP 57,016 bytes / AVIF 45,243 bytes across its responsive variants.
- AVIF sources for slideshow stills with WebP fallback; existing lazy loading, responsive sizes, intrinsic dimensions, masks, object positioning and corner treatments preserved.
- No added browser JavaScript or CSS. Existing collection budgets remain enforced separately; gallery budgets are unchanged.
- Regenerate using `node scripts/prepare-homepage-photography.mjs`; optionally `--only <treatment-name>`.
- Original source masters are outside `public` and are not included in the deployed static build.

## Preservation and visual verification

Baseline and integrated builds were generated with the same committed lockfile and Node 24.22.2. All seven non-home route HTML documents (six primary routes plus gallery), 404, robots.txt and sitemap.xml compare byte-for-byte identical. The complete homepage head compares byte-for-byte identical, preserving metadata, social images, indexing policy and critical asset references.

Before/after Playwright captures at 320, 375, 390, 768, 1024 and 1440px found identical element geometry, image masks, object-fit, focal positioning and radii, with no horizontal overflow. Full desktop/tablet/mobile screenshots and readable phone crops were visually reviewed. Automated checks cover decoding, each of the three stills, AVIF-free WebP fallback, original footer, preserved Ella image and isolation on every other route.

## Validation

Validated on Windows with Node 24.22.2 and the unchanged committed npm lockfile:

- ESLint: passed. Astro/TypeScript: 86 files, zero errors, warnings or hints.
- Unit tests: 13 passed.
- Production build: nine static pages, passed.
- Preview SEO/link/schema checks: eight pages passed.
- Full Playwright suite: 208 passed across desktop, tablet, mobile and small-mobile profiles; no failures or retries.
- Isolated production browser suite: 11 passed, plus indexable SEO validation on all eight routes. The first fixture build hit a transient Windows EBUSY cleanup lock; an unchanged retry built and passed all checks.
- Build budgets: passed, including all existing gallery limits and separate homepage collection limits.
- Six-width visual/geometry regression: passed; all other route documents and homepage head unchanged. These are browser simulations, not physical-device acceptance.
- Formatting and source/derivative integrity checks: passed.

Lighthouse 13.6.0, three independent runs per device, median-performance run reported; no audits skipped:

| Device  | Performance | Accessibility | Best practices | Raw SEO | Performance runs |
| ------- | ----------- | ------------- | -------------- | ------- | ---------------- |
| mobile  | 92          | 100           | 100            | 69      | 91, 92, 92       |
| desktop | 100         | 100           | 100            | 69      | 99, 100, 100     |

The safe preview intentionally remains noindex, accounting for raw SEO 69. All other SEO audits pass; the separate isolated indexable production fixture passes its indexing tests. Audit thresholds pass without changing the approved indexing policy. Raw Lighthouse reports and full Playwright evidence remain in ignored local audit output.

## Changed files

- `src/components/Photo.astro`: route-scoped homepage asset selection, truthful alternate text; original collection elsewhere.
- `src/components/HeroSlideshow.astro`: responsive homepage still sources; playback controller unchanged.
- `src/components/ClosingCTA.astro`: explicitly retain original footer collection.
- `scripts/measure-build.mjs`: separate homepage inventories and limits without weakening existing budgets.
- `scripts/prepare-homepage-photography.mjs`: reproducible crop/encode pipeline with source hash verification.
- `tests/e2e/homepage-photography.spec.ts`: licensed asset, fallback and route-isolation regression scenarios.
- `assets/source/homepage-photography/`: nine JPEG masters and source register.
- `public/assets/majestic-sri-lanka/homepage/`: 88 variants and delivery manifest.
- This report.

No temporary audit tooling, downloaded Node runtime, raw test output or obsolete Mirissa feature-section replacement is included in the commit.
