// Reference marquee list — every style taught at the studio.
const STYLES = [
  'BOLLYWOOD',
  'HIP HOP',
  'CONTEMPORARY',
  'KUCHIPUDI',
  'ZUMBA',
  'YOGA',
  'PILATES',
  'HIIT',
  'STRENGTH TRAINING',
  'CORE CONDITIONING',
  'TABATA',
  'MOBILITY',
];

export function Marquee() {
  return (
    <div className="bg-bl overflow-hidden py-3 whitespace-nowrap">
      <div className="inline-flex gap-10 animate-marquee">
        {/* Repeat content to ensure continuous loop without JS. First copy is read by
            screen readers; the repeats are visual only. */}
        {[...Array(4)].map((_, i) => (
          <span key={i} aria-hidden={i > 0} className="inline-flex gap-10 items-center">
            {STYLES.map((style) => (
              <span key={style} className="inline-flex gap-10 items-center">
                <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold">{style}</span>
                <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold opacity-35">·</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
