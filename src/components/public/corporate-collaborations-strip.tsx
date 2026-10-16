import { HomepageSection } from '@/components/public/homepage-section';

function AmazonLogo() {
  return (
    <svg viewBox="0 0 72 22" className="h-4 sm:h-4.5 w-auto fill-current" aria-label="Amazon">
      <path d="M38.8 14.8c-3.1 2.3-7.5 3.6-11.4 3.6-5.4 0-10.4-2-14.1-5.3-.3-.3 0-.7.3-.4 4 2.3 8.9 3.8 14 3.8 3.5 0 7.3-.8 10.7-2.6.5-.3 1 .3.5.9zm1.7-1.3c-.4-.5-2.6-.2-3.6-.1-.3.1-.3-.2-.1-.4 1.4-1 3.7-1.2 4.4-.3.7.9.3 3.1-1.1 4.2-.3.3-.6.1-.4-.3.7-.8 1.2-2.7.8-3.1zM20.6 6.1v7.1c0 1 .5 1.4 1.3 1.4.7 0 1.3-.4 1.7-1v-7.5h2.3v8.7h-2.2v-1.2c-.7.8-1.7 1.3-2.9 1.3-1.8 0-2.8-1.2-2.8-3V6.1h2.6zm7.9 4.2c0-1.5.7-2.4 2-2.4.9 0 1.6.5 1.9 1.2v2.6c-.4.7-1.1 1.1-1.9 1.1-1.3 0-2-.9-2-2.5zm6.3-4.2v1.2c-.7-.8-1.7-1.3-2.9-1.3-2.2 0-3.9 1.7-3.9 4.3s1.7 4.3 3.9 4.3c1.2 0 2.2-.5 2.9-1.3v1.2h2.3V6.1h-2.3zM3.7 7.3L1.5 14.8h2.4l.4-1.5h2.8l.4 1.5h2.4L7.6 7.3H3.7zm1 4.6l.9-3.5.9 3.5H4.7z" />
    </svg>
  );
}

function AirtelLogo() {
  return (
    <svg viewBox="0 0 68 20" className="h-4 sm:h-4.5 w-auto fill-current" aria-label="Airtel">
      <path d="M9.5 2C5 2 1.3 5.7 1.3 10.2S5 18.5 9.5 18.5c3.4 0 6.4-2.1 7.6-5.2l-2.9-1.2c-.8 2-2.8 3.5-4.7 3.5-3 0-5.4-2.5-5.4-5.5s2.5-5.5 5.4-5.5c2 0 3.7 1.1 4.6 2.7l2.9-1.4C15.5 3.5 12.7 2 9.5 2z" />
      <circle cx="9.5" cy="10.2" r="2.6" />
      <text x="21" y="14" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" letterSpacing="-0.3px">airtel</text>
    </svg>
  );
}

function SonyLogo() {
  return (
    <svg viewBox="0 0 64 16" className="h-3 sm:h-3.5 w-auto fill-current" aria-label="Sony TV">
      <text x="0" y="14" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="16" letterSpacing="2.5px">SONY</text>
      <text x="50" y="9" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="8" letterSpacing="0.5px">TV</text>
    </svg>
  );
}

function VodafoneLogo() {
  return (
    <svg viewBox="0 0 85 20" className="h-4 sm:h-4.5 w-auto fill-current" aria-label="Vodafone">
      <circle cx="9" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 4.5c-2.2 0-4 1.8-4 4 0 2.8 4 6.3 4 6.3s4-3.5 4-6.3c0-2.2-1.8-4-4-4zm0 5.3c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3z" />
      <text x="21" y="14" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="12" letterSpacing="-0.2px">vodafone</text>
    </svg>
  );
}

function WiproLogo() {
  return (
    <svg viewBox="0 0 68 20" className="h-4 sm:h-4.5 w-auto fill-current" aria-label="Wipro">
      <g transform="translate(0, 3)">
        <circle cx="3" cy="7" r="1.8" />
        <circle cx="8" cy="3" r="1.5" />
        <circle cx="8" cy="11" r="1.5" />
        <circle cx="13" cy="7" r="2.2" />
      </g>
      <text x="18" y="14" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="13" letterSpacing="0.5px">wipro</text>
    </svg>
  );
}

function TataLogo() {
  return (
    <svg viewBox="0 0 72 20" className="h-4 sm:h-4.5 w-auto fill-current" aria-label="Tata Sky">
      <ellipse cx="8" cy="10" rx="7" ry="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 7h7M8 7v6.5M5.5 13.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <text x="18" y="14" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="12" letterSpacing="1px">TATA</text>
      <text x="52" y="14" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="8.5" letterSpacing="0.5px">SKY</text>
    </svg>
  );
}

function WizcraftLogo() {
  return (
    <svg viewBox="0 0 85 20" className="h-4 sm:h-4.5 w-auto fill-current" aria-label="Wizcraft">
      <path d="M7 2.5l1.5 3.8 4.1.6-3 2.9.7 4-3.3-2-3.3 2 .7-4-3-2.9 4.1-.6z" />
      <text x="17" y="14" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="11" letterSpacing="0.8px">WIZCRAFT</text>
    </svg>
  );
}

function BniLogo() {
  return (
    <svg viewBox="0 0 52 20" className="h-4 sm:h-4.5 w-auto fill-current" aria-label="BNI India">
      <text x="0" y="15" fontFamily="Georgia, serif" fontWeight="900" fontSize="16" letterSpacing="1px">BNI</text>
      <circle cx="42" cy="12.5" r="2.5" />
    </svg>
  );
}

function BharatBiotechLogo() {
  return (
    <svg viewBox="0 0 108 20" className="h-4 sm:h-4.5 w-auto fill-current" aria-label="Bharat Biotech">
      <path d="M3 10c2-5 6-5 8 0s6 5 8 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <text x="22" y="14" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="9.5" letterSpacing="0.5px">BHARAT BIOTECH</text>
    </svg>
  );
}

function IntellectLogo() {
  return (
    <svg viewBox="0 0 80 20" className="h-4 sm:h-4.5 w-auto fill-current" aria-label="Intellect Tech">
      <rect x="1" y="4" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="10" r="2" />
      <text x="17" y="14" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="11" letterSpacing="0.4px">intellect</text>
    </svg>
  );
}

function IaoLogo() {
  return (
    <svg viewBox="0 0 82 20" className="h-4 sm:h-4.5 w-auto fill-current" aria-label="IAO USA">
      <circle cx="8" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="4.8" y="12.8" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="7.5">IAO</text>
      <text x="18" y="14" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="10.5" letterSpacing="0.8px">ACCREDITED</text>
    </svg>
  );
}

interface PartnerItem {
  id: string;
  name: string;
  logo: () => React.JSX.Element;
  tag: string;
}

const PARTNERS: PartnerItem[] = [
  { id: 'airtel', name: 'Airtel', logo: AirtelLogo, tag: '4G Launch' },
  { id: 'amazon', name: 'Amazon', logo: AmazonLogo, tag: 'Workshops' },
  { id: 'sonytv', name: 'Sony TV', logo: SonyLogo, tag: 'IPL Production' },
  { id: 'vodafone', name: 'Vodafone', logo: VodafoneLogo, tag: 'Flash Mobs' },
  { id: 'wipro', name: 'Wipro', logo: WiproLogo, tag: 'Corporate Sessions' },
  { id: 'tatasky', name: 'Tata Sky', logo: TataLogo, tag: 'Fitness TV' },
  { id: 'wizcraft', name: 'Wizcraft', logo: WizcraftLogo, tag: 'Stage Events' },
  { id: 'bharatbiotech', name: 'Bharat Biotech', logo: BharatBiotechLogo, tag: 'Annual Gala' },
  { id: 'intellect', name: 'Intellect', logo: IntellectLogo, tag: 'Team Building' },
  { id: 'bni', name: 'BNI India', logo: BniLogo, tag: 'Conclaves' },
  { id: 'iao', name: 'IAO USA', logo: IaoLogo, tag: 'Accreditation' },
];

export function CorporateCollaborationsStrip() {
  return (
    <HomepageSection
      id="collaborations"
      ariaLabel="Brand collaborations and corporate productions"
      className="py-5 sm:py-6 border-t border-line/60"
    >
      <div className="rounded-md border border-line bg-surface/70 p-3.5 sm:p-4.5 shadow-2xs">
        {/* Compact Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-bl" />
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-ink">
              Brand Collaborations &amp; Productions
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-ink-3 font-medium">
            Trusted for nationwide product launches, TV broadcasts &amp; corporate wellness
          </p>
        </div>

        {/* Bounded Marquee with Left & Right Gradient Fades */}
        <div className="relative w-full overflow-hidden select-none py-1">
          {/* Gradient Fades matching card surface */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-surface via-surface/90 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-surface via-surface/90 to-transparent z-10" />

          {/* Marquee Track */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] [animation-duration:28s]">
            {[0, 1].map((setIdx) => (
              <div key={setIdx} className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 pr-2.5 sm:pr-3.5">
                {PARTNERS.map((partner) => {
                  const Logo = partner.logo;
                  return (
                    <div
                      key={`${setIdx}-${partner.id}`}
                      className="flex items-center gap-2 sm:gap-2.5 h-9 sm:h-10 px-3 sm:px-3.5 rounded border border-line bg-canvas/70 hover:bg-canvas hover:border-bl/40 transition-colors text-ink-2 hover:text-ink shrink-0 group cursor-default"
                      title={`${partner.name} · ${partner.tag}`}
                    >
                      <div className="text-ink/80 group-hover:text-ink transition-colors shrink-0">
                        <Logo />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-ink-3 group-hover:text-bl font-semibold border-l border-line/80 pl-2 shrink-0 transition-colors">
                        {partner.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </HomepageSection>
  );
}
