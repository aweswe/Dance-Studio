/** Curated Google review snippets — swap via site_content later if needed */
export const GOOGLE_REVIEW_SNIPPETS = [
  {
    author: 'Priya M.',
    text: 'Best dance studio in Secunderabad. My daughter loves the kids batch.',
    tag: 'Kids Dance',
  },
  {
    author: 'Rahul K.',
    text: 'Nitish sir’s energy is unmatched. Hip-hop classes are structured and fun.',
    tag: 'Adults Dance',
  },
  {
    author: 'Anitha R.',
    text: 'Free trial with zero pressure. Enrolled the same week.',
    tag: 'New student',
  },
  {
    author: 'Suresh & Deepa',
    text: 'Shy kid to stage leader in one year. Worth the drive from Sainikpuri.',
    tag: 'Parents',
  },
  {
    author: 'Meera V.',
    text: 'Kuchipudi training is rigorous and traditional. Srusti ma’am is excellent.',
    tag: 'Kuchipudi',
  },
  {
    author: 'Arjun P.',
    text: 'Clean studio, flexible batches, and real stage opportunities.',
    tag: 'Adults Dance',
  },
  {
    author: 'Kavitha S.',
    text: 'Zumba and fitness batches fit my morning schedule perfectly.',
    tag: 'Fitness',
  },
  {
    author: 'Divya N.',
    text: '480 reviews don’t lie — this place feels like family from day one.',
    tag: 'Studio vibe',
  },
] as const;

/** Estimated distribution for 4.9 average (display only) */
export const GOOGLE_STAR_DISTRIBUTION = [
  { stars: 5, pct: 92 },
  { stars: 4, pct: 5 },
  { stars: 3, pct: 2 },
  { stars: 2, pct: 0 },
  { stars: 1, pct: 1 },
] as const;
