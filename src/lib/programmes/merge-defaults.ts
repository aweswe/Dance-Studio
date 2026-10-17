import { DEFAULT_PROGRAMMES, type ProgrammeItem } from '@/data/programmes';

/** Keep marketing copy from defaults when DB rows only have operational fields. */
export function mergeProgrammeWithDefaults(row: Record<string, unknown>): ProgrammeItem {
  const fallback = DEFAULT_PROGRAMMES.find((p) => p.slug === row.slug);
  const base = row as unknown as ProgrammeItem;
  if (!fallback) return base;

  return {
    ...fallback,
    ...base,
    tagline: (row.tagline as string | undefined) ?? fallback.tagline,
    badge: (row.badge as string | undefined) ?? fallback.badge,
    styles_highlight: (row.styles_highlight as string[] | undefined) ?? fallback.styles_highlight,
    batches_info: (row.batches_info as ProgrammeItem['batches_info']) ?? fallback.batches_info,
    description: (row.description as string) || fallback.description,
    age_group: (row.age_group === '5' ? '5+' : (row.age_group as string | undefined)) ?? fallback.age_group,
    includes: (row.includes as string[] | undefined)?.length
      ? (row.includes as string[])
      : fallback.includes,
  };
}
