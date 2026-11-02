# Experiences, motion and responsive refinement

Reviewed 3 November 2026 (Asia/Colombo). Branch: `feat/immersive-experiences-hero-2026-11-03`.

## Scope and foundation

Fetched `origin/main` before work; its head was `cc3466daf8f0e7d9fe9a8f0cbedadc5f555a48bc`. The working tree was clean. Created this new branch from that remote head, then merged the completed UI foundation (`5ff3881`, PR #13) into the feature branch. Main and the earlier branch were not rewritten or merged remotely. This PR therefore includes that foundation and the advanced improvements described here. Review it as the complete proposed state against main.

The approved homepage, green/bronze palette, typography, masks and botanical/paper language remain authoritative. The earlier attachment contains a different SEO brief; it is context, not an additional instruction for this task. The supplied MP4 is used as media. No additional screenshot attachment was available: the audit used the actual rendered routes and the repository's approved design evidence.

## Implemented behaviour

| Area               | Refinement                                                                                                                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Experiences        | All five sections use two authentic documentary photographs, a shared 5:3 main frame, a 4:3 framed inset, a handwritten note and existing botanical artwork. Alternating desktop layouts remain. The Culture note sits above the landscape so it does not cover Sigiriya. Each composition exposes native photography credits. |
| Journey navigation | Sticky vertical navigation on desktop; five touch targets in a horizontal sticky bar at 1100px and below. A compass and connecting line scrub with scroll progress. Active location and completed stops update, and every stop is a native fragment link.                                                                      |
| Home hero          | The three existing images crossfade after seven seconds. Explicit play/pause and numbered selectors support keyboard arrows. Manual selection, keyboard focus and opening the film pause playback. Hover, hidden tabs and an offscreen hero suspend the timer. Reduced motion and Save Data start paused.                      |
| Film               | The existing “Watch Our Story” opens the supplied silent film in the labelled, focus-managed dialog. Native controls support playback, scrubbing and fullscreen. Closing pauses it. A loading error exposes a direct download. Neither source nor poster is assigned before a visitor opens it.                                |
| All seven routes   | Shared inner hero height and balanced headings; centred phone hero copy, breadcrumb and buttons; readable tablet type and stacked FAQ; preserved landscape and inset proportions; full-width phone contact introduction. Existing page-specific compositions remain.                                                           |
| Branding           | Favicons derive from the complete supplied logo: SVG, ICO with 16/32/48px entries, PNG sizes, 180px Apple icon and 192/512px manifest icons. Header and footer logo treatment remains approved.                                                                                                                                |

Motion uses compositor transforms/opacity and a single requestAnimationFrame update per scroll frame. Section offsets are remeasured on resize, font readiness and content resizing, including opened credits. There is no scroll interception or animation library. Reduced motion removes the travelling compass, updates progress by discrete stops and removes photo fades; native anchors follow the global reduced-motion rule. Native anchors, photographs, credits and the first hero image remain available without JavaScript.

## Media provenance and regeneration

The new photographs are downloaded at preparation time and self-hosted; there are no runtime image hotlinks. [experience-sources.json](../assets/source/experience-sources.json) records each source, creator, licence and modification. The deployed [manifest](../public/assets/majestic-sri-lanka/experiences/manifest.json) adds input SHA-256, dimensions and byte counts. Source/license links and modification notices are also available in every on-page credits disclosure. Share-alike derivatives retain their stated source licence.

The older homepage/reference scenes remain generated imagery as recorded in [the existing asset inventory](image-asset-manifest.md); the new documentary photographs are not evidence of this operator's guests, staff or completed tours.

Prepared assets are committed, so normal builds need no media network access or FFmpeg. Reproduction:

```sh
npm run assets:experiences -- --download
npm run assets:favicons
# FFmpeg must be available; FFMPEG_PATH can point at a local binary.
npm run assets:video -- "/path/to/Majestic Sri Lanka - Hero.mp4"
```

The film retains the full supplied sequence: 16.2 seconds, resized from 1920×1080/30fps to 960×540/24fps, H.264/yuv420p with fast start. Input has no audio. Output is 2,684,234 bytes versus 14,756,415 supplied bytes (81.8% smaller). The manifest records provenance and source SHA-256. A preparation-only FFmpeg binary was downloaded to ignored `.local`; it is not a site dependency or deployed asset.

## Performance budgets

The old CSS budget summed unrelated stylesheets across all routes and omitted inline JavaScript. `measure:build` now records route-specific stylesheet and JavaScript transfer estimates, including executable inline code. Each route remains capped at 6KB gzip JavaScript, 16KB gzip CSS, 15KB gzip HTML; each individual stylesheet remains capped at 14KB gzip. Existing font/AVIF budgets are unchanged. Superseded exact CSS declarations were removed before adding responsive rules.

The original WebP inventory remains 7,026,984 bytes with its original 7.4MB cap. The ten new documentary photographs have 25 responsive derivatives totalling 1,240,206 bytes (separate 1.3MB cap). The film poster is 36,524 bytes (50KB cap), and on-demand film has a 3MB cap. These are complete deployment inventories, not initial page transfer. Lighthouse thresholds remain unchanged. See [build measurements](seo/build-metrics.json).

## Visual review and validation

Baseline and final full-page captures cover all seven routes at 1440×900, 768×900 and 390×900. Playwright additionally exercises 360px, 320px reflow, Firefox and WebKit. All 21 final route/width measurements show zero horizontal overflow.

- Seven-page overviews: [desktop before](immersive-ui/desktop-before.webp), [desktop after](immersive-ui/desktop-after.webp), [tablet after](immersive-ui/tablet-after.webp), [phone after](immersive-ui/mobile-after.webp).
- Experiences: [desktop](immersive-ui/experiences-desktop.webp), [phone](immersive-ui/experiences-mobile.webp), active journey [desktop](immersive-ui/journey-1440.webp) / [phone](immersive-ui/journey-390.webp).
- [Phone homepage](immersive-ui/home-mobile.webp), film [desktop](immersive-ui/film-1440.webp) / [phone](immersive-ui/film-390.webp), [viewport measurements](immersive-ui/viewport-measurements.json), [Lighthouse measurements](immersive-ui/lighthouse.json).

| Check                                | Observed result                                                                                                                                                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Formatting, ESLint, Astro/TypeScript | Passed; 66 checked files, zero errors/warnings/hints                                                                                                                                                                                                          |
| Unit tests                           | 11 passed                                                                                                                                                                                                                                                     |
| Production build / preview SEO       | Passed; eight prerendered HTML documents, seven safe noindex routes, metadata/schema/anchors/assets/canonicals/sitemap/404 validated                                                                                                                          |
| Dependency audit                     | Zero findings, including development dependencies                                                                                                                                                                                                             |
| Full cross-browser suite             | Initial run: 245 passed, one instrumentation assertion failed in WebKit; no skipped tests or retries                                                                                                                                                          |
| Final feature regression             | 48 passed across all six projects, no retries/skips/failures, including corrected native media verification, play/pause, selection, scrubbing, anchors, credits, hero geometry, 320px coverage in the full suite, favicon delivery and no-JavaScript fallback |
| Isolated production fixture          | 10 passed, including seven indexable canonical routes, crawl policy/redirects/404, consent and native image fallback                                                                                                                                          |
| Build budgets                        | Passed; maximum route CSS 15,079 bytes gzip, JavaScript including inline code 5,013 bytes gzip, HTML 12,768 bytes gzip                                                                                                                                        |

The WebKit assertion expected an MP4 event in Playwright's page-request trace. Native playback successfully decoded the 16.2-second film but that request was absent from the trace; the poster request was visible. The corrected test verifies decoded media readiness/duration/currentSrc in every browser, the on-demand poster request, absence of initial source/requests and paused playback/focus restoration on close. It does not skip a browser or relax playback verification.

Local Lighthouse 13.6.0 results (laboratory measurements, not field Core Web Vitals):

| Route          |                Mobile performance | Desktop performance |
| -------------- | --------------------------------: | ------------------: |
| Home           | 93 (three-run median: 82, 94, 93) |     99 (99, 99, 99) |
| Tours          |                                97 |                 100 |
| Tailor-Made    |                                92 |                 100 |
| Experiences    |                                92 |                  99 |
| About Us       |                                93 |                  99 |
| Plan Your Trip |                                92 |                 100 |
| Contact Us     |                                94 |                  99 |

The first single-run full sweep failed the homepage mobile threshold at 83, with 405ms TBT. The unchanged homepage was repeated three times using the existing median policy: the median reached 93, LCP 2,653ms, CLS 0, TBT 48ms. All raw results are retained; the slow runs were not removed. Other routes above are single-run measurements. Every local route/device scored 100 accessibility and best practices. Raw SEO is 69 because this is intentionally noindex. Maximum mobile CLS in the sweep was 0.00318 (About Us), and maximum mobile LCP was 3,333ms (Experiences); further field-informed performance work remains useful.

The existing GitHub PR workflow is correctly configured for this feature branch through its `pull_request` trigger. It installs the committed lockfile, verifies formatting/lint/types/unit tests/audit/build/SEO/budgets, runs the complete six-project Playwright suite and production fixture, then runs 42 Lighthouse audits (three per route/device). Its pending status is not treated as a pass; the PR's latest check is the authoritative remote result. Origin points at the intended GitHub repository, and no remote or hosting identity change was necessary.

The first interaction pass caught an inert-template image loading defect; importing responsive image nodes into the live document fixed selection and automatic advancement. The final visual pass moved the Culture note above the photograph to expose the rock face. Final captures wait for image loading, decoding and two paint frames so a completed request cannot be mistaken for a painted image.

Automated browser emulation cannot replace physical-device testing or client design acceptance. Existing production domain/email, policies, social links and illustrative testimonials still need the human verification described in the existing launch checklist. No deployment or PR merge is authorised by this task.
