# Homepage photography replacement

This branch changes homepage photography only. Baseline: `e5d432b9028563d0fbcf6f2fd5fdca48e64c084d`. Local and remote `main` are preserved; merging requires the owner's approval.

## Sources and commercial permissions

Eleven photographer-supplied photographs replace all fourteen unique homepage photo treatments, reused across sixteen primary placements and the shared tour dialogs: three hero slides, the story collage, tour cards, the reservoir feature, five experience cards, the tea-worker feature and the closing promotional background. The supplied film and its genuine frame poster, logo, botanical SVGs, paper notes and testimonial monograms are unchanged.

Verified on **5 November 2026** against the original platform photo pages and the platforms' primary licence pages. Both the [Unsplash License](https://unsplash.com/license) and [Pexels License](https://www.pexels.com/license/) permit commercial website use, cropping and modification without mandatory attribution. Photographer credit is recorded here and in the shipped manifest. These licences do not permit implying endorsement, selling unmodified copies, or redistributing a competing stock collection. Individual publicity, privacy and trademark rights still apply; this record does not assert independently obtained model releases or identify photographed people as Majestic staff.

| Homepage treatment / asset key       | Photographer and original source page                                                                                | Documented location                              | Licence                                           | Attribution required |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------- | -------------------- |
| `hero-sigiriya`, `cultural-triangle` | [Anil Reddy](https://unsplash.com/photos/sunset-illuminates-sigiriya-rock-fortress-r-vUs1jhhLA)                      | Sigiriya / Pidurangala, Sri Lanka                | [Unsplash License](https://unsplash.com/license)  | No                   |
| `elephant`, `wildlife`               | [Yagyaansh Khaneja](https://www.pexels.com/photo/elephant-in-forest-26847447/)                                       | Yala, Sri Lanka                                  | [Pexels License](https://www.pexels.com/license/) | No                   |
| `hill-country`, `tea-country`        | [Erik Esly](https://unsplash.com/photos/lush-green-tea-plantation-on-a-misty-hillside-ZWdrM9IBBIE)                   | Nuwara Eliya, Sri Lanka                          | [Unsplash License](https://unsplash.com/license)  | No                   |
| `blue-train`                         | [Domenico Bertazzo](https://www.pexels.com/photo/nine-arch-bridge-in-demodara-sri-lanka-4769075/)                    | Ella, Sri Lanka                                  | [Pexels License](https://www.pexels.com/license/) | No                   |
| `southern-coast`                     | [Sameera Madusanka](https://www.pexels.com/photo/sunset-scenery-from-behind-a-palm-tree-13302116/)                   | Matara, Sri Lanka                                | [Pexels License](https://www.pexels.com/license/) | No                   |
| `reservoir-travellers`               | [Nalaka Thalagala](https://unsplash.com/photos/a-large-body-of-water-surrounded-by-mountains-vGep5cUfrXI)            | Randenigala Reservoir, Sri Lanka                 | [Unsplash License](https://unsplash.com/license)  | No                   |
| `culture`                            | [Alfred Franz](https://www.pexels.com/photo/ancient-ruins-in-polonnaruwa-sri-lanka-33171754/)                        | Polonnaruwa, Sri Lanka                           | [Pexels License](https://www.pexels.com/license/) | No                   |
| `beaches`                            | [Shafky Zubair](https://www.pexels.com/photo/scenic-view-of-mirissa-beach-with-palm-trees-35637889/)                 | Mirissa, Sri Lanka                               | [Pexels License](https://www.pexels.com/license/) | No                   |
| `sri-lankan-food`                    | [Zoshua Colah](https://unsplash.com/photos/a-variety-of-delicious-appetizing-curry-dishes-i0Dd1oxMz6c)               | Hikkaduwa, Sri Lanka                             | [Unsplash License](https://unsplash.com/license)  | No                   |
| `tea-pickers`                        | [Asantha Abeysooriya](https://unsplash.com/photos/woman-picking-up-green-plants-in-field-during-daytime-beNiTTa8Pp8) | Tea Research Institute of Sri Lanka, Talawakelle | [Unsplash License](https://unsplash.com/license)  | No                   |
| `tropical-cta`                       | [Zoshua Colah](https://unsplash.com/photos/tropical-beach-with-rocks-palm-trees-and-clear-blue-ocean-v_s2z24cezg)    | Mirissa, Sri Lanka                               | [Unsplash License](https://unsplash.com/license)  | No                   |

The original source JPEGs and their SHA-256 hashes, dimensions, file sizes, camera/publication evidence and verification dates are committed in [sources.json](../assets/source/homepage-photography/sources.json). Every generated variant links back to its source in [the delivery manifest](../public/assets/majestic-sri-lanka/homepage/manifest.json). Source selection uses documentary photographs with platform photographer metadata and camera or publication evidence, followed by visual inspection. No AI image generator, generative fill, object replacement, compositing or hotlinked delivery is used. No platform AI-retouch tool was used. Such provenance supports the selection; it is not a forensic certification of a photographer's entire workflow.

## Matching decisions

The composition follows the approved reference: Sigiriya to the right of hero copy, warm coastal light and palm fronds, deep green elephant and tea imagery, the blue train on Nine Arch Bridge, warm stone heritage, coastal palms, overhead curry dishes and a tea worker among green leaves. Crops, rather than page layout changes, keep the subjects within the existing masks.

- The closest verified Sigiriya view has warm **evening** light. Its alt text and homepage social-image description say sunset/evening, rather than claiming sunrise.
- The reservoir feature preserves the real Randenigala water-and-hills setting. It has no foreground couple; no people were synthesized or added. The legacy technical key `reservoir-travellers` stays stable, with accurate reservoir alt text.
- The real tea-worker photograph shows one worker rather than two. The food photograph contains vegetable curries and dhal in white bowls rather than the generated clay-pot/rice arrangement. Descriptions reflect the actual photographs.

These are disclosed differences between real photographs and the generated reference, not changes to the site's layout or travel claims.

## Delivery and rollback

- Homepage-only selection occurs in the existing shared Photo component. Other routes retain their original asset collection. The component stays a plain image so existing direct-child masks and selectors remain intact.
- Three hero images use AVIF with responsive WebP fallback. The Sigiriya phone crop retains the exact original 360×684 and 467×887 output sizes and existing focal convention. Other responsive variants preserve every original intrinsic width and height.
- Existing `sizes`, image loading priorities, lazy loading, async decoding, object-fit, object-position, borders, masks, radii, shadows, hero controls and film sequence remain intact. No CSS, runtime script, dependency or lockfile changes are needed.
- Regenerate deterministically with `npm run assets:homepage`. The script verifies each master hash and rights record, refuses an insufficient source size and writes the variant/credit manifest.
- The isolated collection has its own bounded build-size inventory. All original collection budgets remain enforced. Old public photographs remain because six other routes still use them; total deployed storage therefore grows. Only selected responsive files are requested by the homepage.
- All original masters, generated assets and baseline commits remain available. Nothing is overwritten or deleted. The owner can return immediately to the clean `main` baseline or reject this feature branch without affecting the approved site. No merge or branch deletion is authorised by this task.

## Visual evidence

[Contact sheet](homepage-photography/contact-sheet.webp). Full-page comparisons retain the approved arrangement:

| Width           | Original                                        | Replacement                                   |
| --------------- | ----------------------------------------------- | --------------------------------------------- |
| Phone, 390px    | [Before](homepage-photography/before-390.webp)  | [After](homepage-photography/after-390.webp)  |
| Tablet, 768px   | [Before](homepage-photography/before-768.webp)  | [After](homepage-photography/after-768.webp)  |
| Desktop, 1440px | [Before](homepage-photography/before-1440.webp) | [After](homepage-photography/after-1440.webp) |

Additional hero captures for all three slides at all three sizes are in the same evidence directory. Screenshots deliberately select a still-image slide; the normal homepage still starts with the supplied film.

The measured comparison at **320, 375, 390, 768, 1024 and 1440px** found zero differences in heading, CTA and image rectangles, object-fit, focal positions, clipping paths or corner radii; no horizontal document overflow. Hash comparison verified unchanged CSS, runtime scripts, original photography and decorative assets, plus byte-identical built HTML on the six other primary routes.

Visual critique: the replacements remove the synthetic texture of the original scenes while keeping the green/bronze palette and subject hierarchy. Sigiriya remains in the open right-hand hero area; the elephant face and tea-worker remain readable through the established masks. The reservoir becomes a quieter authentic landscape. Sunset and hill-country slides keep the existing copy overlay and controls. Mobile and tablet compositions retain their original centring and carousel treatment. Real-device and final client art-direction acceptance remain human review tasks.

## Verification results

Measured encoding inventory (decimal KB/MB; these totals contain every responsive size, not one page load):

| Measurement                           | Result                                          |
| ------------------------------------- | ----------------------------------------------- |
| Original licensed JPEG masters        | 43.96 MB, retained outside the public directory |
| Corresponding old WebP photo variants | 7,000,776 bytes                                 |
| Replacement WebP photo variants       | 5,906,962 bytes; **15.62% smaller**             |
| Additional AVIF hero variants         | 546,527 bytes                                   |
| Sigiriya phone AVIF                   | 16.9 KB at 360×684; 28.4 KB at 467×887          |
| Largest Sigiriya hero AVIF / WebP     | 63.3 / 75.5 KB at 1600×800                      |
| Largest tea hero AVIF / WebP          | 187.4 / 323.4 KB at 1448×1086                   |
| Largest coast hero AVIF / WebP        | 39.6 / 57.3 KB at 1600×960                      |
| Added client JavaScript / CSS         | 0 bytes                                         |

The phone collection adds 57,016 WebP bytes and 45,243 AVIF bytes across its two sizes. The browser selects one supported format and responsive size; it does not download this whole inventory. Some individual detailed photographs are larger than their generated predecessors. The comparison above reports the entire corresponding collection, rather than promising every file shrank. [Machine-readable measurements](homepage-photography/measurements.json).

Passed: formatting, ESLint, Astro/TypeScript (71 files, zero errors/warnings/hints), 11 unit tests, production build, preview SEO/build validation, unchanged original budgets and the new homepage media budgets. All 12 photography-specific browser checks passed across the four existing viewport profiles: complete image decoding, homepage-only selection, all three hero slides and WebP fallback with AVIF sources unavailable.

Lighthouse 13.6.0, three independent runs per device, using the existing preview artifact and unchanged film-first playback:

| Profile | Performance runs / median | Accessibility | Best practices | Raw SEO | Median-run LCP | CLS    |
| ------- | ------------------------- | ------------- | -------------- | ------- | -------------- | ------ |
| Mobile  | 94, 93, 93 / **93**       | 100           | 100            | 69      | 1.59 s         | 0      |
| Desktop | 99, 99, 100 / **99**      | 100           | 100            | 69      | 0.62 s         | 0.0018 |

The raw SEO score retains the existing intentional preview noindex failure; no audit or score was hidden. All other scored SEO assertions pass, and the existing Lighthouse acceptance gate passes. The audits start with the supplied film, so these scores describe the normal homepage load rather than claiming to benchmark each later image slide separately. The audit retains advisory findings for film/network payload, image delivery and visible-label/accessibility-name mismatch; the latter is unweighted in this Lighthouse accessibility score. None is presented as a new zero-warning or real-device certification. [Full run summary](homepage-photography/lighthouse-summary.json).

The generic design inspector ran at 1440/768/390px. Its media/overflow probes found no broken images or horizontal document overflow. Its house-style gate still flags existing approved eyebrows, shadows, gradients, typography, decorative edge text, carousels and centred mobile text. These are retained under the explicit no-redesign instruction; this report does **not** claim that generic style gate passed.

The full existing Playwright suite attempted **188 scenarios** across desktop, tablet, mobile and small mobile. Its first run returned **186 passes and two browser evaluation errors**: a desktop 404 assertion failed inside the browser's injected evaluator with `Unexpected token '{'`, and the tablet planner accessibility scan returned `Unexpected template string` inside the injected utility script. Neither returned a site assertion mismatch or an accessibility violation. Both scenarios were repeated three times on each of the two affected profiles with one worker: **12/12 passed**, without site changes, reduced assertions or added retries. The original full-run failure traces and isolated results are retained locally. This is complete scenario coverage with disclosed harness errors, not a claim of a clean 188/188 first run.

The first production-fixture attempt timed out starting its server while the full suite was running. A serial `npm run test:production` rerun passed the production build, seven indexable-page metadata validation and **10/10 browser tests** covering all routes, sitemap/404, analytics consent and AVIF/WebP fallback. The normal `dist/` remains the safe noindex preview artifact; the indexable fixture stays isolated under `.local/production-fixture` and is not published.

Implementation commits:

- `aa2d0fe`: licensed source masters and provenance register.
- `4dc5889`: isolated homepage assets, responsive formats and truthful image descriptions.
- `2f72ca5`: photography browser regressions and separately bounded media inventory.

The final evidence commit contains this report, source table, optimized review screenshots, full Lighthouse summary, measured inventory and the [baseline SHA-256 record](homepage-photography/baseline-sha256.json). No branch is merged or deleted; local and remote `main` remain at the original baseline. GitHub workflow status is reported separately on the review PR so a pending workflow is not represented here as completed.
