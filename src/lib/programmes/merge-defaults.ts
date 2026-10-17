import { DEFAULT_PROGRAMMES, type ProgrammeItem } from '@/data/programmes';

/** Keep marketing copy from defaults when DB rows only have operational fields. */
export function mergeProgrammeWithDefaults(row: Record<string, unknown>): ProgrammeItem {
  const fallback = DEFAULT_PROGRAMMES.find((p) => p.slug === row.slug);
  const base = row as unknown as ProgrammeItem;
  if (!fallback) return base;

  let ageGroup = (row.age_group === '5' ? '5+' : (row.age_group as string | undefined)) ?? fallback.age_group;
  if (ageGroup && typeof ageGroup === 'string') {
    ageGroup = ageGroup.replace(/\b16\b/g, '13');
  }

  let desc = (row.description as string) || fallback.description;
  if (desc && typeof desc === 'string') {
    desc = desc.replace(/aged 16/gi, 'aged 13').replace(/\b16\+/g, '13+');
  }

  return {
    ...fallback,
    ...base,
    tagline: (row.tagline as string | undefined) ?? fallback.tagline,
    badge: (row.badge as string | undefined) ?? fallback.badge,
    styles_highlight: (row.styles_highlight as string[] | undefined) ?? fallback.styles_highlight,
    batches_info: (row.batches_info as ProgrammeItem['batches_info']) ?? fallback.batches_info,
    description: desc,
    age_group: ageGroup,
    includes: (row.includes as string[] | undefined)?.length
      ? (row.includes as string[])
      : fallback.includes,
  };
}
