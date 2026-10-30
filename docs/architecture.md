# Architecture and decisions

The checkout and supplied GitHub repository were empty at discovery. No architecture, lockfile, branch history, assets or uncommitted user code needed preservation. The engineering handbook is a general checklist, not a project-specific page map. The user confirmed seven primary routes: Home, Tours, Tailor-Made, Experiences, About Us, Plan Your Trip and Contact Us. Travel FAQ is part of Contact Us. Responsible travel and guest stories are About Us sections; privacy and booking notices are dialogs.

## Static rendering

Astro pre-renders content and metadata to real HTML files, with no client framework hydration. Small bundled TypeScript enhances native dialogs, a search catalogue, scene selectors, tour filtering and a form. The same output can run on any static host. This choice follows the project's modest content scope and the handbook's proportionality principle. There is no justification for accounts, a database, payments, a CMS or a booking API without real requirements.

## Design and components

`tokens.css` centralizes font roles and color/layout values. Shared presentation primitives and domain sections are separate components; editorial content is typed data. Styles follow reference geometry, with explicit mobile interpretation. `Photo` supplies width/height, eager hero priority, below-fold lazy loading and WebP variants. Larger references remain in source assets; deployment uses optimized images only.

Taste and shadcn were installed and read. Taste's random direction and ornamental bans conflict with the explicitly approved design, so no replacement direction was drawn. Its hierarchy, crop, typography, focus, screenshot-critique and reduced-motion principles are used. shadcn project detection confirmed Astro and no React/Tailwind base; documentation was consulted for button, dialog, field and accordion composition. Native equivalents implement titled modal dialogs, grouped labelled fields, immediate validation errors with `aria-invalid`/`data-invalid`, and semantic details/summary. No unnecessary React runtime is installed.

## Enquiries and data

The brief builder validates in the browser, formats a plain text brief and downloads it. It does not collect or transmit personal data. Entered values remain in page memory. Configured email/WhatsApp handoffs are explicit external actions. No fake network request or confirmation exists. Changing this into online submission requires an agreed recipient, backend, validation/rate limiting, consent language, retention/deletion rules and delivery monitoring.

## SEO

Each page has its own title, description, canonical, Open Graph and Twitter metadata. A seven-entry sitemap and robots endpoint are generated during the build. Preview is explicitly noindex. WebPage/WebSite structured data describes actual page content; no unverifiable prices, aggregate reviews or business contact details are emitted. Final business identifiers and domain remain launch inputs. Search intent maps to private Sri Lanka tours, tailor-made holidays and the five experience themes, without unsupported keyword-volume claims.

## Validation and deployment

Node unit tests cover the brief's boundary cases. Playwright exercises all routes at three viewports and key journeys, uses axe for automated accessibility, and captures screenshots. Build validation verifies local links/assets, metadata, unique IDs and image inventory. Lighthouse measures actual local production output; its non-indexable preview status is deliberately excluded from SEO scoring and documented. No lab measurement is called field INP or proof of WCAG compliance.

CI uses least-privilege GitHub Actions, a committed lockfile and a high-severity production dependency gate. Lighthouse CI automation uses the supported Lighthouse CLI with explicit thresholds and HTML/JSON reports; the older `@lhci/cli` wrapper was removed because its dependencies had audit findings. Static response headers are supplied as host configuration and need host verification. Sites stores private review deployment identity in `.openai/hosting.json`. Sources and build artifacts must correspond to the pushed commit; no history rewriting or force push is used.

## References consulted

- [Astro script processing](https://docs.astro.build/en/guides/client-side-scripts/)
- [Playwright configuration](https://playwright.dev/docs/test-configuration)
- [shadcn dialog composition](https://ui.shadcn.com/docs/components/base/dialog)
- [shadcn field validation](https://ui.shadcn.com/docs/components/base/field)
- [Taste installation and variants](https://www.tasteskill.dev/docs)
- [GitHub checkout](https://github.com/actions/checkout) and [Node setup](https://github.com/actions/setup-node)

Business-specific copy is sourced from the supplied request/reference. No external source is treated as business authorization.
