export const FALLBACK_EVENTS = [
  {
    slug: "annual-day",
    title: "Rhythmzz Annual Day",
    starts_at: "2026-12-20T18:00:00+05:30",
    venue: "Rhythmzz Academy, Neredmet X Road, Secunderabad",
    description:
      "Our yearly stage showcase — kids, adults, fitness, and Kuchipudi. RSVP so we can save seats for your family.",
    is_published: true,
  },
] as const;

export function fallbackEvent(slug: string) {
  return FALLBACK_EVENTS.find((e) => e.slug === slug) ?? null;
}
