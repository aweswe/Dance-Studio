import { HomepageSection } from '@/components/public/homepage-section';

function AmazonLogo() {
  return (
    <svg viewBox="0 0 72 22" className="h-4 sm:h-4.5 w-auto shrink-0" aria-label="Amazon">
      {/* Amazon wordmark in dark charcoal */}
      <path
        fill="#111827"
        d="M20.6 6.1v7.1c0 1 .5 1.4 1.3 1.4.7 0 1.3-.4 1.7-1v-7.5h2.3v8.7h-2.2v-1.2c-.7.8-1.7 1.3-2.9 1.3-1.8 0-2.8-1.2-2.8-3V6.1h2.6zm7.9 4.2c0-1.5.7-2.4 2-2.4.9 0 1.6.5 1.9 1.2v2.6c-.4.7-1.1 1.1-1.9 1.1-1.3 0-2-.9-2-2.5zm6.3-4.2v1.2c-.7-.8-1.7-1.3-2.9-1.3-2.2 0-3.9 1.7-3.9 4.3s1.7 4.3 3.9 4.3c1.2 0 2.2-.5 2.9-1.3v1.2h2.3V6.1h-2.3zM3.7 7.3L1.5 14.8h2.4l.4-1.5h2.8l.4 1.5h2.4L7.6 7.3H3.7zm1 4.6l.9-3.5.9 3.5H4.7z"
      />
      {/* Amazon smile arrow in official vibrant orange */}
      <path
        fill="#FF9900"
        d="M38.8 14.8c-3.1 2.3-7.5 3.6-11.4 3.6-5.4 0-10.4-2-14.1-5.3-.3-.3 0-.7.3-.4 4 2.3 8.9 3.8 14 3.8 3.5 0 7.3-.8 10.7-2.6.5-.3 1 .3.5.9zm1.7-1.3c-.4-.5-2.6-.2-3.6-.1-.3.1-.3-.2-.1-.4 1.4-1 3.7-1.2 4.4-.3.7.9.3 3.1-1.1 4.2-.3.3-.6.1-.4-.3.7-.8 1.2-2.7.8-3.1z"
      />
    </svg>
  );
}

function AirtelLogo() {
  return (
    <svg viewBox="0 0 68 20" className="h-4 sm:h-4.5 w-auto shrink-0" aria-label="Airtel">
      <path
        fill="#ED1B24"
        d="M9.5 2C5 2 1.3 5.7 1.3 10.2S5 18.5 9.5 18.5c3.4 0 6.4-2.1 7.6-5.2l-2.9-1.2c-.8 2-2.8 3.5-4.7 3.5-3 0-5.4-2.5-5.4-5.5s2.5-5.5 5.4-5.5c2 0 3.7 1.1 4.6 2.7l2.9-1.4C15.5 3.5 12.7 2 9.5 2z"
      />
      <circle cx="9.5" cy="10.2" r="2.6" fill="#ED1B24" />
      <text x="21" y="14" fill="#ED1B24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" letterSpacing="-0.3px">
        airtel
      </text>
    </svg>
  );
}

function SonyLogo() {
  return (
    <svg viewBox="0 0 68 18" className="h-3.5 sm:h-4 w-auto shrink-0" aria-label="Sony TV">
      <text x="0" y="14" fill="#0F172A" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="16" letterSpacing="1.8px">
        SONY
      </text>
      <rect x="50" y="2" width="16" height="13" rx="2" fill="#0070D1" />
      <text x="53" y="12" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="8.5">
        TV
      </text>
    </svg>
  );
}

function VodafoneLogo() {
  return (
    <svg viewBox="0 0 88 20" className="h-4 sm:h-4.5 w-auto shrink-0" aria-label="Vodafone">
      <circle cx="9" cy="10" r="8.5" fill="#E60000" />
      <path
        fill="#FFFFFF"
        d="M9 5c-2 0-3.6 1.6-3.6 3.6 0 2.5 3.6 5.6 3.6 5.6s3.6-3.1 3.6-5.6c0-2-1.6-3.6-3.6-3.6zm0 4.8c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2z"
      />
      <text x="22" y="14" fill="#E60000" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="12" letterSpacing="-0.2px">
        vodafone
      </text>
    </svg>
  );
}

function WiproLogo() {
  return (
    <svg viewBox="0 0 68 20" className="h-4 sm:h-4.5 w-auto shrink-0" aria-label="Wipro">
      <g transform="translate(0, 3)">
        <circle cx="3" cy="7" r="2" fill="#00A389" />
        <circle cx="8" cy="2.5" r="1.8" fill="#0090DF" />
        <circle cx="8" cy="11.5" r="1.8" fill="#7E3BD0" />
        <circle cx="13" cy="7" r="2.2" fill="#FF8300" />
      </g>
      <text x="18" y="14" fill="#1F2937" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="13" letterSpacing="0.5px">
        wipro
      </text>
    </svg>
  );
}

function TataLogo() {
  return (
    <svg viewBox="0 0 74 20" className="h-4 sm:h-4.5 w-auto shrink-0" aria-label="Tata Sky">
      <ellipse cx="8" cy="10" rx="7" ry="7" fill="none" stroke="#005696" strokeWidth="1.8" />
      <path d="M4.5 7h7M8 7v6.5M5.5 13.5h5" stroke="#005696" strokeWidth="1.4" strokeLinecap="round" />
      <text x="18" y="14" fill="#005696" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="12" letterSpacing="1px">
        TATA
      </text>
      <text x="52" y="14" fill="#E6007E" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.5px">
        SKY
      </text>
    </svg>
  );
}

function WizcraftLogo() {
  return (
    <svg viewBox="0 0 85 20" className="h-4 sm:h-4.5 w-auto shrink-0" aria-label="Wizcraft">
      <path
        fill="#F59E0B"
        d="M7 2.5l1.5 3.8 4.1.6-3 2.9.7 4-3.3-2-3.3 2 .7-4-3-2.9 4.1-.6z"
      />
      <text x="17" y="14" fill="#DC2626" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="11" letterSpacing="0.8px">
        WIZCRAFT
      </text>
    </svg>
  );
}

function BniLogo() {
  return (
    <svg viewBox="0 0 52 20" className="h-4 sm:h-4.5 w-auto shrink-0" aria-label="BNI India">
      <text x="0" y="15" fill="#C8102E" fontFamily="Georgia, serif" fontWeight="900" fontSize="16" letterSpacing="1px">
        BNI
      </text>
      <circle cx="42" cy="12.5" r="2.5" fill="#C8102E" />
    </svg>
  );
}

function BharatBiotechLogo() {
  return (
    <svg viewBox="0 0 112 20" className="h-4 sm:h-4.5 w-auto shrink-0" aria-label="Bharat Biotech">
      <path d="M3 10c2-5 6-5 8 0s6 5 8 0" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
      <text x="23" y="14" fill="#0F766E" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="9.5" letterSpacing="0.5px">
        BHARAT BIOTECH
      </text>
    </svg>
  );
}

function IntellectLogo() {
  return (
    <svg viewBox="0 0 82 20" className="h-4 sm:h-4.5 w-auto shrink-0" aria-label="Intellect Tech">
      <rect x="1" y="4" width="12" height="12" rx="2.5" fill="#0052CC" />
      <circle cx="7" cy="10" r="2.5" fill="#FFFFFF" />
      <text x="17" y="14" fill="#0052CC" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="11" letterSpacing="0.4px">
        intellect
      </text>
    </svg>
  );
}

function IaoLogo() {
  return (
    <svg viewBox="0 0 82 20" className="h-4 sm:h-4.5 w-auto shrink-0" aria-label="IAO USA">
      <circle cx="8" cy="10" r="7.5" fill="#B45309" />
      <text x="4.8" y="12.8" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="7">
        IAO
      </text>
      <text x="19" y="14" fill="#1E3A8A" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="10.5" letterSpacing="0.8px">
        ACCREDITED
      </text>
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
                      className="flex items-center gap-2 sm:gap-2.5 h-9 sm:h-10 px-3 sm:px-3.5 rounded-md border border-line bg-canvas hover:border-bl/40 hover:shadow-xs transition-all shrink-0 cursor-default"
                      title={`${partner.name} · ${partner.tag}`}
                    >
                      <div className="shrink-0 flex items-center">
                        <Logo />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-ink-3 font-semibold border-l border-line/80 pl-2 shrink-0">
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
