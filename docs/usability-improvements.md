# Usability fixes — 1 November 2026

Completed after the browser review, retaining the approved forest green/bronze design, botanical artwork and paper notes.

- Homepage categories now have explicit destinations. Wildlife, beaches and tea no longer depend on the unrelated order of the experience data array. General destinations opens the experience overview.
- Experience actions pass stable interest IDs to the planner and land at its form. Only known checkbox IDs are selected; repeated interest parameters are supported, unknown values are ignored, and choices remain editable. Existing tour preselection remains supported.
- The planner has a shorter mobile hero and an accessible, expandable process explanation. At 390px, its first input moved from 1,151px to 695px below the document top (rounded measurements).
- Between 701 and 1000px, experience cards use 14px labels instead of 9px. Pictures/content stack, tour cards have adequate width, listing cards use two columns, and controls/benefits are more readable. Desktop composition above 1000px is retained.
- Added 360px photographic variants and tuned small-image WebP quality from 70 to 60, always encoding from source PNGs. Large-image quality stays at 70. There are now 84 photographic variants across 14 scenes. The manifest records actual dimensions and bytes. `node scripts/prepare-assets.mjs --photography-only` reproduces photography without overwriting branding or decorative artwork.

## Verification

Type checking, lint, six unit tests, static build and SEO/asset validation passed. All **72 Playwright tests** passed against production output, including the three no-JavaScript tests, 21 accessibility scans, the new navigation/handoff regressions and seven-page 320px reflow. Tests ran in desktop, tablet and mobile Chrome configurations. Additional screenshots were inspected at 390, 701 and 1440px; width measurements also covered 768 and 1024px.

Two single-run mobile Lighthouse audits of production output:

| Measurement | Before | After |
|---|---:|---:|
| Total transfer | 1,051,586 bytes | 872,789 bytes |
| Performance | 98 | 96 |
| Accessibility / best practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |
| LCP | 2.50s | 2.50s |
| TBT | 0ms | 125ms |
| CLS | 0.0014 | 0.0014 |

Transferred bytes decreased by 178,797 (17%). Timing and score variation between single runs is not evidence of a reliable speed increase or regression. Estimated remaining image savings decreased from 445 KiB to 270 KiB. Crawlability was excluded because the preview remains intentionally noindex. Local screenshots, measurements and both audits are in ignored `.local/site-inspection/`.

The user deferred contact verification, reviews, team photos and the homepage film. Those remain unchanged and are not claimed as complete. Existing archived asset ZIPs and historical handover measurements describe the earlier delivery, not this update. Real-device/Safari/Firefox testing and client acceptance remain pending. Nothing was deployed.
