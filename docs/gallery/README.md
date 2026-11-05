# Itineraries guest gallery

Uses all 69 user-supplied JPEG and HEIC photos from ../IMG, converted to self-hosted WebP without original metadata. Original files remain unchanged. HEIC files were converted with the bundled heif-convert decoder, then optimized as WebP.

Composition follows the supplied n8n reference: a continuously flowing horizontal row of large rounded photo cards. Existing Majestic palette and typography retained. No customer names or quotations invented.

Browser verification: Microsoft Edge at 1440, 768 and 390 CSS pixels. No document overflow; visible images loaded. Automatic motion, pause and reduced-motion checks passed. Screenshots are alongside this note. Real-device testing and client acceptance remain human review items.

Motion: 35 pixels/second, pause on hover/focus and touch, explicit pause/play control, reduced-motion disables automatic movement. The non-JavaScript fallback is a horizontally scrollable photo row.

Gallery page: /gallery/ shows all 69 photos at their natural proportions in responsive columns. Links are available beside Pause gallery, in expanded navigation, footer and site search. Larger photo viewing supports previous/next, arrow keys and Escape. Edge browser checks passed at 1440, 768 and 390 pixels, with no document overflow. Shared photo data is maintained in src/data/guest-photos.ts.

Build measurements keep the original 7.4 MB WebP budget for existing site assets and separately cap the approved guest collection at 14 MB for full photos, 10 MB for cropped moving-card copies, and 400 KB per image. The 69 guest photos measure 12,436,638 bytes for full photos and 7,768,336 bytes for moving-card copies; the largest file is 334,704 bytes. These are build inventory sizes, not initial page transfer.

Watermarks: all 69 full photos and 69 moving-card copies have the existing business logo embedded in the upper-right image pixels, on a 78%-opaque white backing with padding. Moving-card crops are made before adding the watermark so it stays within the frame. Full-photo links and viewer downloads use the marked files, with a logo-v2 URL version to refresh existing browser caches. No unmarked source is added to public/.

Regenerate from private originals with npm run assets:guest-watermarks -- ../IMG. A --preview flag writes one sample under .local/watermark-preview. The generator verifies source hashes before/after each photo, records output hashes and dimensions in watermark-manifest.json, strips EXIF, and refuses files above 400 KB. heif-convert must be available for HEVC photos Sharp cannot decode. Originals remain in the private sibling IMG folder.

Validation: 12 unit tests pass, including hashes and metadata for all 138 marked files. Astro check, lint, build, SEO and measured build budgets pass. Edge checked the Gallery page, viewer, moving strip, versioned direct downloads and absence of horizontal overflow at 1440, 768 and 390 pixels. New screenshots use the watermarked- prefix. Physical-device/client acceptance remains human review.

Moving-strip consistency: every source card is 620 × 820 pixels, including formerly wider cards. All embedded badges therefore use identical logo dimensions and corner insets. Rendered cards measure 310 × 410 pixels at desktop/tablet sizes and 250 × 330.64 pixels on phones, preserving the same aspect ratio. Browser geometry checked all 69 cards at 1440, 768 and 390 pixels. Full-photo viewer and Gallery page retain natural photo proportions.
