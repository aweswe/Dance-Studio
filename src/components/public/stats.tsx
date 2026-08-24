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
    <section className="grid grid-cols-2 md:grid-cols-4 bg-white border-b border-black/5">
      {DEFAULT_STATS.map((stat, i) => (
        <div key={i} className="text-center py-8 px-5 border-b md:border-b-0 border-r border-black/5 last:border-r-0 md:last:border-r-0 md:[&:nth-child(even)]:border-r">
          <div className="heading-display text-5xl text-bl mb-1">
            <CountUp value={valueByKey[stat.key] || stat.value} />
          </div>
          <div className="text-[10px] tracking-[2px] uppercase text-mu mt-1">{stat.label}</div>
        </div>
      ))}
    </section>
  );
}
