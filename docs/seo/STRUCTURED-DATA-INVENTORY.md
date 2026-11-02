# Structured data inventory

`src/lib/schema.ts` emits one safely serialized JSON-LD graph per primary page. `src/lib/site-config.mjs` escapes HTML script delimiters and line separators; the regression test round-trips hostile text without creating markup. Values are controlled site content, never form input.

| Entity         | Routes                     | Identity / purpose                                                                                                                                   |
| -------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Organization   | All seven                  | One `origin/#organization` per document; brand, site, supplied logo and owner-supplied WhatsApp ContactPoint URL. Confirmed email only when enabled. |
| WebSite        | All seven                  | `origin/#website`, publisher references Organization; English language.                                                                              |
| ImageObject    | All seven                  | `canonical#primaryimage`, real manifest URL and exact dimensions; scene description. Generated scenes are not proof of actual customers/team.        |
| WebPage        | Home, Tailor-Made, Planner | `canonical#webpage`, correct title, description, URL, website/publisher/image references.                                                            |
| CollectionPage | Tours, Experiences         | Existing route/experience collections, without claiming priced products or bookable offers.                                                          |
| AboutPage      | About Us                   | Actual business-approach page, references the same Organization.                                                                                     |
| ContactPage    | Contact Us                 | Existing contact page; no invented address, phone service or opening hours.                                                                          |
| BreadcrumbList | Six inner pages            | Two items matching visible PageHero navigation: Home and current page. No breadcrumb is invented for Home.                                           |
| ContactPoint   | Organization property      | Travel-enquiry WhatsApp URL; not represented as a verified voice telephone service.                                                                  |

No schema on 404. No LocalBusiness, postal address, coordinates, hours, price, rating, review, Offer, unverified social `sameAs`, FAQ-rich-result or guaranteed trip entities. Repeated stable organization IDs describe the same entity across documents rather than separate businesses.

The build validator checks JSON parseability, expected page subtype, unique entity IDs, consistent organization/website references, canonical URLs, visible breadcrumbs, image file existence/dimensions and absence of fabricated ratings/address. Preview and isolated production-mode validation use the same renderer. Final execution status is in TEST-AND-UAT-REPORT.md. External Google Rich Results Test/Search Console validation awaits a public approved domain; it is not claimed here.

References: [Google organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization), [Schema.org CollectionPage](https://schema.org/CollectionPage). Schema validity does not guarantee a search feature or ranking.
