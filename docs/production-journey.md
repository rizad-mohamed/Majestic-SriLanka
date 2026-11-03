# Production journey refinement

Reviewed 3 November 2026. Feature branch: `feat/responsive-journey-production-2026-11-03`.

## Scope and foundation

Fetched and inspected a clean repository before creating this new branch from the latest `origin/main`, `cc3466d`. The approved current website was still on the preceding feature branch (`58bd3fa`, PR #15). Merged that history into this branch without rewriting it so the final main will contain the complete current design, including the video-first homepage, centred phone homepage and simplified planner. Earlier delivery reports remain historical evidence.

The latest request governs Experiences: a central **desktop** spine and the restored horizontal **mobile/tablet** navigation. No unrelated section was redesigned. Five experiences retain their existing order, photos, text, alternating columns, CTAs, credits and fragment identifiers. No dependency or canonical route changed.

## Responsive implementation

Above 1100px, each alternating section reserves a 64px central grid column. Its accessible 44px marker belongs to that actual section, and the spine joins the measured marker centres. Images and prose occupy the outer columns. The former desktop sidebar and its unused dimensions are removed.

At 1100px and below, the separate original five-stop horizontal navigation is visible and sticky. The desktop spine and row markers are hidden. Touch targets remain at least 44px, with centred labels and an exactly measured track between the endpoint icons. The two alternating content columns regain the width previously occupied by the mobile vertical timeline. Phone body text remains 16px; collages and wrapping CTAs retain their approved presentation.

One shared progressive-enhancement controller updates both layouts. Passive scrolling schedules one animation frame; section and marker geometry is cached and refreshed on resize, font readiness and section-size changes. Progress uses transforms. Reduced motion hides the compass and snaps active progress; native anchor navigation works without JavaScript. An explicit 18px compass box keeps the travelling icon centred on either axis without inline-SVG baseline drift.

## Review evidence

Six captures cover 320, 375, 390, 768, 1024 and 1440px. [Measurements](production-journey/measurements.json) include actual row, photo, prose and marker rectangles. All six have zero horizontal document overflow. Geometry assertions check the central desktop axis, row-centre alignment, spacing from both columns and the horizontal compact track. Normal-motion checks also verify the compass remains on its axis.

- Full page: [320px](production-journey/experiences-320.webp), [390px](production-journey/experiences-390.webp), [768px](production-journey/experiences-768.webp), [1440px](production-journey/experiences-1440.webp).
- Active journey: [phone](production-journey/active-390.webp), [desktop](production-journey/active-1440.webp); [axis measurements](production-journey/active-axis.json).

The repository's real Playwright browsers provided inspection and captures because the in-app browser and Windows computer-control connections were unavailable. There is no established pixel-baseline suite; retained screenshots plus geometry/accessibility/interaction assertions provide the available regression evidence.

## Verification and external state

The full existing suite covers all seven routes, image loading, overflow, metadata, navigation, forms and explicit enquiry handoffs, WhatsApp links, search, filters, dialogs, keyboard focus, reduced motion, no-JavaScript fallbacks and the actual video-to-three-image handoff. Additional assertions exercise every requested viewport and both journey layouts. CI runs Chromium, Firefox and WebKit, isolated production checks and three Lighthouse samples per route/device. Build/SEO/asset budgets are retained.

Final verified results, PR/merge links and Lighthouse scores are recorded in the PR and delivery response after the final head passes. A pending run is not a pass. The [Dependabot investigation](dependabot-investigation.md) distinguishes successful updater jobs and restored security settings from the historical App-owned queued configuration check.

Physical iOS/Android testing, client visual acceptance and actual external enquiry delivery require human UAT. The [launch checklist](uat-checklist.md) retains the existing contact/domain/policy/testimonial requirements. No successful enquiry delivery or live hosting deployment is inferred from these tests.
