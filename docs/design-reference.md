# Approved homepage analysis

## Authority and dimensions

Source: user-supplied `image 4.png`, 2409 × 6510 pixels (aspect 0.370). Measurements below are approximate proportions observed in the source, not original design-file dimensions. The image appears to represent a desktop page around 1440 CSS pixels wide, with a 1240px content column and approximately 100px outer margins. Desktop fidelity takes precedence over Taste's conflicting bans on eyebrows, cards, gradients, ornaments, italic accents, and three-line headlines. No randomly dealt replacement design is appropriate.

## Composition and section sequence

1. White header: roughly 2.3% of page height, logo left, five small central links, search, green trip pill, menu right. No sticky behavior is established by the screenshot; implementation uses a normal-flow header.
2. Hero: roughly 18.7% of page height, a full-width photograph with fortress at right and warm sunrise, fading to white at left. Left copy begins about 7% from the edge; heading breaks into `Extraordinary / Journeys, / Real Connections.`. Uppercase tracked eyebrow, forest serif display, italic bronze final line, two-line supporting copy, pill CTAs, overlapping portraits/trust copy and small slide selectors. Right includes script annotation, circular story control and vertical scroll cue.
3. Category strip: about 4.3%, five equal columns with bronze outline icons and vertical separators on a white ground.
4. Story: about 13.5%, elephant portrait at left overlapping a small tea-country landscape, tilted ivory note and green botanical cluster; right text, stamp and bronze branch. Four compact benefits beneath right copy. Large serif heading in two lines; a green pill action.
5. Featured tours: about 15%, heading at left, all-tours link and circle controls right. Three equal cards, 1.65:1 images, duration pills, subtle shadows, warm-white surfaces, small rounded corners and outlined tour links. External circular controls flank the image row.
6. Experiences: about 13%, near-equal split. The left photograph of two travellers overlooking a reservoir reaches the page edge; its bottom silhouette is a broad asymmetric wave. Script note at upper right. Right has a two-line heading, supporting copy and five narrow portrait cards with dark foot gradients and small icons.
7. Why us: about 10%, left editorial copy, right horizontal tea-picker image with a low irregular oval silhouette and tilted paper note. Five benefits run across the bottom. Very faint topographic decoration is secondary.
8. Testimonials: about 8%, three white cards, bronze quote marks, sample quotes, profile treatment and orange stars. The sample reviews are not verified; preview must label this section and must not expose review structured data.
9. Closing CTA: about 9.5%, turquoise beach panorama, green gradient behind left copy, broad white curve entering from the lower-right, script annotation on the white end. Two pill actions.
10. Footer: about 6%, logo and tagline left, compact Explore, Support and social groups, a fine lower divider with copyright and policy links.

## Design system

Observed palette approximations: forest `#073e33`, display ink `#173b32`, warm bronze `#a97c4f`, muted bronze `#b18c68`, white `#fff`, ivory `#faf9f6`, secondary ink around `#64716d`. Use accessible darker variants for small copy where necessary. Headings appear to be a high-contrast editorial serif: Cormorant Garamond is a close available approximation, not a verified font match. DM Sans approximates the humanist sans body; Caveat approximates handwritten annotations. These are three functional roles visible in the reference, despite the skill's generic two-font preference.

Desktop hero display approximately 72–80px, section headings 48–54px, card titles 23–26px, body 16–18px, eyebrows 10–12px with generous tracking. Display leading around 0.98, body leading 1.5. Layout uses 8px increments, 20–24px card gaps, approximately 72–100px section padding, round buttons 46–52px tall, 10–14px card radii and soft low-opacity shadows. Images define aspect ratio to prevent layout shift. Decoratives remain individual transparent SVGs. Notes remain individual layered assets.

## Responsive interpretation (inferred)

At tablet widths hide central navigation into the accessible menu, reduce hero typography and preserve the rock focal point. At mobile widths stack copy and photographs, retain hero fade behind readable text, turn categories into a compact scroll row, stack story and experiences, use a scrollable tour row and a two-column experience grid. Stack benefits and testimonials. Collapse footer to a two-column grid. Keep hit areas at least 44px, no horizontal document overflow, focus rings and reduced-motion support. These states are engineering interpretations; no mobile reference was supplied.

## Interaction decisions (inferred)

Search opens a labelled native dialog and searches the local content catalogue. Tour arrows rotate the visible tour ordering; card actions open an itinerary dialog. Hero selectors switch between three relevant landscape scenes. Watch Our Story opens an editorial story dialog because no verified video exists; the missing film is disclosed. No fake video player. Planning form validates and can download an enquiry brief; email/WhatsApp handoff only appears after verified configuration. No invented submission success.
