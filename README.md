# Majestic Sri Lanka

A seven-page, statically rendered travel website built from the supplied approved homepage reference. Astro, TypeScript, self-hosted fonts, responsive WebP photography and small progressive-enhancement scripts keep the site portable and lightweight.

## Development

Use Node 24 and npm. On Windows PowerShell with script execution restricted, use `npm.cmd` in place of `npm`.

```sh
npm ci
npm run dev
```

The local address is `http://127.0.0.1:4321`. Build with `npm run build`; inspect the production output with `npm run preview`.

## Structure and configuration

- `src/pages`: Home, Tours, Tailor-Made, Experiences, About Us, Plan Your Trip and Contact Us, plus a 404 and SEO endpoints.
- `src/components`: shared header/footer, native dialogs, cards, photo delivery, trip form and CTA.
- `src/data/content.ts`: central brand configuration and editorial content.
- `src/styles/tokens.css`: colors, font roles, width, shadows and radii.
- `src/styles/global.css`: reference composition, organic image masks and responsive layouts.
- `src/lib/planner.mjs`: validated travel brief formatting and safe email handoff.
- `assets/source`: 11 original generated PNGs. `public/assets/majestic-sri-lanka`: 14 scene crops, responsive production images and transparent SVGs.
- `docs`: design evidence, provenance, UAT and delivery results.

Copy `.env.example` to `.env` locally and set verified contact details. These are public build-time values, not secrets. `info@majesticsrilanka.com` and `majesticsrilanka.com` are user-requested proposed placeholders, not verified or active services. Keep `PUBLIC_CONTACTS_CONFIRMED=false` until verified; WhatsApp and social links remain labelled placeholders. No form backend, database, tracking, payment or artificial booking confirmation is included. The planner creates a downloadable brief; verified email/WhatsApp handoffs appear only when explicitly configured and confirmed. Unsent input remains in page memory, never browser storage. No entry is posted to a server.

The preview is deliberately `noindex` with robots disallow. Set the correct `PUBLIC_SITE_URL` and enable `PUBLIC_ALLOW_INDEXING` only after content and launch approval. Sitemap and canonical links are generated from the build origin. No fabricated LocalBusiness, review or offer schema is emitted.

## Validation

```sh
npm run lint
npm run check
npm test
npm run build
npm run test:seo
npx playwright install chromium
npm run test:e2e
npm run test:lighthouse
npm audit --omit=dev
```

Playwright covers all seven routes at desktop, tablet and mobile widths, accessibility scanning, navigation, filters, dialogs and form/download behavior. Screenshots and traces appear in ignored test output. Lighthouse runs three independent audits per page/device and evaluates the median performance run, retaining every result. Its thresholds remain performance 90 and accessibility/best practices/SEO 95. Crawlability is excluded during preview because indexing is intentionally disabled. Human review, real-device checks and assistive-technology testing remain distinct acceptance steps.

## Assets

`npm run assets:prepare` reproducibly optimizes source photographs, creates separate code-authored decorations and verifies their alpha transparency. `npm run assets:archive` builds the complete ZIP and SHA-256 checksum in `deliverables/`. The manifest documents image dimensions, source/derived relationships and provenance. Generated images approximate the reference; they are not original photographs or documentary proof of the business.

The Taste and shadcn skills were installed project-locally. Their layout/accessibility guidance is applied where compatible; the approved reference overrides generic rules forbidding its eyebrows, cards, gradients, notes or italic accents. Native HTML dialogs and fields preserve this lightweight Astro architecture; adding React/Tailwind solely for generic component styling would not improve fidelity.

Fonts are self-hosted with their license notices in `public/licenses`. The committed DM Sans files use static 400/500/600 weights; the Caveat script file is subset to the decorative English copy. Optional regeneration uses `python scripts/prepare-fonts.py` with `fonttools[woff]` installed. Python is not needed to build or serve the website.

## Deployment

`dist/` is portable static output. `.openai/hosting.json` records the private Sites review project. `_headers` supplies a recommended static-host header policy; verify host support and emitted response headers. For another host, serve directory indexes, preserve a real 404 status, use HTTPS and configure equivalent headers. No wildcard SPA rewrite is needed.

GitHub Actions repeats quality checks and preserves evidence. It does not auto-publish unapproved business content. On Sites, publish a saved version built from the exact pushed commit. Roll back by redeploying a previous saved version.

Before public launch, complete [the UAT checklist](docs/uat-checklist.md), verify the page inventory and business contacts, provide approved legal terms, confirm tour content, and replace or validate illustrative reviews. The current story dialog explains that a film has not yet been supplied.
