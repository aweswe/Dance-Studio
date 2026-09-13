'use client';

const TICKER_ITEMS = [
  { text: 'URBAN CHOREOGRAPHY', highlight: true },
  { text: 'KUCHIPUDI CLASSICAL', highlight: false },
  { text: 'TOP SKILLS PRO INTENSIVE', highlight: true },
  { text: 'ACROBATIC & CONTEMPORARY', highlight: false },
  { text: 'STAGE PRODUCTIONS', highlight: true },
  { text: 'GOVERNMENT AFFILIATED DIPLOMA', highlight: false },
  { text: 'BOLLY-HOP COMMERCIAL', highlight: true },
  { text: 'EST. 2010 · SECUNDERABAD', highlight: false },
];

export function Marquee() {
  return (
    <div className="relative w-full bg-[#000000] border-y border-white/15 py-4 sm:py-5 overflow-hidden select-none">
      <div className="flex w-max animate-marquee">
        {/* Render 3 repetitions for seamless loop */}
        {[...Array(3)].map((_, repIdx) => (
          <div key={repIdx} className="flex items-center gap-8 sm:gap-12 shrink-0 pr-8 sm:pr-12">
            {TICKER_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-8 sm:gap-12">
                <span
                  className={`font-anton text-lg sm:text-2xl md:text-3xl tracking-wider uppercase ${
                    item.highlight ? 'text-[#F5FB38]' : 'text-[#FAF6EE]'
                  }`}
                >
                  {item.text}
                </span>
                <span className="text-[#7C5CFC] text-sm sm:text-base select-none">
                  ★
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
