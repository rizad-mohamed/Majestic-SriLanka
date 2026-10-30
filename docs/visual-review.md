# Reference comparison and visual review

The supplied reference is a raster at 2409 × 6510; it has no recorded CSS viewport or device-pixel ratio. The implementation uses a 1440px desktop interpretation. A full-page 1440px screenshot and a matching 2409px raster-density capture are supplied, alongside an actual 2409 CSS-pixel-wide layout. The two comparisons answer different questions and must not be treated as exact original viewport recovery.

Full-page screenshot capture explicitly requests painting of offscreen deferred sections, since a camera capture does not naturally scroll through them. This capture-only style changes no geometry or content. Section screenshots and interaction checks use the normal scrolling page. The production page retains native offscreen rendering optimization.

## Round 1

Seen in one second: a large editorial heading beside a warm Sigiriya landscape.

Idea: local people and Sri Lankan landscapes form a layered travel journal, following the approved client composition.

Live thing: a personal trip brief builder, supported by itinerary previews and journey search.

Layout words: hero=panorama/fade; categories=strip; story=collage/split; tours=three cards; experiences=organic split/portrait cards; why=editorial/cutout; stories=three quotes; CTA=panorama/curve; footer=columns.

Subjective review: design 7.8, usability 7.2, creativity 7.0, content 6.5; weighted 7.37. These are internal critique scores, not independent jury results or automated acceptance measures. Taste's generic ornamental caps do not apply because the user explicitly requires those devices.

Top three observed problems:

1. The 320px page had 20px horizontal overflow around the story grid. Give the grid and children explicit zero minimum widths and wrap the compact benefits.
2. Bronze eyebrows narrowly missed the contrast threshold, and compact footer links failed target spacing. Darken only the small-text bronze token and increase footer hit areas while preserving the reference palette and structure.
3. Escape in a populated search field cleared the field before closing the dialog. Add explicit dialog Escape handling and preserve return focus.

Photographic subjects, section ordering, layered paper/leaf details and organic image masks visibly follow the reference. All typography, source scenes and the elephant mark are approximations. The reference's traveller portraits are represented by illustrative monograms to avoid presenting generated faces as real customers. No original logo/vector or customer portraits were supplied. The hero trust statement avoids an unsupported worldwide-customer claim. The story action discloses that a film is not yet available. Unverified sample reviews are labelled. Social destinations and business contacts are explicit placeholders, as requested.

## Round 2

The corrected desktop, tablet and mobile screenshots retain the reference's section sequence, fade, collage, card proportions, masks and floating notes. The font roles load successfully; 25 homepage images have no broken assets. All 66 browser checks passed, including axe scans on each page at three viewport sizes and 320px reflow checks. The narrow screen has at most one pixel of rounding overflow, within the test tolerance.

Subjective review: design 7.8, usability 8.0, creativity 7.0, content 6.5; weighted 7.61. No independent approval is implied. The principal remaining visual differences are the regenerated photographs, approximate brand mark and fonts, illustrative monogram portraits, and handwritten-note treatment. Original artwork would be needed for exact pixel-level matching. The reference's overall 2409 × 6510 shape is close to the implementation's 2409px-density desktop capture, but the source's original viewport is unknown.

Initial Lighthouse findings prompted real image and font optimization: five responsive widths, lower WebP transfer sizes, descriptors from actual source dimensions, critical font preloads and removal of an unnecessary display weight. Dialog scroll locking now uses a class rather than a page-wide `:has()` selector. A comparison confirmed that deferred offscreen layout produced most of the mobile gain. Its paint containment is applied to full-width wrappers, leaving space for floating leaves, notes and carousel controls beyond the narrower content column. Remembered intrinsic section sizes preserve document flow. Final measured scores are in the handover and report JSON.
