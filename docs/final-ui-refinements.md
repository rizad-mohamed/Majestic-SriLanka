# Final hero, journey and planner refinements

Reviewed 3 November 2026 (Asia/Colombo). Branch: `feat/final-journey-video-refinements-2026-11-03`.

## Scope and Git foundation

Fetched `origin/main` before implementation (`cc3466d`), inspected the clean repository and created a new feature branch from that head. Merged the preceding UI foundation (`2dcff9d`, unmerged PR #14) into this branch with merge commit `0469b54`. This proposal therefore includes the earlier foundation when compared with main. Neither main nor the previous feature branch was rewritten. Human review and merge approval remain outstanding.

The latest request governs this change. The attached text document is background material, not an additional instruction. No new screenshot attachment was available; review used the actual rendered pages and existing approved design evidence. The canonical planner route remains `/plan-your-trip/`, preserving existing links and SEO rather than creating another route.

## Resulting behaviour

- The supplied film is slide 01. Normal playback starts muted and inline, plays once, then advances through Sigiriya, hill country and coast at seven-second intervals. The image cycle does not automatically replay the film. Four labelled selectors, arrow keys and play/pause controls allow manual navigation. Manual selection and keyboard interaction pause playback; hover, hidden tabs and an offscreen hero suspend it. Intentional suspension cannot trigger the loading fallback.
- The poster is pre-rendered. Blocked autoplay, a native media error or a 12-second loading stall advances to the existing photographs. Reduced motion and Save-Data initially retain the poster without requesting the MP4; Play explicitly starts playback. The existing optional story dialog retains its native media controls and focus behaviour.
- Phone homepage headings, prose, story actions, benefit content, reviews, closing buttons and footer content align consistently in the centre. Existing carousels remain scrollable. Tablet botanical artwork is clipped at the main viewport boundary so decorative overhang cannot widen the document.
- At 1100px and below, Experiences uses equal content columns with a reserved 44px central marker column. Every marker belongs to its corresponding row, preserving image/text alternation and native fragment navigation. A measured central spine connects the actual marker centres; a compass follows scroll progress. Desktop retains its sidebar navigation. Phone body copy remains 16px, with bounded collages and wrapping CTAs at 320px.
- Journey scroll handlers read cached section/marker positions and update transforms in one animation frame. ResizeObserver, font readiness and resizing refresh the measurements, including expanded photography credits. Reduced motion hides the compass and snaps progress to the active section. Native links and the static spine work without JavaScript.
- How Planning Works is an always-visible semantic section. The duplicate form map, five visible interest choices and their unused styles/scripts are removed. Existing experience links can still carry verified context through hidden fields; no replacement selection interface was added. Validation, consent, brief downloads and explicit email/WhatsApp handoffs retain their existing behaviour.

## Film provenance and budgets

The original `Majestic Sri Lanka - Hero.mp4` is present in the supplied Downloads location. Its SHA-256 is `79943ea48aabc68aa3fbe731e466bfc9cd27a0763288ec363f0a66a2c45c6093`, matching the [committed media manifest](../public/assets/majestic-sri-lanka/video/manifest.json). The same complete 16.2-second sequence is delivered as the existing fast-start H.264 derivative: 960×540, 24fps, no audio, 2,684,234 bytes versus 14,756,415 supplied bytes. No substitute footage was introduced.

No dependencies, routes, deployment identity or indexing settings changed. Existing budgets remain enforced: 6KB gzip JavaScript and 16KB gzip CSS per route, 15KB gzip HTML, 14KB gzip per stylesheet and 3MB film inventory. Final [build measurements](seo/build-metrics.json) record homepage JavaScript 5,501 bytes gzip, homepage CSS 14,559 bytes gzip and Experiences CSS 15,169 bytes gzip.

## Visual evidence

All three affected routes were captured before and after at 320, 375, 390, 768, 1024 and 1440px. Final [viewport measurements](final-ui/viewport-measurements.json) record no document overflow in all 18 captures. The 1440px homepage has the same 4,051px height as the foundation; its 3,201px region below y=850 is pixel-identical across 13,828,320 colour channels. See [comparison measurements](final-ui/desktop-comparison.json).

- Homepage: [390px](final-ui/home-390.webp), [320px](final-ui/home-320.webp), actual film [390px](final-ui/video-first-390.webp) / [desktop](final-ui/video-first-1440.webp).
- Experiences: complete [390px](final-ui/experiences-390.webp) / [320px](final-ui/experiences-320.webp); active timeline [390px](final-ui/journey-active-390.webp) / [320px](final-ui/journey-active-320.webp).
- Planner: [phone](final-ui/plan-your-trip-390.webp), [desktop](final-ui/plan-your-trip-1440.webp).
- Affected-page overviews: [tablet](final-ui/overview-768.webp), [desktop](final-ui/overview-1440.webp).

Full-resolution PNG captures and the three-landscape comparisons at 390, 768 and 1440px are retained locally in `deliverables/screenshots/ui-final-after/`. Review included the actual film frame, all three landscapes, marker separation and active state, narrow-column readability, always-visible planning steps and centred closing actions. The in-app browser connection was unavailable; the repository's Playwright browsers supplied inspection and screenshots.

## Verification

- ESLint, formatting and Astro/TypeScript passed: 69 checked files, no errors, warnings or hints. Eleven unit tests passed. Production build, seven-route preview SEO checks and all unchanged asset/transfer budgets passed.
- The full local six-project run executed 264 cases: 259 passed initially. Five subsequent targeted reruns passed after correcting a Firefox-only property assertion and replacing unreliable native-media request interception with a real missing-source error; two transient axe injection errors also passed on rerun. No accessibility rule or browser was skipped. The film test uses the real native ended event and verifies all three automatic image transitions, pause/resume and no automatic film replay.
- Ten isolated production tests passed, including all seven canonical routes, indexing/sitemap/404, analytics consent/privacy and AVIF fallback. The first fixture build encountered a Windows `EBUSY` cleanup lock; the isolated rerun built and passed.
- The explicit viewport matrix verifies alternation, marker centres, 44px targets, separation from both columns, phone body type, centred homepage headings/CTAs, planner structure and document width at every requested size. Existing suites cover all seven pages, forms, WhatsApp destinations, menus, search, dialogs, filters, downloads, keyboard focus, reduced motion and no-JavaScript behaviour across desktop/tablet/two phone profiles, Firefox and WebKit.
- Initial isolated Lighthouse 13.6.0 homepage audits measured **96 mobile / 99 desktop performance**, accessibility **100**, best practices **100**. [Raw measurement summary](final-ui/lighthouse-home.json). These are single-run laboratory observations, not field Core Web Vitals. Preview SEO is **69** because noindex is intentional; production indexing is tested separately.

The PR's latest Website quality check is authoritative for its final head. The unchanged [workflow](../.github/workflows/quality.yml) runs formatting, lint, types, unit tests, dependency audit, build, SEO, budgets, all 264 browser cases, production checks and 42 Lighthouse audits (three per route/device), and retains the reports as a CI artifact. A pending check is not a pass. Final audit scores and the exact check link are reported in the PR and delivery response.

Physical iOS/Android playback, client visual acceptance and real enquiry delivery remain human UAT. No message, deployment or merge was performed. Existing contact/domain/policy/testimonial verification requirements remain in the [launch checklist](uat-checklist.md).

## Verified performance follow-up

The first 14-audit local sweep passed every route/device except Tailor-Made mobile (89). Its three-run repeat scored 89, 87 and 87, median 87. These results are retained in [the complete single-run sweep](final-ui/lighthouse-sweep.json) and [the unsuccessful repeat](final-ui/lighthouse-tailor-before.json).

Lighthouse identified image transfer as the largest opportunity. Added a phone-only 960×720 AVIF of the same approved reservoir image and central crop: 51,323 bytes versus the selected 109,002-byte WebP, a 52.9% reduction. Desktop continues to select its existing WebP; unsupported AVIF also falls back natively. The source is shared by Tailor-Made and Plan Your Trip. No geometry, text, photograph subject or desktop source changed. The preparation script reproduces this derivative from the original source. Total AVIF inventory is 397,316 bytes, below the unchanged 400,000-byte cap.

The optimised local repeat scored **91, 92 and 95**, median **92**, with accessibility and best practices 100. [Measurements](final-ui/lighthouse-tailor-after.json), [native WebP/AVIF visual comparison](final-ui/reservoir-format-comparison.webp) (WebP left, AVIF right). Formatting, lint, types, build, budgets and all ten production checks passed again; the production test now covers AVIF decoding, unsupported-format fallback and return to the approved desktop source across all three relevant routes.

The [first complete PR quality run](https://github.com/rizad-mohamed/Majestic-SriLanka/actions/runs/41603805607) passed on `aab12d8`: 264 browser checks, ten production checks and 42 Lighthouse audits. Three-run performance medians were 92–98 mobile and 99–100 desktop; homepage 98/100. This run precedes the encoding follow-up; the PR's latest check remains authoritative for the final head.
