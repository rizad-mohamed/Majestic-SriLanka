export const brand = {
  name: "Majestic Sri Lanka",
  tagline: "Authentic journeys. Meaningful experiences.",
  proposedEmail: "info@majesticsrilanka.com",
  proposedDomain: "majesticsrilanka.com",
  email:
    import.meta.env.PUBLIC_CONTACTS_CONFIRMED === "true"
      ? import.meta.env.PUBLIC_CONTACT_EMAIL || ""
      : "",
  whatsapp: (import.meta.env.PUBLIC_WHATSAPP_NUMBER || "94740485072").replace(
    /\D/g,
    "",
  ),
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Itineraries", href: "/itineraries/" },
  { label: "Tailor-Made", href: "/tailor-made/" },
  { label: "Experiences", href: "/experiences/" },
  { label: "About Us", href: "/about-us/" },
  { label: "Gallery", href: "/gallery/" },
];

export { tours } from "./tours";

export const featuredExperiences = [
  {
    id: "wildlife",
    alt: "An elephant among dense tropical greenery",
    title: "Wildlife & Nature",
    image: "wildlife",
    icon: "wildlife",
    description:
      "Quiet moments in wild places. Build a journey around nature, birdlife and respectful wildlife encounters.",
    detail:
      "Choose observation over interaction. Keep a respectful distance, avoid feeding animals and allow space for their natural behaviour.",
  },
  {
    id: "culture",
    alt: "An ancient brick temple surrounded by green trees",
    title: "Culture & Heritage",
    image: "culture",
    icon: "culture",
    description:
      "Ancient stone, living traditions and stories that connect the past with the present.",
    detail:
      "Make time for heritage sites alongside everyday culture. Ask before taking portraits and follow local guidance at sacred places.",
  },
  {
    id: "beaches",
    alt: "Coconut palms above a beach and turquoise sea",
    title: "Beaches & Coast",
    image: "beaches",
    icon: "beach",
    description:
      "Palm-fringed shores, coastal walks and the freedom to slow down by the Indian Ocean.",
    detail:
      "Coastal conditions vary by location and season. Shape each beach stay around your dates and local conditions.",
  },
  {
    id: "tea",
    alt: "Green tea terraces beneath layered mountains",
    title: "Hill Country & Tea",
    image: "tea-country",
    icon: "mountain",
    description:
      "Cool mornings, winding railway lines and green hills that invite you to take the longer route.",
    detail:
      "Mix time among the tea terraces with scenic train journeys and walks suited to your pace. Railway reservations are subject to availability.",
  },
  {
    id: "food",
    alt: "Rice, curries and colourful side dishes served in earthenware bowls",
    title: "Food & Cuisine",
    image: "sri-lankan-food",
    icon: "food",
    description:
      "Fragrant spices, colourful curries and a deeper connection to the island through its food.",
    detail:
      "Share your dietary needs before planning. Food-focused experiences can be shaped around markets, local dishes and cooking traditions.",
  },
];

export const experiences = [
  ...featuredExperiences,
  {
    id: "snorkelling-diving",
    title: "Snorkelling & Diving",
    searchDescription:
      "Coral reefs and marine life at Pigeon Island and Sri Lanka’s coast.",
    icon: "beach",
    description:
      "Explore the underwater world beneath Sri Lanka’s turquoise waters. Discover colourful coral reefs and fascinating marine life on memorable snorkelling and diving experiences with experienced professionals.",
    detail:
      "Enjoy the reef with care. Follow your guide’s advice and observe marine life without touching coral or disturbing wildlife.",
  },
  {
    id: "private-beach-parties",
    title: "Private Beach Parties",
    searchDescription:
      "Private beach celebrations with dining, music and ocean views.",
    icon: "sun",
    description:
      "Celebrate by the ocean with a private evening on a secluded tropical beach. Ocean views, delicious cuisine and music create a magical atmosphere under the stars.",
    detail:
      "Shape the celebration around your occasion. The photograph shows Sri Lankan beachfront dining for inspiration; it does not depict a Majestic Sri Lanka venue or event.",
  },
  {
    id: "upper-diyaluma",
    title: "Upper Diyaluma",
    searchDescription:
      "Nature walks, waterfall pools and mountain scenery at Upper Diyaluma.",
    icon: "mountain",
    description:
      "A walk into paradise. Follow a scenic nature trail through lush landscapes to Upper Diyaluma’s natural infinity pools and sweeping mountain views, an escape for nature lovers and adventure seekers.",
    detail:
      "Take time to enjoy the waterfall scenery and follow local guidance around the pools and steep edges.",
  },
  {
    id: "gal-oya",
    title: "Gal Oya National Park",
    searchDescription: "Boat safaris and wildlife around Senanayake Samudraya.",
    icon: "wildlife",
    description:
      "Discover Sri Lanka’s hidden wilderness, from pristine landscapes to Gal Oya’s distinctive lake ecosystem. A boat safari offers a remarkable perspective on its wildlife, with elephants sometimes seen swimming between islands.",
    detail:
      "Allow the wildlife to set the pace. Elephant sightings and swimming encounters depend on natural conditions and cannot be guaranteed.",
  },
  {
    id: "rathugala",
    title: "Rathugala",
    searchDescription:
      "Living traditions shared by Rathugala’s Indigenous community.",
    icon: "people",
    description:
      "Meet the Indigenous people of Sri Lanka in Rathugala. Learn about living traditions, ancestral knowledge and the community’s deep connection with nature through a respectful cultural encounter shaped by your hosts.",
    detail:
      "Let community members guide what they wish to share, and ask permission before taking photographs. This is a living heritage, shared on their terms.",
  },
];

export const benefits = [
  {
    icon: "people",
    title: "Local Expertise",
    description: "A passionate team based in Sri Lanka.",
  },
  {
    icon: "leaf",
    title: "Authentic Experiences",
    description: "Meaningful travel beyond tourist trails.",
  },
  {
    icon: "gem",
    title: "Responsible Travel",
    description: "Supporting local people and places.",
  },
  {
    icon: "heart",
    title: "Personalised Itineraries",
    description: "Tailored to your interests and travel style.",
  },
  {
    icon: "support",
    title: "End-to-End Support",
    description: "From planning to your return home.",
  },
];

export const faqs = [
  {
    question: "Can I personalise one of the featured journeys?",
    answer:
      "Yes. The featured routes are starting points for a conversation. Share your interests, preferred pace and travel dates to shape a personal itinerary. Accommodation, inclusions and pricing need to be confirmed in your proposal.",
  },
  {
    question: "How do I begin planning my trip?",
    answer:
      "Use the trip planner to put together your dates, group size and interests. You can download your brief and keep it for your planning conversation. You can also choose to share it through the available WhatsApp handoff; nothing is sent automatically.",
  },
  {
    question: "Are the displayed itineraries confirmed packages?",
    answer:
      "The itineraries are suggested journey outlines. Specific activities, transport, accommodation, availability and inclusions are agreed in the final proposal before booking.",
  },
  {
    question: "Can you accommodate dietary or accessibility needs?",
    answer:
      "Tell us about your requirements early in the planning process so that suitable accommodation, transport and experiences can be discussed. Individual arrangements must be confirmed before booking.",
  },
  {
    question: "Are train journeys guaranteed?",
    answer:
      "Train schedules and tickets are subject to availability. Confirm the proposed rail journey and any alternative arrangements with your planner before booking.",
  },
  {
    question: "Where can I find current entry requirements?",
    answer:
      "Entry and visa requirements can change. Check the current guidance from Sri Lanka’s official immigration authorities and your own government before travel. This website does not provide immigration advice.",
  },
  {
    question: "What does responsible travel mean for my journey?",
    answer:
      "Choose respectful wildlife observation, seek permission before photographing people, follow guidance at sacred places and favour local businesses. Your itinerary can make room for a slower, more considered way to explore.",
  },
];
