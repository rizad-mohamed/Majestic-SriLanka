# Still-first homepage hero

The existing 36,524-byte WebP film poster is the initial hero on every device, including without JavaScript. Removed the autoplay attribute and initialized playback to paused. No video source is attached until an explicit Play/film selection or opening Watch Our Story. This avoids the 2,684,234-byte film request during the initial visit. It does not shrink the film or claim a measured page-speed score.

Existing manually selectable landscapes remain available. Explicit video playback can be paused, is suspended when offscreen or in a hidden tab, and hands off to landscape slides after ending. Mouse hover no longer blocks an explicitly requested film. Video loading failures retain the existing landscape fallback.

Validation: build, Astro check, lint and SEO validation passed. Twelve targeted Playwright tests passed in installed Microsoft Edge for desktop and mobile emulation. Checks include 20 seconds of initial still state with no MP4 requests, explicit video playback, pause/resume, end behavior, reduced motion and keyboard navigation, loading failure/blocked playback, optional story dialog, and no-JavaScript poster fallback. Real-device acceptance remains human review.

Repeat targeted browser checks against a built preview on port 4327 with: npx playwright test --config docs/gallery/playwright-hero.config.ts immersive.spec.ts --grep "initial hero|hero selection|video waits|film poster|optional story|without JavaScript"
