export const brand = {
  name: "Majestic Sri Lanka",
  tagline: "Authentic journeys. Meaningful experiences.",
  proposedEmail: "info@majesticsrilanka.com",
  proposedDomain: "majesticsrilanka.com",
  email:
    import.meta.env.PUBLIC_CONTACTS_CONFIRMED === "true"
      ? import.meta.env.PUBLIC_CONTACT_EMAIL || ""
      : "",
  whatsapp:
    import.meta.env.PUBLIC_CONTACTS_CONFIRMED === "true"
      ? (import.meta.env.PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "")
      : "",
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Tours", href: "/tours/" },
  { label: "Tailor-Made", href: "/tailor-made/" },
  { label: "Experiences", href: "/experiences/" },
  { label: "About Us", href: "/about-us/" },
];

export const tours = [
  {
    id: "cultural-triangle",
    title: "Cultural Triangle Highlights",
    days: 7,
    image: "cultural-triangle",
    category: "Culture",
    alt: "Sigiriya rock fortress above a misty green jungle at sunrise",
    description:
      "Ancient cities, iconic landmarks and authentic local experiences.",
    route: "Sigiriya · Dambulla · Kandy",
    itinerary: [
      [
        "Arrival & a gentle beginning",
        "Settle into the island rhythm and leave time to rest after your flight.",
      ],
      [
        "The Cultural Triangle",
        "Explore Sigiriya and the surrounding landscape, with time for ancient cities and local encounters.",
      ],
      [
        "Dambulla & the road to Kandy",
        "Discover heritage, village life and a scenic journey towards the hills.",
      ],
      [
        "Kandy & your onward journey",
        "Enjoy a slower final day before your onward transfer.",
      ],
    ],
  },
  {
    id: "hill-country",
    title: "Hill Country Explorer",
    days: 8,
    image: "blue-train",
    category: "Nature",
    alt: "A blue passenger train crossing a stone viaduct among Sri Lankan green hills",
    description:
      "Scenic rail journeys, tea plantations and cool mountain landscapes.",
    route: "Kandy · Tea Country · Ella",
    itinerary: [
      [
        "An introduction to Kandy",
        "Begin with lakeside walks and the cultural character of the hill capital.",
      ],
      [
        "Into tea country",
        "Follow winding roads into green hills and make time to learn about tea.",
      ],
      [
        "The scenic railway",
        "Plan a railway journey through mountain landscapes, subject to tickets and schedules.",
      ],
      [
        "Ella at your own pace",
        "Enjoy viewpoints, gentle walks and unhurried mornings before your onward transfer.",
      ],
    ],
  },
  {
    id: "southern-coast",
    title: "Southern Coast Escape",
    days: 9,
    image: "southern-coast",
    category: "Coast",
    alt: "Coconut palms above a southern Sri Lankan beach at golden sunset",
    description: "Beautiful beaches, coastal towns and relaxed island life.",
    route: "Galle · South Coast · Coastal Villages",
    itinerary: [
      [
        "A warm coastal welcome",
        "Ease into your journey with time by the ocean.",
      ],
      [
        "Galle & its surroundings",
        "Discover the streets, architecture and everyday life of the southern coast.",
      ],
      [
        "Slow days by the sea",
        "Balance beach time with food, local encounters and optional excursions.",
      ],
      [
        "One last island morning",
        "Enjoy a relaxed finish before your onward transfer.",
      ],
    ],
  },
];

export const experiences = [
  {
    id: "wildlife",
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
    title: "Food & Cuisine",
    image: "sri-lankan-food",
    icon: "food",
    description:
      "Fragrant spices, colourful curries and a deeper connection to the island through its food.",
    detail:
      "Share your dietary needs before planning. Food-focused experiences can be shaped around markets, local dishes and cooking traditions.",
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
      "Use the trip planner to put together your dates, group size and interests. You can download your brief and keep it for your planning conversation. Enquiry delivery becomes available when the business contact details are confirmed.",
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
