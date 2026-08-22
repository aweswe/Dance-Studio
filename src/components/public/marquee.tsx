export function Marquee() {
  return (
    <div className="bg-bl overflow-hidden py-3 whitespace-nowrap">
      <div className="inline-flex gap-10 animate-marquee">
        {/* Repeat content to ensure continuous loop without JS */}
        {[...Array(4)].map((_, i) => (
          <span key={i} className="inline-flex gap-10 items-center">
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold">BOLLYWOOD</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold opacity-35">·</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold">HIP HOP</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold opacity-35">·</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold">CONTEMPORARY</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold opacity-35">·</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold">ZUMBA</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold opacity-35">·</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold">YOGA</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold opacity-35">·</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold">KUCHIPUDI</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold opacity-35">·</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold">PILATES</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold opacity-35">·</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold">HIIT</span>
            <span className="text-[10px] tracking-[4px] uppercase text-white font-semibold opacity-35">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
