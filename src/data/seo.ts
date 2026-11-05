export interface PageSeo {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  type: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
  label: string;
}

export const pageSeo: Record<string, PageSeo> = {
  "/gallery/": {
    title: "Sri Lanka Guest Photo Gallery",
    description:
      "Explore moments from our guests’ Sri Lankan journeys, from waterfalls and hill country to shared meals and coastal views.",
    image: "hero-sigiriya",
    imageAlt: "Sigiriya rising above a green Sri Lankan landscape",
    type: "CollectionPage",
    label: "Gallery",
  },
  "/": {
    title: "Private Tours in Sri Lanka",
    description:
      "Discover Sri Lanka through private tours and tailor-made experiences, thoughtfully planned by locals. Explore culture, wildlife, tea country and the coast.",
    image: "hero-sigiriya",
    imageAlt: "Sigiriya rising above a misty green landscape",
    type: "WebPage",
    label: "Home",
  },
  "/itineraries/": {
    title: "Sri Lanka Private Itineraries",
    description:
      "Explore suggested private Sri Lanka itineraries through the Cultural Triangle, tea country and the southern coast. Find a starting point for your personal journey.",
    image: "hero-sigiriya",
    imageAlt: "Sigiriya rock above green forest at sunrise",
    type: "CollectionPage",
    label: "Itineraries",
  },
  "/tailor-made/": {
    title: "Tailor-Made Sri Lanka Tours",
    description:
      "Shape a tailor-made Sri Lanka tour around your interests, travel pace and preferred experiences. Explore the planning process and prepare your personal travel brief.",
    image: "reservoir-travellers",
    imageAlt: "Two travellers overlooking a reservoir and green mountains",
    type: "WebPage",
    label: "Tailor-Made",
  },
  "/experiences/": {
    title: "Sri Lanka Travel Experiences",
    description:
      "Find your connection to Sri Lanka through wildlife, culture, beaches, tea country and food. Discover experiences to shape a personal journey.",
    image: "hill-country",
    imageAlt: "Green tea terraces and layered mountains",
    type: "CollectionPage",
    label: "Experiences",
  },
  "/about-us/": {
    title: "About Majestic Sri Lanka | Local Travel Expertise",
    description:
      "Explore the approach behind Majestic Sri Lanka: local knowledge, personalised journeys and thoughtful connections to the island’s places, people and stories.",
    image: "tea-pickers",
    imageAlt: "Two women gathering leaves among green tea bushes",
    type: "AboutPage",
    label: "About Us",
  },
  "/plan-your-trip/": {
    title: "Plan Your Sri Lanka Trip",
    description:
      "Create a personal Sri Lanka travel brief with your dates, interests and travel pace. Review and download it before choosing an email or WhatsApp handoff.",
    image: "reservoir-travellers",
    imageAlt: "Travellers looking across a reservoir from a rocky viewpoint",
    type: "WebPage",
    label: "Plan Your Trip",
  },
  "/contact-us/": {
    title: "Contact Majestic Sri Lanka | Plan Your Trip",
    description:
      "Contact Majestic Sri Lanka on WhatsApp, prepare your personal travel brief and explore practical travel questions before planning your Sri Lankan journey.",
    image: "southern-coast",
    imageAlt: "Coconut palms above a beach at sunset",
    type: "ContactPage",
    label: "Contact Us",
  },
};

export function siteTitle(title: string) {
  return title.includes("Majestic Sri Lanka")
    ? title
    : `${title} | Majestic Sri Lanka`;
}
