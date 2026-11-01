# Mobile usability update — 1 November 2026

The approved reference remains the visual authority. The forest green/bronze palette, photographs, masks, botanical elements and paper notes are retained. All new styles are scoped to screens at or below 700px in `src/styles/mobile.css`; desktop composition is unchanged.

Changes:

- Increased body copy to 16px in primary reading sections; enlarged supporting labels, footer links and tour descriptions.
- Made header search/menu, landscape selectors, carousel controls, tour actions, filters and interest choices at least 44px tall.
- Replaced the five cramped destination columns (previously 8–9px labels) with a swipeable row of readable 13px labels. Featured tours and experience cards also retain native swipe scrolling.
- Rebalanced hero text/actions and narrow-screen headings. Moved the story stamp clear of the heading and arranged story perks in two columns and benefits in one column.
- Kept all mobile text inputs, date/number controls, selects, textareas and search at 16px to avoid focus zoom in iOS. Increased labels and choice controls, and allowed travel-brief actions and content to wrap.
- Gave dialogs viewport-relative bounds, preserved keyboard focus behavior and removed mobile deferred section height estimates.
- Bounded closing CTA copy and moved the rotated tea-picker note inward to eliminate a 1px horizontal overshoot at 320px.

Validation:

- Checked all seven routes in Chrome at 320, 390, 700, 768 and 1440px (35 route/width combinations), with before/after homepage screenshots and planner screenshots. Local evidence is in ignored `.local/before`, `.local/after` and `.local/final` folders.
- Type checking: 38 files, zero errors, warnings or hints. ESLint, production build and SEO/asset validation passed.
- 63 Playwright tests passed against the local development preview across desktop, tablet and mobile, including 21 automated accessibility scans, seven-page reflow, dialogs, search, filters, carousel and planner download. The existing three no-JavaScript tests were excluded because their URL is hardcoded to a different port. No behavior changes were made to scripts or HTML controls.
- The design skill's browser inspector ran at 320, 390 and 1440px. Its aesthetic gate does **not** pass: it objects to reference-required headlines, eyebrows, font accents, gradients, cards and decorations, among other generic defaults. Its findings are retained in ignored `.taste-skill/mobile-review`; these defaults do not supersede the approved reference.

Physical iPhone/Android checks, Safari/Firefox and client acceptance still require human review. No deployment or launch approval is claimed. Lighthouse was not rerun for this update.
