# Validation results — 18 November 2026

Build, type checking (0 errors, warnings or hints), ESLint, formatting, all 16 unit tests, static SEO checks and build budgets passed. The build prerenders nine pages; eight content routes retain intentional preview noindex metadata. No dependencies or hosting identity changed.

## Browser coverage

The full Chromium run covered desktop, tablet, phone and small-phone profiles: **243 passed, 6 failed, 3 skipped**. Four failures came from previously collected assertions for the old 16/14-day badges and image collections. The other two were Playwright evaluation syntax errors in mocked-media cases. After updating the assertions, **all 12 targeted reruns passed**, covering the six failed cases plus their counterparts at every viewport. No hero-player code change was needed. The final Baseline-encoded gallery video then passed **four further playback tests**, one at each Chromium viewport.

The independent production fixture passed **all 12 checks**, including canonical/indexing behavior, sitemap/robots, redirects, structured data, consent-gated analytics and AVIF/WebP fallback. The indexable fixture remains local and was not published. The deliverable dist remains noindex.

WebKit passed four changed-flow tests on its first run and the remaining planner-flow test on its isolated rerun. Its metadata-prefetch behavior showed why preload=none cannot be asserted as zero requests; the test now checks the hint, paused state and explicit playback. The Windows WebKit build could not decode H.264 even after checking Baseline encoding; that platform's playback test is explicitly skipped. Safari/macOS or Linux CI playback review remains required. [Playwright documents that media codec support varies by operating system and recommends macOS for Safari-like playback testing](https://playwright.dev/docs/browsers#webkit).

All six Firefox attempts failed at browserContext.newPage with Target crashed, before any site page loaded. Firefox verification is **not claimed** on this Windows host. The existing Linux cross-browser CI and human device review remain the route to that confirmation. These environment limitations are not counted as passing tests.

## Final measurements

The existing per-route caps remain 6,000 bytes gzip JavaScript, 16,000 bytes gzip CSS and 15,000 bytes gzip HTML. Largest measured route JavaScript: **5992 bytes gzip**; largest route CSS: **15787 bytes gzip**; largest HTML document: **14987 bytes gzip**. These are transfer estimates, not claims about host compression.

New experience variants: **1033050 bytes**. Supplied tour/owner variants: **1219936 bytes**. Added gallery photo variants and poster: **332476 bytes**. Gallery video: **1352284 bytes**. All new collection caps pass. FFmpeg decoded the complete published video without errors.

At 1440, 768, 390 and 320 px, Experiences has ten sections with unchanged 5:3 main-image proportions, no horizontal document overflow and no broken images. Itineraries, About Us and Gallery were also measured at 1440, 768 and 390 px with no overflow or broken images. Final screenshots and machine-readable geometry are in after/. Client acceptance and real-device review are not automated assertions.

## Lighthouse

The Windows Lighthouse CLI wrote one complete mobile Experiences report, then stalled during cleanup. The process was stopped; the remaining route/device audits did not complete. The following is a single diagnostic sample, not a completed Lighthouse suite or a three-run stability claim. Raw SEO scores include the deliberate preview noindex crawlability failure; indexing was not enabled to improve a score.

| Route | Device | Performance | Accessibility | Best practices | Raw SEO | LCP | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| /experiences/ | mobile | 89 | 100 | 100 | 69 | 3238 ms | 0 |

See validation.json for exact browser-run statistics and Lighthouse findings, and build-metrics.json for the complete inventory. The existing business launch approvals remain outstanding as listed in README.md.

## Rathugala photography follow-up

The labelled placeholder has been replaced with two authentic views of Rathugala’s Vedda Heritage Centre from the CC BY 4.0 photograph in Mudalige et al. (2025). The original file was recovered from the Internet Archive after publisher downloads returned HTTP 403. The author credit, original publication, licence, archival retrieval URL, crop coordinates and original-file hash are retained in the source and delivery manifests. The main and inset photographs use the existing frames and local responsive WebP assets.

All **8 targeted browser checks passed** across desktop, tablet, mobile and small-mobile profiles, covering all ten photographic collages, source/credit links, the five new planner interests and search. No test was skipped. Build, Astro checking (0 errors/warnings/hints), ESLint, formatting, all 16 unit tests, static SEO and build-budget checks passed again. Screenshots were refreshed at 1440, 768, 390 and 320 px; there are no broken images or document overflow.

The five Rathugala variants add **155,706 bytes**, bringing the new-experience image inventory to **1,033,050 bytes**. Its explicit cap is now 1.2 MB to cover ten photo placements rather than eight. The original media and per-route HTML, CSS and JavaScript caps remain unchanged. This focused follow-up does not resolve or repeat the broader host/browser and Lighthouse limitations recorded above.
