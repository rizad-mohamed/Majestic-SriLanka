# Responsive and performance review — 7 November 2026

## Integration with current main

The report below records the original `4303b9b` implementation and its local measurements. Integration preserves the newer hero sequence and compositor-driven gallery from PR #25. The first hero photograph already has eager loading and high fetch priority, so the old film-poster preload is not carried forward. The gallery keeps native transform animation, cached resize geometry and idle suspension; touching it now pauses playback until the visitor explicitly chooses Play. Responsive regression tests use `/itineraries/`, assert native animation state and verify there is no JavaScript frame loop during playback. The dialog, coarse-pointer, reflow and journey measurement improvements are retained.

The measurements below describe the original commit, not fresh measurements of this combined version. The integration pull request records its own validation and CI results.

The combined shared stylesheet initially exceeded its existing 14KB gzip budget. The italic display-font CSS is now imported by the homepage, its only consumer, instead of every layout. Experience-only base rules also live in the existing experience-route stylesheet. These changes retain the fonts, homepage preload and applicable style overrides while reducing shared CSS; no budget is raised.

## Original implementation report

Preserved the approved composition, photographs, forest green/bronze palette, masks, paper notes and botanical details. The existing static Astro architecture, responsive WebP/AVIF assets, lazy loading, self-hosted fonts and explicit video playback already provide a strong foundation. No new dependency or framework migration was needed.

## Changes

- The itinerary guest gallery now cancels its animation frame loop when offscreen, hidden, paused, hovered, keyboard focused or reduced motion is enabled. It restarts only when appropriate. Gallery geometry is cached with ResizeObserver rather than read on every frame.
- Touch browsing pauses gallery autoplay until the visitor chooses Play, allowing native momentum scrolling to finish without interference.
- Journey navigation batches resize and ResizeObserver measurements into one animation frame, retaining passive scroll handling and existing progress tracking.
- The initial hero poster has a high-priority image preload. The poster remains the initial visual; the MP4 still downloads only after an explicit playback action.
- Stable scrollbar space prevents horizontal movement when opening dialogs. Dialogs contain their scrolling and fit short landscape viewports; cookie notices also remain scrollable on those screens.
- Coarse-pointer devices receive at least 44px icon controls and 16px form fields. Touch hover styles no longer move buttons or magnify card photos. Grid children can shrink and wrap long content.

## Current browser guidance used

- [Chrome: optimize preload priority](https://developer.chrome.com/docs/modern-web-guidance/guides/performance/optimize-preload-priority?hl=en): prioritize an LCP video poster with an image preload and fetchpriority.
- [web.dev: optimize INP](https://web.dev/articles/optimize-inp): avoid unnecessary main-thread work and repeated layout calculations. The gallery's previously perpetual idle loop was a concrete opportunity.
- [MDN: scrollbar-gutter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-gutter) and [overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overscroll-behavior): native layout stability and scroll containment, with normal fallback when unsupported.
- [Astro image assets](https://docs.astro.build/en/reference/modules/astro-assets/): retain responsive images and modern formats already implemented in this project. This review does not claim that adopting another framework would improve visitors' experience.

## Verification

Astro check (87 files; zero diagnostics), lint, all 13 unit tests, static build and SEO artifact validation passed. Preview pages remain noindex. The final completed-build Microsoft Edge run passed all 58 selected desktop/mobile browser tests, including all eight routes' assets, metadata, overflow and automated WCAG checks, planner validation, search, filtering, journey navigation and hero playback/failure handling. This is selected regression coverage, not a claim that the entire cross-browser suite ran.

The new browser regression tests cover eight routes at 320, 600, 820 and 1024px plus 844 × 390 landscape; heading bounds and document width are checked after fonts load. They also measure scheduled animation frames, test pause/resume and reduced motion, and verify landscape navigation and dialog layout stability.

Desktop (1440px), tablet (768px) and mobile (390px) screenshots were inspected before and after. Updated fold captures are in [responsive-performance](responsive-performance/). The design skill's generic style gate still flags existing approved design choices, including three-line headings, notes, gradients, shadows, small secondary labels and centred phone copy. These were not redesigned to satisfy a conflicting style default. Its covered-text warning refers to decorative, aria-hidden image lettering; its stationary-page warning reflects deliberately paused initial hero playback. This is not a claim that the generic style gate passed.

The first browser run had four transient 404 failures because a rebuild replaced dist while that preview was under test; those results are superseded by the final completed-build run.

Reproduce browser coverage after `npm run build` and starting `npm run preview -- --port 4327 --ignore-lock`:

```powershell
npx playwright test --config docs/gallery/playwright-hero.config.ts responsive-performance.spec.ts site.spec.ts immersive.spec.ts --grep 'pages reflow|gallery schedules|landscape dialogs|all pages reflow|journey navigation|inner heroes|search finds|planner error|automated accessibility|tour filters|hero selectors|renders|initial hero|video waits|film poster'
```

## Limits and launch requirements

Final mobile Lighthouse 13.6.0 results: all three independent runs scored **96 performance, 100 accessibility and 100 best practices**. The median performance run measured LCP **2.802s**, CLS **0.00173** and TBT **0ms**. The single baseline run scored 95, with LCP 2.872s and the same CLS/TBT. The small score/LCP difference should not be treated as a statistically established speed gain. LCP remains above the 2.5s good threshold in this simulated mobile run. Raw SEO is 69 because this preview intentionally remains noindex; the audit runner verified no other weighted SEO failures.

Compact measurements are retained in [before.json](responsive-performance/before.json) and [after.json](responsive-performance/after.json). Complete local reports remain in `.local/responsive-performance/before` and `.local/responsive-performance/after`. The gallery's idle-frame regression verifies the interaction improvement independently of the homepage loading score.

Local Lighthouse scores are lab observations, not production field Core Web Vitals or measured INP. Real iPhone/iPad Safari, Android devices, slow networks, browser zoom and client acceptance still require human review. This change does not publish the site or verify the outstanding business content, policies and launch acceptance requirements documented elsewhere.
