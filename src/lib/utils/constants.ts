/** Academy contact information */
export const ACADEMY = {
  name: "Rhythmzz Academy of Dance",
  phone: "+919052980859",
  phoneDisplay: "+91 90529 80859",
  email: "rhythmzzdance@gmail.com",
  address: {
    street: "Plot 597, 3rd Floor, Above ICICI ATM",
    landmark: "Neredmet X Road Bus Stop",
    city: "Secunderabad",
    state: "Telangana",
    pin: "500094",
    full: "Plot 597, 3rd Floor, Above ICICI ATM, Neredmet X Road Bus Stop, Secunderabad, Telangana 500094",
  },
  coordinates: {
    lat: 17.4431,
    lng: 78.5032,
  },
  socials: {
    instagram: "https://www.instagram.com/rhythmzzdance.live",
    facebook: "https://www.facebook.com/rhythmzzdance",
  },
  whatsapp: "https://wa.me/919052980859",
  mapLink: "https://maps.google.com/?q=Rhythmzz+Academy+of+Dance+Neredmet+Secunderabad",
  foundingYear: 2013,
  teachingSince: 2010,
} as const;

/** Studio rental pricing */
export const RENTAL = {
  weekdayPerHour: 1000,
  weekendPerHour: 1500,
} as const;

/** Operating hours */
export const HOURS = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  opens: "06:00",
  closes: "21:00",
} as const;

/** Route paths */
export const ROUTES = {
  home: "/",
  programmes: "/programmes",
  programme: (slug: string) => `/programmes/${slug}`,
  enrol: "/enrol",
  studioRental: "/studio-rental",
  gallery: "/gallery",
  about: "/about",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  contact: "/contact",
  // Auth
  login: "/login",
  adminLogin: "/admin-login",
  // Dashboards
  student: "/student",
  instructor: "/instructor",
  admin: "/admin",
} as const;

/** Areas served — for SEO and marketing copy */
export const AREAS_SERVED = [
  "Neredmet",
  "Sainikpuri",
  "AS Rao Nagar",
  "Yapral",
  "Malkajgiri",
  "Kapra",
  "Hastinapuri",
] as const;

/** Programme color themes */
export const PROGRAMME_THEMES = {
  "kids-dance": {
    badge: "bg-green/15 text-green",
    card: "card-kids",
    chip: "fee-chip-green",
    accent: "bg-green",
    button: "bg-green text-white hover:bg-green/90",
    checkmark: "text-green",
  },
  "adults-dance": {
    badge: "bg-gold/15 text-gold",
    card: "card-dance",
    chip: "fee-chip-gold",
    accent: "bg-gold",
    button: "bg-gold text-black hover:bg-gold/90",
    checkmark: "text-gold",
  },
  "mind-body-fitness": {
    badge: "bg-bl/15 text-bl",
    card: "card-fitness",
    chip: "fee-chip-blue",
    accent: "bg-bl",
    button: "bg-bl text-white hover:bg-bl/90",
    checkmark: "text-bl",
  },
  kuchipudi: {
    badge: "bg-purp/15 text-purp",
    card: "card-kuchipudi",
    chip: "fee-chip-purple",
    accent: "bg-purp",
    button: "bg-purp text-white hover:bg-purp/90",
    checkmark: "text-purp",
  },
} as const;
