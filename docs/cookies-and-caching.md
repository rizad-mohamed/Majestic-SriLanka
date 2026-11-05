# Cookie preferences and browser caching

Implemented first-party majestic_consent preference cookie (version 1), 180-day expiry, Path=/, SameSite=Lax, Secure on HTTPS. Analytics defaults to off. Consent dispatches the existing majestic:analytics-consent event after the analytics listener initializes. Users can accept, reject or save a specific choice, reopen from footer and withdraw consent. Withdrawal disables analytics through the existing transport and removes accessible _ga, _ga_* , _gid and _gat cookies for host/parent domains. No analytics ID is currently configured in the tested preview; accepting does not load tracking there. Advertising consent remains denied.

No personal form data is stored by the preference manager. Existing full-business privacy-policy requirements remain unresolved; this is not legal certification.

Caching configuration in public/_headers:
- HTML routes, HTML files, robots.txt and sitemap.xml: no-cache (revalidate before reuse). No wildcard no-cache header is applied to asset responses.
- Assets and fonts: public, max-age=86400, stale-while-revalidate=604800.
- Fingerprinted Astro bundles: public, max-age=31536000, immutable (retained).

Only fingerprinted bundles use immutable caching. Media URLs are currently mutable, so media are not cached immutably for a year. Actual production response headers must be verified after deployment because host support for _headers varies. These settings do not reduce a first-time video download; no video encoding changes were made in this task.

Validation: Astro build, Astro check (zero errors/warnings/hints), ESLint and SEO build validation passed. Edge desktop/mobile browser checks passed for initial blocking, reject, preference persistence, reopening settings, accepting, withdrawing and analytics-cookie cleanup. Screenshots and verify-cookies.mjs are in docs/gallery. Fresh-visitor UI checks used the preview without an analytics ID. The isolated production fixture also passed its analytics blocking, query/private-data scrubbing, deduplication and revocation checks with G-TEST12345 and a stubbed Google script response. Live production transport remains to verify after deployment.

The combined delivery passed 192 Edge regression checks across desktop, tablet, mobile and small-mobile configurations, plus 11 production fixture checks and 11 unit tests. General page tests use a stored rejection so the consent banner does not cover footer controls; dedicated fresh-visitor cookie tests exercise the banner. Privacy information can also be opened directly from the banner.
