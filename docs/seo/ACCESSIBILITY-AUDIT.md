# Accessibility review

Scope: all seven routes, existing dialogs, navigation, form errors and review summary. Target is WCAG 2.2 AA. Automated checks and scripted keyboard journeys support review; they do not establish WCAG conformance.

Existing semantics include one H1 per page, labelled navigation/landmarks, skip link, visible focus, native dialogs with names, focus restoration, details/summary FAQ, explicit labels, required indicators, autocomplete, aria-describedby errors, live status and text-only brief output. Reduced-motion styles and script-aware scrolling are retained.

Changes preserve the approved forest-green/bronze design. Scene-specific ALT now describes actual images. Default intrinsic dimensions match asset crops. About's visible breadcrumb label now matches its page/schema. Invalid calendar dates are rejected before displaying a brief. A cross-browser keyboard regression exposed Tab leaving a native dialog at its boundary; explicit first/last focus wrapping now supplements the native modal while preserving Escape and focus restoration. New contextual links identify their destination and stay within existing sections.

Regression coverage includes all pages at 1440x900, 768x1024, 390x844 and 360x800, plus a 320px reflow sweep. axe runs WCAG 2 A/AA, 2.1 AA and 2.2 AA tags. Additional checks exercise errors and summary with axe, skip-link focus, Tab containment in the menu dialog, Escape/focus return, reduced-motion scrolling, literal hostile text in the summary, navigation without JavaScript and explicit handoff destinations. Firefox/WebKit projects are enabled with CROSS_BROWSER=true. Final actual results are recorded in TEST-AND-UAT-REPORT.md.

Contrast is tested by axe/Lighthouse in rendered states. This does not cover every image/text combination, forced colors, zoom magnification or human readability. Remaining manual acceptance: screen readers (NVDA/VoiceOver), 200-400% zoom and text spacing, native mobile date input behavior, touch target comfort, actual iOS/Android, language comprehension and privacy/legal copy. No accessibility certification is claimed.

The taste skill's generic direction, ornament bans and headline rules conflict with the approved reference. The user's design takes precedence; the review uses its screenshot/crop/legibility checks without changing brand composition. Illustrative quotes remain explicitly marked and need client approval.

WebKit initially skipped implicit link tab stops under its default keyboard setting. An explicit tab stop on the skip link and controlled Tab/Shift+Tab cycling within dialogs make these journeys reliable across engines. [Apple documents Safari keyboard preferences](https://help.apple.com/safari/mac/8.0/en.lproj/cpsh003.html); native Safari settings and actual assistive technology still need human review.

The clean intermediate local run passed all 168 browser cases; later performance regression results and a transient automation failure/recheck are detailed in TEST-AND-UAT-REPORT.md; 54 axe scans (seven routes plus error/summary states across six projects) reported zero violations. This is evidence for the tested states, not a WCAG certification.
