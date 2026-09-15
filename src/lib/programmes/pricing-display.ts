/** Display metadata layered on programme rows from Supabase */
export const DROP_IN_FEE = 300;

export const PRICING_DISPLAY: Record<
  string,
  { shortLabel?: string; dropIn?: number | null; schedule?: string; tagline?: string }
> = {
  'kids-dance': {
    shortLabel: 'Kids',
    dropIn: DROP_IN_FEE,
    schedule: 'Mon–Wed · 5–7 PM',
    tagline: 'Bollywood · Hip hop · Contemporary · Ages 5+',
  },
  'adults-dance': {
    shortLabel: 'Adults',
    dropIn: DROP_IN_FEE,
    schedule: 'Mon–Wed · 7–9 PM',
    tagline: 'Bollywood · Hip hop · Choreography · Ages 16+',
  },
  'mind-body-fitness': {
    shortLabel: 'Fitness',
    dropIn: DROP_IN_FEE,
    schedule: 'Mon–Fri · 9:30 AM',
    tagline: 'Zumba · Yoga · Pilates · Morning batch',
  },
  kuchipudi: {
    shortLabel: 'Kuchipudi',
    dropIn: null,
    schedule: 'Fri–Sat · 6:30 PM',
    tagline: 'Level syllabus · Exams · Stage work',
  },
  'classical-dance': {
    shortLabel: 'Classical',
    dropIn: null,
    schedule: 'Fri–Sat · 6:30 PM',
    tagline: 'Kuchipudi · Structured certification',
  },
  'commercial-expressive': {
    shortLabel: 'Dance',
    dropIn: DROP_IN_FEE,
    schedule: 'Mon–Wed · 5–9 PM',
    tagline: 'Kids & adults · Bollywood · Hip hop',
  },
};

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function quarterlySavings(monthly: number, quarterly: number) {
  return Math.max(0, monthly * 3 - quarterly);
}

export function pricingMetaForSlug(slug: string, batchesInfo?: { schedule?: string }[]) {
  const meta = PRICING_DISPLAY[slug] ?? {};
  const schedule = meta.schedule ?? batchesInfo?.[0]?.schedule?.replace(/ to /gi, '–') ?? '';
  return { ...meta, schedule };
}
