# Performance evidence

Measurements are local production-artifact laboratory tests, not real-user field data or a promise of rankings. The approved composition, original scenes and WebP fallbacks remain intact. Targeted rendering rules and AVIF delivery address a measured mobile bottleneck. No audit was skipped in the new runner, and no indexing setting was changed to inflate a preview score.

## Baseline

A fresh baseline of the original main build with Lighthouse 13.6.0 recorded homepage mobile P/A/BP/SEO **97/100/100/69** and desktop **99/100/100/69**. The only failed weighted SEO audit was intentional noindex crawlability. The historical checked-in 31 October summary reported SEO 100 after excluding that audit and covered only three routes; those values must not be presented as complete comparable scores.

The baseline browser harness printed 72 successful cases but hung during Windows preview cleanup. It was stopped and is not counted as a completed successful suite. Owned foreground previews and explicit startup timeouts now avoid this problem. The fresh performance baseline used the unchanged built HTML before implementation was rebuilt.

## Build and transfer budgets

These are actual file sizes and consistent gzip estimates, not measured HTTP transfer or a claim that the host enables gzip/Brotli. Entire font/image inventories include every responsive variant, not only assets selected by one page.

| Asset class                 |     Baseline |                                              Final reviewed build |                                Enforced budget |
| --------------------------- | -----------: | ----------------------------------------------------------------: | ---------------------------------------------: |
| Client JS, gzip             |      3,389 B |                                                           4,198 B |                                        6,000 B |
| CSS, gzip                   |     12,207 B |                                                          12,269 B |                                       14,000 B |
| Largest HTML, gzip (home)   |     10,975 B |                                                          11,238 B |                          15,000 B per document |
| All WOFF2 sources           |    233,320 B |                                                         233,320 B |                            240,000 B inventory |
| All WebP variants + logo    |  7,026,984 B |                                                       7,026,984 B |                          7,400,000 B inventory |
| Optional AVIF hero variants |          0 B |                                                         345,993 B |                            400,000 B inventory |
| Automatic external requests | No analytics | None in default build; browser assertions enforce local resources | Zero until explicitly configured and consented |

The added 809 gzip bytes of JS provide consent-gated event handling and robust dialog keyboard behavior. HTML grows to carry linked schema and complete sharing metadata. CSS gains 62 gzip bytes for deferred row rendering and native picture support. Original WebP files and fonts are unchanged; four AVIF variants add 345,993 bytes to the deployable inventory while reducing the selected hero request. Budgets allow modest reviewed growth from the measured baseline without forcing removal of the approved design. Network, font and image diagnostics remain available in raw Lighthouse reports.

LCP uses existing high-priority responsive hero media, local critical font preloads and static HTML; below-fold images remain lazy. Existing content-visibility boundaries and reduced-motion behavior are retained. There is no decorative video, React hydration, animation framework or third-party script in the default load. Default image intrinsic ratios now follow actual crops.

## Measured Experiences optimization

The first complete 42-audit sweep exposed Experiences mobile at 83 performance, 3.924s LCP, zero CLS and 183ms TBT. That sweep is preserved in performance-before-optimization.json; it was not reported as a passing gate.

Deferring lower rows using content-visibility reduced the targeted median to 3.248s LCP and performance 89. Accurate sizes select existing smaller photo variants according to the actual CSS gutters and columns. Native AVIF for the actual hero, encoded from the same original PNG with the same crop/resolution and a WebP fallback, then reached median performance 90 (samples 90/89/93), 3.419s LCP, zero CLS and 158ms TBT. This is a small noisy lab sample, not proof of field LCP compliance or a guarantee of 100. The 960px hero is 92,784 bytes versus 146,984 bytes in WebP, a 36.9% reduction. A side-by-side visual check preserves the scene and crop; client approval remains separate.

The hero had only about 30ms measured request-discovery delay; its larger delay was rendering, so speculative preloading every image was not introduced. Main-thread work was dominated by style/layout and unattributed tasks, with script execution around 45ms and several slow-CPU warnings. All raw samples remain retained. Offscreen rendering is forced visible for full-page screenshots and axe to avoid concealing unrendered content from verification.

## Lighthouse method and remaining audits

The final runner audits all seven pages on mobile and desktop, owns foreground port 4323, preserves raw JSON/HTML under deliverables/lighthouse/current and saves summary.json after each combination. Four standard categories are selected; the experimental agentic category is not represented as a universal standard. CI also uses three runs per combination; the default local script supports three independent runs and reports the median-performance run with every sample retained.

The raw preview SEO score includes is-crawlable failure. The gate verifies that failure is intentional and that every other weighted SEO audit passes; it does not calculate an adjusted score. Production indexing is separately checked with a never-published fixture. A non-100 performance metric is investigated in its raw report rather than hidden.

The completed route/device table below is generated from actual summary.json. Local CPU variability remains a measured constraint: the original homepage mobile baseline reported benchmarkIndex 720.5, while the final homepage samples reported 960, 1043.5 and 1004.5, with a slow-CPU warning on the first sample. This supports investigating environment variability; it does not prove that every score difference is environmental. The final homepage median has 325ms TBT and 2.583s LCP, with style/layout dominating main-thread work. No threshold, throttle or audit is relaxed. The local failing performance gate is recorded explicitly, and the actual GitHub check on the final commit must pass before merge. Host compression/cache/CDN latency and real-device behavior remain external measurements.

## Completed local sweep

42 audits completed on 2 November 2026. The local gate exited with failure for homepage mobile only (median 87); it is not reported as a full pass. All other 13 combinations meet the stated thresholds. All weighted SEO audits except intentional preview crawlability passed in every sample. Raw reports and all samples are retained; no successful rerun replaces this evidence. The first complete pre-optimization sweep and targeted Experiences trials are separate measurements.

| Route            | Device  |   P |   A |  BP | Raw SEO | LCP (s) |   CLS | TBT (ms) | P samples   |
| ---------------- | ------- | --: | --: | --: | ------: | ------: | ----: | -------: | ----------- |
| /                | mobile  |  87 | 100 | 100 |      69 |   2.583 | 0.000 |      325 | 89/86/87    |
| /tours/          | mobile  |  93 | 100 | 100 |      69 |   2.497 | 0.000 |      195 | 92/93/93    |
| /tailor-made/    | mobile  |  92 | 100 | 100 |      69 |   2.953 | 0.000 |      189 | 88/92/93    |
| /experiences/    | mobile  |  94 | 100 | 100 |      69 |   2.798 | 0.000 |      150 | 94/90/95    |
| /about-us/       | mobile  |  92 | 100 | 100 |      69 |   2.647 | 0.000 |      194 | 92/92/92    |
| /plan-your-trip/ | mobile  |  95 | 100 | 100 |      69 |   2.132 | 0.000 |      194 | 95/95/94    |
| /contact-us/     | mobile  |  95 | 100 | 100 |      69 |   2.494 | 0.000 |      100 | 95/94/95    |
| /                | desktop |  99 | 100 | 100 |      69 |   0.781 | 0.002 |        7 | 99/100/99   |
| /tours/          | desktop | 100 | 100 | 100 |      69 |   0.703 | 0.000 |        0 | 100/100/100 |
| /tailor-made/    | desktop | 100 | 100 | 100 |      69 |   0.744 | 0.000 |       31 | 100/100/100 |
| /experiences/    | desktop | 100 | 100 | 100 |      69 |   0.809 | 0.000 |       18 | 100/100/99  |
| /about-us/       | desktop | 100 | 100 | 100 |      69 |   0.667 | 0.000 |        0 | 100/100/100 |
| /plan-your-trip/ | desktop | 100 | 100 | 100 |      69 |   0.585 | 0.000 |        0 | 100/100/100 |
| /contact-us/     | desktop | 100 | 100 | 100 |      69 |   0.734 | 0.000 |       25 | 100/100/100 |

Homepage diagnostic comparison: baseline and final median LCP are similar (2.557s and 2.583s), while TBT rises from 36ms to 325ms and Speed Index from 2.315s to 4.616s. Total style/layout work in the raw final median is about 1.003s versus 1.086s in the baseline; the result does not establish increased total layout work from the implementation. CPU warnings and long-task timing warrant an independent CI measurement. Throttling, median method, performance threshold and assertions remain unchanged.

## Core Web Vitals limits

Good thresholds are p75 LCP <=2.5s, INP <=200ms and CLS <=0.1, per [Google's Web Vitals guidance](https://web.dev/articles/vitals). Local LCP/CLS are lab observations only. TBT is a laboratory diagnostic and is not INP. No CrUX/RUM dataset or verified live production domain was supplied, so field compliance and real-user INP remain unverified. Confirm the domain, launch approved content, then gather sufficient real traffic and inspect Search Console/CrUX or approved RUM.

A later fragment-entry robustness fix adds 21 gzip CSS bytes over the measured sweep: a targeted fragment renders the short experience list before native anchor scrolling/hit testing, while ordinary route visits retain the measured deferral behavior. CI re-audits the resulting build. The saved local 42-audit table remains the actual earlier measurement, not a fabricated rerun of the CSS change.
