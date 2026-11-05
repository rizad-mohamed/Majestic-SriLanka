# Itineraries guest gallery

Uses all 69 user-supplied JPEG and HEIC photos from ../IMG, converted to self-hosted WebP without original metadata. Original files remain unchanged. HEIC files were converted with the bundled heif-convert decoder, then optimized as WebP.

Composition follows the supplied n8n reference: a continuously flowing horizontal row of large rounded photo cards. Existing Majestic palette and typography retained. No customer names or quotations invented.

Browser verification: Microsoft Edge at 1440, 768 and 390 CSS pixels. No document overflow; visible images loaded. Automatic motion, pause and reduced-motion checks passed. Screenshots are alongside this note. Real-device testing and client acceptance remain human review items.

Motion: 35 pixels/second, pause on hover/focus and touch, explicit pause/play control, reduced-motion disables automatic movement. The non-JavaScript fallback is a horizontally scrollable photo row.

Gallery page: /gallery/ shows all 69 photos at their natural proportions in responsive columns. Links are available beside Pause gallery, in expanded navigation, footer and site search. Larger photo viewing supports previous/next, arrow keys and Escape. Edge browser checks passed at 1440, 768 and 390 pixels, with no document overflow. Shared photo data is maintained in src/data/guest-photos.ts.
