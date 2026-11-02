# Website-wide UI refinement

Reviewed 2–3 November 2026 (Asia/Colombo). Branch: `feat/editorial-ui-refinement-2026-11-02`. Base: freshly fetched `origin/main`, `cc3466daf8f0e7d9fe9a8f0cbedadc5f555a48bc`. The original working tree was clean.

## Authority and audit

The approved homepage remains the visual authority described in [design-reference.md](design-reference.md). Tours supplies the ordinary landscape image treatment. The existing forest green, bronze, typography, hero compositions, homepage collage, wave and oval masks are retained. No replacement design direction was drawn: the repository instructions explicitly give the approved reference priority over generic skill defaults.

No new screenshot attachments were available in this turn. Review used the repository's approved-reference documentation, existing screenshots, and newly rendered screenshots of all seven actual routes. The baseline captures came from the existing development server; its small floating Astro toolbar is visible in those baseline pictures. All final captures use the static production build without that toolbar.

| Route | Observed problem | Implemented refinement |
| --- | --- | --- |
| Home | Fixed-height tour crops varied with card width; focal position depended on whichever card was first | Shared landscape ratio; focal position belongs to the photograph and survives carousel rotation; corrected responsive sizing for the small story landscape. Intentional masks and composition retained |
| Tours | Fixed image heights changed crop proportions across breakpoints; intro left a broad unused right area | Shared 5:3 landscape frame and existing 12px card radius; restrained bronze branch in the intro |
| Tailor-Made | Organic one-off photo corners; cramped tablet copy; empty right half beside the discovery CTA | Shared frame, tea/train photo overlap, taped handwritten note and leaf; tablet stacking; destination map inside the existing discovery section |
| Experiences | Different asymmetric corners, desktop fixed heights and square phone crops; excessive leading space | Same landscape ratio and radius at every size; deliberate elephant face crop; alternating rows retained; occasional bronze leaves; reduced leading space |
| About Us | Another one-off image shape; narrow tablet heading; excessive spacing around benefits; half-empty traveller-story disclosure | Landscape photo composition with smaller tea image and note; earlier stacking; compact benefits spacing; hill-country photograph beside the existing truthful disclosure |
| Plan Your Trip | Narrow tablet sidebar and form; unbalanced interest selection area | Form stacks below the introduction by 1100px; optional map within the existing interest fieldset; adding an interest preserves filled fields; mobile disclosure starts collapsed |
| Contact Us | Beach image stretched to the entire contact-list height, severely cropping it; mismatched mobile corner radius | Proportionate landscape collage beside the introduction, followed by contact options across the full width; 3+2 card arrangement on desktop, two columns on tablet, one on phones |

## Shared implementation

- `--photo-landscape: 5 / 3`, `--photo-inset: 4 / 3`, existing `--radius-card: 12px`.
- Ordinary tour, editorial and experience photographs reserve their aspect ratio and use `object-fit: cover`. Supporting photographs use the separate inset ratio.
- `Photo.astro` exposes the asset name through `data-photo`; focal positions in `editorial.css` follow the image, rather than its DOM order. Sigiriya remains weighted to the right, the train to its viaduct, the reservoir to the travellers, and wildlife to the elephant's face.
- `EditorialPhoto.astro` reuses existing self-hosted photography and botanical SVGs. Notes are decorative, marked `aria-hidden`; meaningful photographs retain descriptive alt text. The collage never clips its note or inset at the container boundary.
- `BotanicalAccent.astro` reuses the existing bronze artwork. A brief entrance settles once; no continuously running decorative motion was introduced.
- `editorial.css`, loaded after the existing mobile stylesheet, owns these shared refinements and their explicit responsive behavior. No dependencies or hosting configuration were added.

## Destination map

The exact heading “What would you love to discover?” appears in the Tailor-Made discovery CTA as well as the Plan Your Trip interest fieldset. The reusable map is integrated into both existing areas; neither gets a new standalone section.

The map connects three places already represented in the tour content: Sigiriya, Ella and Galle. Its routes are explicitly labelled illustrative connections, not roads or confirmed itineraries. Selecting a marker reveals a relevant experience and link. In the planner, “Add this interest” checks the existing interest control, announces the change and returns focus to that checkbox without navigation, field loss or implied submission. Consent remains a separate required action.

Native named `details`/`summary` controls provide touch, keyboard and no-JavaScript exploration. Marker targets are at least 44 × 44 CSS pixels. The planner's outer disclosure starts collapsed at 1100px and below; visitors can open it when useful. If JavaScript is disabled, native exploration and ordinary experience links still work; the existing brief builder's no-script notice remains accurate.

SVG and CSS provide the map without a map SDK, remote tiles, API keys, geolocation or third-party requests. The pin feedback lasts 600ms and the route trace 900ms after selection; both are disabled for reduced motion. There are no continuous pulses or autoplay loops.

### Map source

Boundary: **Natural Earth, 1:50m Admin-0 Countries, Sri Lanka**. Natural Earth contributors, including Tom Patterson and Nathaniel Vaughn Kelso. Public domain, as confirmed in the [official terms](https://www.naturalearthdata.com/about/terms-of-use/). The source credit is recorded here; Natural Earth does not require on-page attribution.

Source: [official Natural Earth GeoJSON](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson), downloaded 2 November 2026. Source-file SHA-256: `3e458fc036ad0a66411f2c1e6cac49c5d7bfb81cb1123bc513b22511a2b7fdeb`.

Only the Sri Lankan multipolygon is retained. Each coordinate is projected using `x = (longitude - 79.4) * 92 + 65`, `y = (10 - latitude) * 92 + 10`, rounded to one decimal place, and stored as a local SVG path in `src/data/travel-map.ts`. Marker coordinates are approximate and schematic connections are authored locally. None of the original worldwide data is shipped. Existing photographs and decorative SVGs are reused; no new generated photographs stand in for real destination or team evidence.

## Visual review and evidence

Full-page production captures cover all seven routes at **1440 × 900**, **768 × 900** and **390 × 900**. The Playwright suite additionally covers 360px, a 320px reflow check, desktop Firefox and desktop WebKit. Browser emulation is not physical-device acceptance.

Tracked review images:

- [Desktop before](ui-refinement/desktop-before.webp) and [desktop after](ui-refinement/desktop-after.webp), all seven routes in reading order.
- [Tablet after](ui-refinement/tablet-after.webp) and [mobile after](ui-refinement/mobile-after.webp), all seven routes.
- Detailed [Contact mobile](ui-refinement/contact-mobile.webp), [Tailor-Made desktop](ui-refinement/tailor-desktop.webp), and [planner desktop](ui-refinement/planner-desktop.webp).
- [Viewport measurements](ui-refinement/viewport-measurements.json). These are document bounds and heights, not performance scores. The map intentionally increases desktop planner height; the mobile disclosure keeps its effect small.

### Critique record

ROUND 1

Seen in one second: the approved travel identity extends to the editorial pages, but Contact fails on phones.

Idea: Sri Lankan landscapes become a shared photographic travel journal, with the homepage's leaves and paper notes connecting the pages.

Live thing: destination exploration that leads to experiences and selects an interest in the travel brief.

Layout words by section: hero=approved landscape / introduction=photo journal and copy / experiences=alternating landscape and copy / discovery=copy and island map / contact=proportionate image and full-width options.

Scores: not scored while a visible mobile layout regression remained.

Top three problems:
1. Contact's new desktop columns override the phone composition (`ui-first-pass-production/contact-us-390.png`): explicitly restore a single column and put the options below the introduction/collage.
2. The elephant's forehead is cropped (`ui-first-pass-production/experiences-390.png`): move its focal point towards the face at 15% vertical position.
3. The tablet discovery headline is too narrow (`ui-first-pass-production/tailor-made-768.png`): stack the CTA and map below 1000px.

ROUND 2

Seen in one second: image proportions and contact composition are coherent across widths.

Idea and live thing: unchanged from round 1.

Layout words by section: unchanged from round 1.

Scores: design 7.5 · usability 8 · creativity 7 · content 7.5 → overall 7.6 (subjective engineering review, not client acceptance).

Caps applied: generic skill bans on approved brand details are inapplicable under the repository's reference-priority rule. No claim of passing the skill inspector: its CDP connection timed out at `Page.enable`; the production screenshots, measured document bounds and Playwright assertions provide the actual browser evidence.

Top three findings:
1. The measured tablet planner overflowed by 8px after assets settled: restoring a positioned sidebar at the tablet breakpoint contains the rotated leaf. The overflow assertion now waits for fonts and image decoding.
2. The full map was too dominant inside the form: cap the planner map at 240px, retaining 44px marker targets; keep it collapsed initially on smaller screens.
3. Mobile collage notes need clearance from the following copy: explicit margins reserve the photo and note overlap, verified in the final screenshots.

Final review: the corrected composition retains the approved visual character. Remaining subjective limits are the deliberately illustrative testimonial copy and reuse of the small approved photography collection. Real-device, screen-reader and client acceptance remain human review tasks.

## Verification

| Check | Actual result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run check` | Passed: 54 files, zero errors/warnings/hints |
| `npm run format:check` | Passed |
| `npm test` | 11 passed |
| `npm run build` | Passed: eight pre-rendered HTML pages including 404 |
| `npm run test:seo` | Passed: all seven preview routes, metadata, canonicals, schema, links/anchors, image metadata, sitemap, robots and 404 |
| `npm run measure:build` | Passed unchanged budgets: compressed CSS 13,986 bytes; JS 4,198 bytes; largest HTML 11,306 bytes |
| Initial full Playwright run | 165 successful Chromium/WebKit cases; all 33 Firefox cases crashed before opening pages inside the Windows sandbox. Runner cleanup stalled after cases finished; stopped only this task's runner and preview |
| Firefox full-suite rerun outside sandbox | 33 passed, including all seven automated accessibility audits and existing functional journeys |
| Final regression after the tablet leaf fix | **72 passed, zero failures/skips/flakes**, all six projects: desktop, tablet, mobile, small-mobile, Firefox, WebKit. All seven settled route captures plus map keyboard/touch targets, no-script behavior, reduced motion, selected interests, consistent photo frames and carousel focal positioning |
| Final screenshot measurements | **21 route/width combinations; zero horizontal overflow** |
| `npm run test:production` outside sandbox | **10 passed**; clean completion in 19.3s |
| Planner Lighthouse, mobile and desktop | Passed thresholds; details below |

The final targeted suite used the existing test configuration with a separate local port and output directory, avoiding the earlier stalled sandbox runner. Firefox needed execution outside the Windows sandbox; neither tests nor assertions were relaxed. The isolated production fixture initially hit a transient Windows `EBUSY` while cleaning its generated prerender directory; retrying built it successfully. Its ten checks passed, but sandboxed browser teardown stalled, so the same command was rerun outside the sandbox. No preview or real production environment was published by these tests.

The production-fixture suite validates seven production canonical/indexing states, the sitemap/crawl policy/redirects/404, analytics consent and privacy behavior, and native AVIF/WebP fallback. It uses the existing isolated fixture domain and never changes the safe `dist/` preview.

### Planner performance

One local audit per device, Lighthouse 13.6.0, using the existing script and its default throttling. These are laboratory measurements, not field Core Web Vitals. The first sandboxed audit timed out before producing a result; the successful audit ran outside the sandbox. [Machine-readable audit summary](ui-refinement/lighthouse-planner.json).

| Device | Performance | Accessibility | Best practices | Raw SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 97 | 100 | 100 | 69 | 2459ms | 0 | 9ms |
| Desktop | 100 | 100 | 100 | 69 | 588ms | 0.00005 | 28ms |

The raw SEO failure is the deliberate preview `noindex` directive, retained and asserted by the existing quality gate. Scores have not been adjusted. The local focused audit covers the modified planner; the unchanged GitHub workflow audits every primary route on mobile and desktop, three times per combination. Its status is available on the PR; a pending CI run is not a passed check.

All seven routes have automated WCAG 2/2.1/2.2 A/AA axe coverage in the full suite; the new map's open interaction state also receives an axe scan. This does not establish complete WCAG conformance or replace manual screen-reader testing.

The first GitHub run caught the stylesheet 239 compressed bytes over the established 14,000-byte budget. Removed superseded fixed-height/organic-corner image rules and replaced duplicate editorial layout declarations with the shared stylesheet's existing rules. The budget was not increased. Rebuilt, remeasured, reran static/SEO checks and captured all 21 route/width combinations again. Twenty captures were pixel-identical; the remaining tablet Contact comparison revealed a late-loading inset in the earlier capture, so the capture helper now explicitly waits for every image to finish loading. The final evidence includes that inset and unchanged document geometry.

### GitHub verification

[The quality run on application commit `213dadf`](https://github.com/rizad-mohamed/Majestic-SriLanka/actions/runs/41516438046) passed lint, type checks, formatting, unit tests, the dependency audit, build, SEO, unchanged transfer budgets, full cross-browser Playwright, production-fixture tests and all 42 Lighthouse audits. Its Playwright result was 197 direct passes and one successful WebKit retry. The retry came from sampling the universal 0.01ms reduced-motion transition before the browser's next frame. The regression now asserts that map animations are absent and any remaining transition duration is at most 1ms, rather than requiring a particular frame to have completed. That updated WebKit check passed ten consecutive local repeats; the PR check shows the final run after this test-only correction.

Three-run median Lighthouse performance for that unchanged application artifact:

| Route | Mobile | Desktop |
| --- | ---: | ---: |
| Home | 98 | 100 |
| Tours | 98 | 100 |
| Tailor-Made | 95 | 100 |
| Experiences | 90 | 99 |
| About Us | 96 | 100 |
| Plan Your Trip | 98 | 100 |
| Contact Us | 96 | 100 |

Accessibility and best practices scored 100 in every route/device combination; raw SEO remained 69 because of intentional noindex. Mobile Experiences LCP was 3603ms and Tailor-Made LCP 3005ms in this lab run; these remain performance improvement opportunities despite passing the existing performance gate. The planner's CI mobile LCP was 2405ms with zero CLS/TBT. No field-performance claim is made. Raw reports are in the workflow's `website-quality-evidence` artifact.

## Review and launch boundaries

This task prepares a feature branch and PR for review; it does not authorise merging, changing the hosting project or a production launch. All previews retain `noindex, nofollow`. Existing confirmations for the domain, email delivery, social links, customer testimonials and related launch details remain governed by the existing handover documentation. No new reviews, prices, policies or contact details were invented.
