'use client';

import { CountUp } from '@/components/motion/count-up';

const STAT_META: { key: string; label: string; fallback: string }[] = [
  { key: 'stats_students', label: 'Students trained', fallback: '5000+' },
  { key: 'stats_years', label: 'Years teaching', fallback: '15+' },
  { key: 'stats_programmes', label: 'Programmes', fallback: '4' },
  { key: 'stats_awards', label: 'Awards won', fallback: '3' },
];

export function HeroStats({ stats }: { stats: { key: string; value: string }[] }) {
  const valueByKey = (stats ?? []).reduce<Record<string, string>>((acc, s) => {
    if (s?.key) acc[s.key] = String(s.value ?? '');
    return acc;
  }, {});

  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 sm:gap-x-8">
      {STAT_META.map((stat) => (
        <div key={stat.key} className="min-w-0">
          <dt className="font-anton text-[clamp(1.75rem,5vw,2.75rem)] leading-none tracking-tight text-white">
            <CountUp value={valueByKey[stat.key] || stat.fallback} />
          </dt>
          <dd className="mt-2 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 leading-snug">
            {stat.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
