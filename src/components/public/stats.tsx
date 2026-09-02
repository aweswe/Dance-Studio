import { CountUp } from '@/components/motion/count-up';

interface StatsProps {
  stats: { key: string; value: string | any }[];
}

// Default values based on HTML reference, matched to site_content keys
const DEFAULT_STATS = [
  { key: 'stats_students', label: 'Students Trained', value: '5000+' },
  { key: 'stats_years', label: 'Years Teaching', value: '15+' },
  { key: 'stats_programmes', label: 'Programmes', value: '4' },
  { key: 'stats_awards', label: 'Awards', value: '3' },
];

export function Stats({ stats }: StatsProps) {
  const valueByKey = (stats ?? []).reduce<Record<string, string>>((acc, s) => {
    if (s?.key) acc[s.key] = String(s.value ?? '');
    return acc;
  }, {});

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 bg-canvas border-b border-line">
      {DEFAULT_STATS.map((stat, i) => (
        <div key={i} className="text-center py-6 sm:py-8 px-3 sm:px-5 border-b md:border-b-0 border-r border-line [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r md:last:border-r-0">
          <div className="heading-display text-3xl sm:text-4xl md:text-5xl text-bl mb-1 font-bold">
            <CountUp value={valueByKey[stat.key] || stat.value} />
          </div>
          <div className="text-[10px] sm:text-[11px] tracking-[1.5px] sm:tracking-[2px] uppercase text-ink-2 mt-1 font-semibold">{stat.label}</div>
        </div>
      ))}
    </section>
  );
}
