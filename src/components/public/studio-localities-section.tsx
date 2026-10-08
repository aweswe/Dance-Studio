import Link from 'next/link';
import { ArrowUpRight, MapPin, Navigation } from 'lucide-react';
import { HomepageSection } from '@/components/public/homepage-section';
import { homepageCtaBrand, homepageCtaPairButton } from '@/lib/ui/homepage-cta';
import { ROUTES } from '@/lib/utils/constants';

interface LocalityItem {
  name: string;
  driveTime: string;
  isImmediate?: boolean;
}

const LOCALITIES: LocalityItem[] = [
  { name: 'Sainikpuri', driveTime: '8–12 min by drive' },
  { name: 'AS Rao Nagar', driveTime: '10–14 min by drive' },
  { name: 'Yapral', driveTime: '12–15 min by drive' },
  { name: 'Neredmet', driveTime: 'Right at our door', isImmediate: true },
  { name: 'Malkajgiri', driveTime: '10–12 min by drive' },
  { name: 'Kapra', driveTime: '12–15 min by drive' },
];

export function StudioLocalitiesSection() {
  return (
    <HomepageSection id="localities" className="py-10 sm:py-12 md:py-14 border-t border-line/60">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl">
          Close to you
        </p>

        <h2 className="mt-2.5 font-anton text-2xl sm:text-3xl md:text-[2.35rem] uppercase tracking-tight leading-[1.05] text-ink">
          Dance Classes Near Sainikpuri, Neredmet, AS Rao Nagar &amp; Yapral
        </h2>

        <p className="mt-3.5 text-sm sm:text-[15px] text-ink-2 leading-relaxed max-w-2xl">
          Our studio at Neredmet X Road is 8–15 minutes from most of East Hyderabad by drive. Students
          come to us from Sainikpuri, AS Rao Nagar, Yapral, Malkajgiri, Kapra, and Hastinapuri every
          day.
        </p>
      </div>

      <div className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {LOCALITIES.map((loc) => (
          <div
            key={loc.name}
            className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-md border text-center transition-all duration-200 ${
              loc.isImmediate
                ? 'border-bl/50 bg-bl/[0.04] shadow-sm'
                : 'border-line bg-surface hover:border-ink/20 hover:bg-canvas-muted/50'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2.5 ${
                loc.isImmediate ? 'bg-bl text-blk' : 'bg-canvas-muted text-ink-2'
              }`}
            >
              {loc.isImmediate ? <Navigation size={14} /> : <MapPin size={14} />}
            </div>
            <h3 className="font-anton text-base sm:text-lg uppercase tracking-tight text-ink">
              {loc.name}
            </h3>
            <p
              className={`mt-1 text-[11px] font-medium leading-tight ${
                loc.isImmediate ? 'text-bl font-semibold' : 'text-ink-3'
              }`}
            >
              {loc.driveTime}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 sm:mt-10 flex justify-center">
        <Link
          href={ROUTES.enrol}
          className={`${homepageCtaBrand} ${homepageCtaPairButton}`}
        >
          Book free trial class
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </Link>
      </div>
    </HomepageSection>
  );
}
