# Baseline audit — 2 November 2026

Repository: `https://github.com/rizad-mohamed/Majestic-SriLanka`. Fetched remote main before edits; base `7e0d57a4eca45a7202feac52e8a76e15a673f334`. Clean initial tree. Branch `seo/production-readiness-2026-11-02`. Local main was behind remote and was preserved. No history rewritten.

## Architecture discovered

Astro 7.4.4, TypeScript, plain CSS, npm lockfile, Node >=24 (local 24.14.1). No Next.js, React, router framework, hydration, database, API, authentication, server actions or email provider. Eight prerendered HTML documents: seven approved pages plus 404. Two prerendered endpoints: robots and sitemap. Shared layout emits metadata. One small browser module enhances native dialogs, filters, carousel, search and a local brief builder. No video or analytics. Fonts, images and logo are self-hosted. Assets are generated illustrations/photography-style scenes, not evidence of actual guests or team. Sites identity in `.openai/hosting.json` is preserved; publication is outside this assignment.

`PUBLIC_SITE_URL` and `PUBLIC_ALLOW_INDEXING` configure indexing; email uses `PUBLIC_CONTACT_EMAIL` plus `PUBLIC_CONTACTS_CONFIRMED`. WhatsApp defaults to the owner-supplied number documented in commit `f0835ba`. Older handover descriptions of that channel as unconfirmed are stale. Proposed production domain and email are not verified. No secret values were read or printed.

## Existing checks before implementation

`npm.cmd run lint`: passed. `npm.cmd run check`: 39 files, zero errors/warnings/hints. `npm.cmd test`: 7 passed. `npm.cmd run build`: passed, 8 HTML pages. `npm.cmd run test:seo`: passed existing checks. PowerShell blocks npm.ps1; npm.cmd uses the same committed npm project without changing execution policy. Browser/Lighthouse baseline results are recorded in TEST-AND-UAT-REPORT and PERFORMANCE-REPORT after completion. Initial npm advisory request failed because the sandbox could not reach the registry; retried with network permission. GitHub CLI is absent from PATH.

## Defects and gaps established from source

| Area               | Initial condition                                                                                            | Consequence                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Site configuration | Default hosted preview origin; indexing controlled by a single flag; no URL validation                       | Accidental preview indexing or malformed/unapproved canonical origin possible                                    |
| Sitemap            | Always lists 7 pages, including noindex preview pages                                                        | Sitemap contradicts indexing policy                                                                              |
| 404                | Uses public layout's indexing flag and canonical logic                                                       | Could be indexable after launch                                                                                  |
| Metadata           | Unique descriptions already present; vague homepage title; Twitter card only; no social image dimensions/alt | Incomplete route and sharing coverage                                                                            |
| JSON-LD            | Anonymous WebPage with nested WebSite on every page                                                          | No stable identity, organization graph, page subtypes or existing breadcrumb representation                      |
| Links              | Navigation covers all pages; few contextual service-to-service links                                         | Planning research relies on shared navigation                                                                    |
| Images             | Six actual-width WebP variants, dimensions, priority and lazy loading already work                           | Preserve; several experience ALT values are category labels rather than scene descriptions                       |
| Form               | Local-only download and explicit email/WhatsApp handoffs; no server submission                               | No delivery confirmation or successful-lead event is possible; impossible calendar dates normalize in Date.parse |
| Tests              | Three viewport projects; basic metadata presence; no production-mode regression                              | Production domain/indexing, 404, query canonicals and schema relationships unguarded                             |
| Lighthouse         | Only home/tours/planner; skips is-crawlable; old summary includes experimental agentic category              | Six of required fourteen combinations; SEO score excludes real preview failure                                   |
| CI                 | Existing pipeline, read permissions; mutable action tags; main pushes only; production-only npm audit        | Branch-push validation, immutable actions and dev-dependency evidence incomplete                                 |
| Hosting            | `_headers` source configuration, no host-level evidence                                                      | CSP/TLS/cache/redirect behavior remains unverified externally                                                    |
| Trust content      | Clearly labelled illustrative guest quotes and proposed domain/email                                         | Client verification and publication permission remain launch blockers                                            |

## Seven-page inspection

All seven have real prerendered content, one H1, shared crawlable header/footer, a self-canonical using the preview default, noindex/nofollow by default, the same WebPage schema shape, responsive local media, planner CTAs and automated axe coverage. No page is orphaned.

| Route              | Existing H1 / content                                                                        | Media / primary action                              | Specific gap                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| `/`                | Extraordinary Journeys, Real Connections; services, story, tours, experiences, sample quotes | Sigiriya hero, scene chooser, collage; Plan My Trip | Title lacks commercial topic; sample proof needs approval                     |
| `/tours/`          | Journeys to Remember; three suggested journeys, filters, modal outlines                      | Culture/rail/coast images; View Tour → planner      | No contextual experience link; collection subtype absent                      |
| `/tailor-made/`    | Your Sri Lanka. Your Story.; preferences and process                                         | Reservoir/tea imagery; planner                      | Direct tour/contact context absent                                            |
| `/experiences/`    | Moments That Stay With You; five interest sections                                           | Five scenes; preselected planner                    | ALT descriptions, collection subtype, contextual tours                        |
| `/about-us/`       | Local People. Meaningful Journeys.; values and responsible travel                            | Tea/landscape scenes; planner                       | Team evidence missing, AboutPage subtype absent                               |
| `/plan-your-trip/` | Plan Your Sri Lankan Journey.; local brief, process                                          | Reservoir hero; download/draft/handoff              | No verified server delivery; research links absent                            |
| `/contact-us/`     | Let's Talk Sri Lanka.; WhatsApp, proposed email/domain, FAQ                                  | Coast imagery; planner/WhatsApp                     | ContactPage subtype absent; proposed information must not become schema facts |

## Scope and evidence limits

Use existing qualitative intent research in `docs/seo-strategy.md`; no volume/difficulty data supplied. Retain approved layout, palette, masks, typography, paper notes and botanical assets. Skill art-direction defaults do not override the user's reference. Security work is a bounded source/dependency/configuration review within this implementation, not a penetration test or a conformance certification. Human acceptance, real devices, assistive technology, production host configuration and field Web Vitals need external review.

During expanded failure-trace testing, generated Playwright JavaScript bundles were found to enter Astro type checking through the broad tsconfig include. The generated report/result/delivery/cache directories are now excluded while application and test source remains checked. This was a pre-existing configuration gap exposed by the new evidence artifacts.
