interface StatsProps {
  stats: { key: string; value: string | any }[];
}

export function Stats({ stats }: StatsProps) {
  // Default values based on HTML reference
  const defaultStats = [
    { label: "Students Trained", value: "5000+" },
    { label: "Years Teaching", value: "15+" },
    { label: "Programmes", value: "4" },
    { label: "Awards", value: "3" },
  ];

  const displayStats = stats && stats.length > 0 
    ? defaultStats.map((ds, i) => {
        // Just keeping simple mapping for now since the keys are unknown
        return { label: ds.label, value: stats[i]?.value || ds.value };
      })
    : defaultStats;

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 bg-white border-b border-black/5">
      {displayStats.map((stat, i) => (
        <div key={i} className="text-center py-8 px-5 border-b md:border-b-0 border-r border-black/5 last:border-r-0 md:last:border-r-0 md:[&:nth-child(even)]:border-r">
          <div className="heading-display text-5xl text-bl mb-1">{stat.value}</div>
          <div className="text-[10px] tracking-[2px] uppercase text-mu mt-1">{stat.label}</div>
        </div>
      ))}
    </section>
  );
}
