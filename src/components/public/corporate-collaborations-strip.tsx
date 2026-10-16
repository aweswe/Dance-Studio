import { Building2, Sparkles, Tv, Radio, Film, Award } from 'lucide-react';

interface CorporatePartner {
  name: string;
  scope: string;
  tag: string;
  iconType: 'tech' | 'media' | 'telecom' | 'corp' | 'event' | 'edu';
}

const CORPORATE_PARTNERS: CorporatePartner[] = [
  { name: 'Amazon', scope: 'Corporate Wellness & Dance Workshops', tag: 'Enterprise Tech', iconType: 'tech' },
  { name: 'Airtel', scope: 'Official 4G Launch Choreography & Flash Mobs', tag: 'Nationwide Launch', iconType: 'telecom' },
  { name: 'Sony Entertainment TV', scope: 'IPL & Sunrisers Hyderabad Production', tag: 'National Broadcast', iconType: 'media' },
  { name: 'Vodafone', scope: 'Brand Activation & Commercial Flash Mobs', tag: 'Telecom Giant', iconType: 'telecom' },
  { name: 'Wipro', scope: 'Employee Engagement & Fitness Dance Sessions', tag: 'Global IT', iconType: 'tech' },
  { name: 'Tata Sky', scope: 'Active Fitness Dance TV Segments', tag: 'DTH Media', iconType: 'media' },
  { name: 'Intellect Tech', scope: 'Leadership Team Building & Choreography', tag: 'Enterprise Tech', iconType: 'tech' },
  { name: 'Bharat Biotech', scope: 'Annual Cultural Gala & Stage Showcases', tag: 'Biotechnology', iconType: 'corp' },
  { name: 'Wizcraft India', scope: 'Live Stage Productions & Mega Events', tag: 'Event Management', iconType: 'event' },
  { name: 'BNI India', scope: 'Business Conclave Cultural Highlights', tag: 'Global Network', iconType: 'corp' },
  { name: "Bhavan's Vivekananda College", scope: 'Campus Performing Arts Mentorship', tag: 'Academia', iconType: 'edu' },
  { name: 'Loyola Degree College', scope: 'Inter-College Fest Choreography', tag: 'Academia', iconType: 'edu' },
];

function PartnerIcon({ type }: { type: CorporatePartner['iconType'] }) {
  switch (type) {
    case 'media':
      return <Tv size={14} className="text-bl shrink-0" />;
    case 'telecom':
      return <Radio size={14} className="text-bl shrink-0" />;
    case 'event':
      return <Film size={14} className="text-bl shrink-0" />;
    case 'tech':
      return <Sparkles size={14} className="text-bl shrink-0" />;
    case 'edu':
      return <Award size={14} className="text-bl shrink-0" />;
    default:
      return <Building2 size={14} className="text-bl shrink-0" />;
  }
}

export function CorporateCollaborationsStrip() {
  return (
    <section
      aria-label="Corporate collaborations and brand partners"
      className="relative py-12 sm:py-16 border-t border-line/60 bg-canvas overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-14 mb-8 sm:mb-10 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl">
          TRUSTED SINCE 2010 · 200+ STAGE SHOWS
        </p>
        <h2 className="mt-2.5 font-anton text-2xl sm:text-3xl md:text-[2.35rem] uppercase tracking-tight leading-[1.05] text-ink">
          Brands &amp; Collaborations That Trust Rhythmzz
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-ink-2 max-w-2xl mx-auto leading-relaxed">
          From nationwide product launches (Airtel 4G) and IPL television broadcasts (Sony TV / Sunrisers Hyderabad) to corporate fitness workshops, India&apos;s leading enterprises choose our choreography.
        </p>
      </div>

      {/* Infinite Marquee Strip */}
      <div className="relative w-full overflow-hidden select-none">
        {/* Left & Right Gradient Shadows */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-canvas to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-canvas to-transparent z-10" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] [animation-duration:35s]">
          {/* Repeat 2 times for continuous infinite loop */}
          {[0, 1].map((setIdx) => (
            <div key={setIdx} className="flex items-center gap-4 sm:gap-6 shrink-0 pr-4 sm:pr-6">
              {CORPORATE_PARTNERS.map((partner) => (
                <div
                  key={`${setIdx}-${partner.name}`}
                  className="flex flex-col justify-between w-[260px] sm:w-[290px] h-[105px] p-4 rounded-md border-2 border-line bg-surface hover:border-bl/40 hover:bg-canvas-muted/40 transition-all duration-200 shadow-2xs group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-anton text-base sm:text-lg uppercase tracking-tight text-ink group-hover:text-bl transition-colors truncate">
                      {partner.name}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-canvas-muted text-ink-3 border border-line shrink-0">
                      {partner.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-line/60">
                    <PartnerIcon type={partner.iconType} />
                    <p className="text-[11px] text-ink-2 font-medium line-clamp-1 leading-snug">
                      {partner.scope}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
