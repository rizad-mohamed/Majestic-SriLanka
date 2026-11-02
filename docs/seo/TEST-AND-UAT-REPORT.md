# Verification and traveller journeys

Execution date: 2 November 2026. Local Node 24.14.1, npm 11.11.0, Astro 7.4.4. The initial reference/base is recorded in BASELINE-AUDIT.md. Windows tests use npm.cmd without weakening script policy. No real customer enquiry, mail delivery, WhatsApp message or analytics submission is sent.

## Static and integration gates

| Check                         | Verified result                                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Clean npm ci                  | Passed against patched committed lockfile; 0 vulnerabilities                                                                                 |
| Formatting                    | Passed for changed engineering/test/SEO docs and workflow files; rechecked after final documentation edits                                   |
| ESLint                        | Passed                                                                                                                                       |
| Astro/TypeScript              | 49 source/test files; 0 errors, 0 warnings, 0 hints; generated report bundles excluded                                                       |
| Unit tests                    | 11 passed; dates, validation boundaries, Unicode drafts, header injection rejection, origin guards and safe JSON-LD                          |
| Production build              | Eight prerendered HTML documents plus robots/sitemap; passed                                                                                 |
| Preview technical SEO         | All seven routes, unique metadata, canonicals, schema graph, link/anchor targets, image dimensions/ALT, empty sitemap and noindex 404 passed |
| Production-mode technical SEO | Seven indexable fixture routes and correct domain/sitemap/robots passed; analytics requests mocked                                           |
| Dependency audit              | Full production + development advisory report: 0 findings; see deliverables/dependency-audit.json                                            |
| Archive regression            | assets:archive passed with patched dependency chain, 40,431,402-byte ZIP and recorded SHA-256                                                |
| Asset budgets                 | Passed; exact file/gzip sizes in build-metrics.json                                                                                          |

## Browser coverage

The complete final suite contains 168 cases: 28 cases across four Chromium projects (1440x900, 768x1024, 390x844, 360x800) and desktop Firefox/WebKit. A separate 320px sweep tests all seven routes. The focused keyboard regression passed all six projects before the complete rerun. Ten production cases cover seven query-free canonical/indexing contracts, crawl/404/redirect source policy and mocked analytics grant/deduplication/revocation.

Every route checks HTTP 200, one H1, correct unique metadata relationships, no overflow, decoded images, local-only default requests, no console/page errors, primary header/footer and screenshots. axe checks all seven routes in six projects plus form error/summary states. Search, menu, filters, itinerary handoff, experience preselection, scene selectors, carousel, story/policy dialogs, brief/text/email downloads and no-JavaScript reading/navigation are exercised.

Failures found during implementation were corrected: empty decorative ALT attributes serialized as bare alt are valid and now accepted by the validator; native dialog boundary navigation needed explicit cycling; WebKit needed an explicit skip-link tab stop; browser channel configuration needed Chromium-specific scope; generated trace bundles needed exclusion from source checking. Preview processes run foreground with dedicated ports to prevent daemon/lock cleanup hangs. Astro's static preview returns 404 on slashless paths, so tests record that limitation and validate the supplied host redirect rules rather than claiming deployed 301s.

An earlier complete local browser rerun passed **168/168 in 9.4 minutes**, with no retries, before the final performance changes. All 42 route cases and 54 axe scans passed, including the two form states across six projects. Earlier diagnostic failures are documented below; the later run uses matched browser tooling. Production/Lighthouse execution and GitHub CI are recorded separately.

## UAT journeys

| Journey                   | Automated evidence                                                                                | Human acceptance still required                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| A: Explore tours          | Home to Tours, filters, outline dialogs, contextual experiences, planner preselection             | Accuracy and suitability of actual offerings                            |
| B: Custom tour            | Tailor-Made to Planner; required errors, choices, literal-text review and downloads               | Real planning conversation and external delivery workflow               |
| C: Build trust            | About/Contact available from shared links; owner-supplied WhatsApp target validated               | Business/team facts, authentic proof, mailbox and recipient identity    |
| D: Mobile traveller       | Four Chromium viewports plus 320px sweep; mobile menu, interest handoff and no overflow           | Actual iOS/Android, native date picker, touch and WhatsApp app handoff  |
| E: Keyboard/accessibility | Skip link, Tab/Shift+Tab dialog cycling, Escape/focus return, reduced motion, axe on pages/states | NVDA/VoiceOver, zoom/text spacing, forced colors and user comprehension |

These are scripted acceptance journeys, not client sign-off or real-device certification. No claim of WCAG conformance, field Core Web Vitals compliance, live production redirects/security headers, verified mailbox delivery or public deployment is made. Public launch requirements are in EXTERNAL-DEPENDENCIES.md.

An intermediate full run completed 166/168 cases. Its two failures were retained under .local/investigation: an external-Chrome automation injection SyntaxError and a Windows Firefox software-framebuffer/context teardown failure after page assertions. Local tests now use the same bundled Chromium revision as CI, two workers, a 120-second test/cleanup envelope, full-page Chromium screenshots and viewport Firefox/WebKit screenshots. All route, image, console, accessibility and functional assertions remain enabled; the clean intermediate run and later regression results are recorded separately.

Final isolated production suite: **10/10 passed in 19.7 seconds**, including all seven production canonicals/indexing, sitemap/robots/404, source redirect policy, mocked analytics consent/data minimization/deduplication/revocation, and actual AVIF decoding with native WebP fallback. Final post-regression lint/type/unit/build/SEO/budget checks also passed; type checking remained clean with test reports present.

After the targeted performance changes, the full local rerun completed 167/168 cases initially; the tablet Experiences H1 assertion encountered the same intermittent browser automation SyntaxError seen earlier. The exact tablet case passed in a fresh context in 12.8 seconds, without replacing or deleting the full-run report. The earlier clean 168-case run provides separate evidence; remote CI must be checked on the final head before merging. This is not reported as a clean first-attempt local run.

Final full local Lighthouse sweep completed all 42 audits. Thirteen of fourteen route/device combinations meet the thresholds; homepage mobile median 87 causes the unchanged gate to fail. Every accessibility/best-practices score is 100, and all SEO failures are solely intentional preview noindex. See PERFORMANCE-REPORT.md for every sample and diagnostic investigation. Actual final-head GitHub CI is an additional required merge gate; local completion is not a claim of remote success.
