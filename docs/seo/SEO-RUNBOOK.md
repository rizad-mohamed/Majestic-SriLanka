# SEO and release runbook

Use Node 24 and npm with the committed lockfile. On PowerShell hosts with a restricted script policy, invoke npm.cmd; do not weaken execution policy. Stop only owned preview/test processes before npm ci to avoid Windows native-binding locks.

## Review and CI

1. Fetch origin, inspect clean state and branch from current main. Preserve existing work.
2. Run npm ci, npm run format:check, npm run lint, npm run check, npm test, npm audit --audit-level=moderate, npm run build, npm run test:seo and npm run measure:build.
3. Install Playwright browsers with npx playwright install --with-deps chromium firefox webkit on CI. Set CROSS_BROWSER=true for all three engines; npm run test:e2e covers four Chromium viewport projects plus Firefox/WebKit desktop.
4. Run npm run test:production. It builds a separate ignored fixture, validates production metadata/sitemap and mocks consent-based analytics. Never publish .local/production-fixture.
5. Run npm run test:lighthouse (default three audits per route/device; CI uses the same three-run method because measured mobile variance makes a single sample unreliable). Do not run load-heavy tests concurrently with measurements. Browser tests use owned foreground preview servers (`--ignore-lock`) on ports 4325 and 4322; the Lighthouse runner owns port 4323, retains raw JSON/HTML, skips no audits and writes summary.json incrementally. Preview noindex produces an honest raw SEO failure; never switch public preview indexing on for a score.
6. Review the diff, test evidence and external requirements. Push the feature branch and open/update PR. Wait for actual GitHub checks on its current head. Merge only with owner authorization and green required checks. Fetch and fast-forward local main after the confirmed GitHub merge; do not force/reset history.

CI's Website quality workflow uses official actions pinned to verified immutable revisions, read permissions, npm ci, formatting, lint/types/units, full dependency audit, build/SEO/budgets, browser/axe, isolated production checks and Lighthouse. Reports, screenshots and traces are retained as Actions artifacts for 14 days. Local success alone does not establish remote CI success.

## Public launch

Resolve EXTERNAL-DEPENDENCIES.md first. PUBLIC_SITE_URL must be the approved HTTPS origin with no path/query/fragment/credentials/port. Set PUBLIC_DEPLOYMENT_ENV=production; enable PUBLIC_ALLOW_INDEXING=true only for the approved public deployment. Preview uses preview plus false, crawlable HTML noindex and an empty sitemap. Robots controls crawling, not confidentiality: private reviews also need hosting access controls. Do not publish placeholder domains or the test fixture.

Rebuild, validate and inspect actual host response headers, redirects, 404, images, canonical/sitemap agreement and contact handoffs. Preserve .openai/hosting.json project_id. This assignment does not change hosting or publish automatically. Roll back using the host's previous verified artifact/version, never a Git history rewrite.

## Content maintenance

Edit route metadata in src/data/seo.ts; visible copy remains in pages/data. Add only verified business facts. New approved public routes require route-map, sitemap, link and browser test review. Omit lastmod unless a truthful content-change source exists. Never add reviews/ratings, unverified prices or fabricated LocalBusiness fields.

Keep fonts/media local. Regenerate images only when originals or delivery requirements change, retain manifest dimensions and review crops at all widths. Run npm run assets:archive after asset changes; it also regression-checks the patched archive dependency chain.

After launch, use Search Console for indexing, crawl/security/manual-action reports and actual queries; GA4 only after ID/consent approval. generate_lead requires confirmed delivery from a real future backend; clicks, drafts and downloads remain distinct. Monitor actual p75 Web Vitals once field data exists. Dependabot and regular advisory scans supplement, rather than replace, release testing.

References: [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google Web Vitals](https://web.dev/articles/vitals), [Astro configuration](https://docs.astro.build/en/guides/configuring-astro/).

After changing hill-country.png, regenerate the identical-crop optional hero format with npm run assets:hero as well as the existing WebP preparation. Native picture negotiation retains WebP fallback; format dimensions are checked by test:seo and actual AVIF/fallback decoding by test:production.
