# Ella homepage side extensions

The user requested AI-generated scenery only in the blank sides, with the client photo unchanged. The built-in image_gen tool generated two alternatives. Only scenery from the second output is used. Its recreated people/sign/logo center is discarded.

Selected generated reference: assets/generated/ella-outpaint-source-v2.png. First attempt is retained as assets/generated/ella-outpaint-source.png for history; neither large PNG is served by the website.

Prompt: Fill ONLY the two pure-white vertical side strips of the exact 1165 × 1100 canvas: x=0..169 and x=995..1164. Protect the original photo at x=170..994, with all people, faces, clothing, sign letters, logo and original details unchanged. Continue the dense flowering bush/red blossoms on the left, pale hazy sky and forested hillside on the right, and patterned brick terrace at the bottom. Match boundary heights, camera perspective, exposure and colors; add no people, objects, text or logos.

Preparation: normalize the generated scenery to the canvas; discard its entire central 825 × 1100 region by making it transparent. Color-match only the added side edges to local average original boundary colors, retaining generated texture. Encode side-only transparent WebP files at 720px (43,008 bytes) and 1165px (87,314 bytes). The original watermarked img_6747.webp is a separate unchanged foreground element, centered at its original 3:4 aspect ratio. Original files in ../IMG are unchanged.

The site retains its wave mask. Photo and scenery have separate elements, so no generated pixels can replace any of the original photo. The 1165px side asset is tested for zero alpha throughout the entire protected center; the original photo hash is checked against the watermark manifest.

Validation: 13 unit tests pass; build, SEO validation and existing build budgets pass. Browser geometry at 1440, 768 and 390px confirms equal side widths, an undistorted original aspect ratio and no document overflow. Screenshots are docs/gallery/home-ella-extended-*.png. Mobile caption moved below faces. Side scenery is illustrative AI outpainting, not a documentary capture of the exact surrounding viewpoint.
