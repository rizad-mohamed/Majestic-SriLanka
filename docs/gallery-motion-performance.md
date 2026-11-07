# Gallery motion verification

Measured on 6 November 2026 with the same local Chromium runtime, a 1440px desktop viewport and a 390px phone viewport. Each sample records five seconds of animation after the first photo decodes. The measuring requestAnimationFrame loop only records timestamps; the shipped gallery has no JavaScript frame loop.

| Sample                                         | Mean frame interval | 95th percentile | Frames over 25ms | Layouts during sample | Script time |
| ---------------------------------------------- | ------------------: | --------------: | ---------------: | --------------------: | ----------: |
| Original scrollLeft loop, desktop              |             18.65ms |          33.3ms |               17 |                     0 |      0.609s |
| Final native transform + static fades, desktop |             16.67ms |          16.7ms |                0 |                     0 |      0.014s |
| Final native transform + static fades, phone   |             16.67ms |          16.7ms |                0 |                     0 |      0.014s |

The final samples contain 301 frame intervals each, matching a 60Hz cadence. Script time in the desktop sample decreased by approximately 98%. These are bounded lab observations, not a universal FPS or physical-device guarantee.

The important rendering change is the edge treatment: static gradient overlays recreate the fade against the page background, instead of applying a full-window alpha mask to the moving strip. Rounded frames, photographs, dimensions, crop positions, spacing and pace remain unchanged. Keyboard focus removes the edge fades as before. The existing source gallery stays available for native scrolling and reduced-motion/no-JavaScript use.

The initial transform implementation retained the moving mask and showed desktop frame drops in this Windows sample. Clipping and bounded-buffer experiments did not produce the required improvement and are excluded from the final implementation. The simpler verified controller is retained.

## Audit interpretation

The first complete GitHub quality run on this feature passed 343 browser tests across Chromium, Firefox and WebKit profiles, plus 12 production tests. Its Lighthouse medians were home 95 mobile / 100 desktop and itineraries 98 mobile / 100 desktop, with 100 accessibility and best practices. The PR carries the final verification for the edge-fade refinement.

Local Windows Lighthouse mobile runs were highly variable and below the repository threshold. An isolated unchanged-main baseline also missed that threshold (82, 93, 89). Candidate diagnostics and failed experiments are retained in ignored local evidence; they are not represented as passing audits. Desktop local audits scored 99-100. Preview SEO remains intentionally 69 due to noindex; indexable production SEO is verified separately.

The final delivery report distinguishes GitHub audit results from these Windows diagnostics. Client acceptance and real-device testing remain human review steps.
