# Mobile images and enquiry document — 2 November 2026

The editorial, experience detail and contact images share a square crop and 24px corner radius at widths up to 700px. Desktop masks are preserved. Chrome measurements at 320, 390 and 700px confirm equal image dimensions and no horizontal page overflow on the three affected routes; desktop was checked at 1440px. Screenshots are in `deliverables/screenshots/mobile-fix/`. Physical-device acceptance remains pending.

The planner can download an email draft (`.eml`) containing the complete UTF-8 travel brief as a `.txt` document attachment. A verified configured recipient is included when available; otherwise the recipient is left empty. The draft is generated locally and does not transmit any data. Compatible email applications can open the draft; mobile applications without EML support can attach the separate text brief manually.

The user has no receiving email address or email service yet. Automatic email delivery is therefore unresolved: it requires a verified recipient, a server-side email integration and approved privacy details. Do not claim an enquiry was sent or enable unverified contact details.

Validation: build, Astro check (zero diagnostics), lint, seven unit tests, SEO build validation and planner browser tests on desktop, tablet and mobile passed. MIME tests check Unicode attachment integrity and reject recipient header injection.
