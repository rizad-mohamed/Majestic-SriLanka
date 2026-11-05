# Hero, navigation and itineraries refinement

Implemented against main `4621dcf8854085ef1be0004d31e943ae321ef2cf` on 6 November 2026.

## Scope

- The homepage renders its first existing image in HTML, including a responsive AVIF/WebP picture and intrinsic dimensions. Enhancement cycles through the existing three images at 5.5 seconds each, then the supplied muted inline video. The native ended event returns to image 1 on every cycle. Crossfades last 650ms and wait for image decoding.
- Indicators follow the same order. Selecting an image pauses cycling; selecting the film plays it. Play resumes the selected slide. Keyboard arrows, hover, focus, offscreen visibility, hidden tabs and page lifecycle are handled. Reduced-motion visitors start with a still image and retain explicit playback controls. Failed video playback returns to image 1, and a failed photograph keeps the last successfully decoded frame.
- The independent story dialog loads its dependency-free, hashed native module only when requested. Its source has JavaScript type checking, formatting coverage and an explicit URL import declaration. No dependency or security-policy change is needed.
- Header rules are consolidated in `src/styles/header.css`. The menu layout is used through 1100px; wider layouts scale spacing together. Phone alignment, desktop brand styling, visible focus and existing navigation controls remain intact. Tablet and phone search/menu controls have 44px targets.
- `/itineraries/` replaces the full `/tours/` page with its content, cards, filters and photography preserved. All live internal links, search results, metadata mapping, breadcrumbs, schema URLs and sitemap entries use the new canonical route. Both legacy URL forms have direct 301 rules. The generated legacy fallback is noindex with a canonical pointing to the new route.
- The Moments Along the Way gallery preserves its images, dimensions, masks and 35px/second pace. Native Web Animations translate two identical groups continuously. Width is measured on resize, not every frame. Animation stops for manual browsing, pause, hover/focus, touch, hidden tabs, offscreen content and reduced motion. Native scrolling is restored without changing the visible offset; reduced-motion/no-JavaScript browsing retains the original group.

## Verification coverage

`tests/e2e/immersive.spec.ts` verifies two automatic hero cycles using native video ended events, controls, visibility suspension, reduced motion, fallbacks and rapid selections. `tests/e2e/navigation-itineraries.spec.ts` covers the header width matrix on every route, direct legacy redirects, query/fragment preservation, gallery continuity, pause/manual scrolling and static browsing. Production tests verify canonical/schema/indexing behavior and that the sitemap contains only the new itinerary route.

The redirect test helper applies the built `_redirects` rules through a local HTTP proxy because Astro's static preview does not apply hosting rules. It verifies one-hop HTTP 301 behavior against the built site; it is not evidence of a deployment to the external hosting platform. Astro's generated redirect page supplies a safe fallback where platform redirects are unavailable.

Existing build budgets remain unchanged. Local browser simulations and automated audits are engineering checks; physical-device acceptance and sustained performance on a visitor's particular hardware require device testing. Native transform animation can follow the browser's refresh cadence without a JavaScript frame loop; no universal FPS guarantee is made.

## Commands

- `npm run lint`, `npm run check`, `npm run format:check`, `npm test`
- `npm run build`, `npm run test:seo`, `npm run measure:build`
- `npm run test:e2e`, `npm run test:production`
- `npm run test:lighthouse -- --home-only`
- `npm run test:lighthouse -- --route /itineraries/`

The delivery report and GitHub Actions artifacts record measured results rather than assumed scores. Historical SEO audit tables retain their original route/date; the current keyword mapping uses `/itineraries/`.

Implementation references: [Astro redirects](https://docs.astro.build/en/guides/routing/#redirects), [Web Animations](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate), [muted media autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), [Vite explicit asset URLs](https://vite.dev/guide/assets.html).
