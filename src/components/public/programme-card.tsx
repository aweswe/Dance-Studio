import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { ROUTES, PROGRAMME_THEMES } from '@/lib/utils/constants';
import { formatCurrency } from '@/lib/utils/format';
import { SpotlightCard } from '@/components/ui/spotlight';

interface ProgrammeCardProps {
  programme: any;
  schedule?: { days: string; time: string; instructor?: string };
}

const PROGRAMME_IMAGES: Record<string, string> = {
  'kids-dance': '/images/studio-training/group-circle-drill.jpg',
  'adults-dance': '/images/studio-training/contemporary-conditioning.jpg',
  'mind-body-fitness': '/images/studio-training/floorwork-stretch.jpg',
  kuchipudi: '/images/studio-training/alignment-drills-1.jpg',
};

export function ProgrammeCard({ programme, schedule }: ProgrammeCardProps) {
  const includes = Array.isArray(programme.includes) ? programme.includes : [];
  const imageSrc = PROGRAMME_IMAGES[programme.slug] || PROGRAMME_IMAGES['adults-dance'];

  return (
    <div className="bento-card flex flex-col justify-between overflow-hidden group">
      {/* Visual Header with authentic photography */}
      <div className="relative h-48 w-full overflow-hidden border-b border-line bg-canvas">
        <Image
          src={imageSrc}
          alt={`${programme.name} training at Rhythmzz Academy`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 dark:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
        
        {/* Recommended / Featured Badge */}
        {programme.sort_order === 1 && (
          <div className="absolute top-4 right-4 text-[9px] tracking-[2px] uppercase font-mono font-black py-1 px-3 rounded-full shadow-md z-10 bg-[#FB923C] text-black flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
            <span>Popular Batch</span>
          </div>
        )}

        <div className="absolute bottom-3 left-6 z-10">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[2px] uppercase font-bold py-1 px-3 rounded-full bg-surface/90 backdrop-blur-md text-ink border border-line">
            {programme.age_group}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 relative z-10 flex-1 flex flex-col justify-between gap-6">
        <div>
          <h3 className="heading-urban text-2xl sm:text-3xl text-ink mb-2 leading-tight">{programme.name}</h3>
          <p className="text-xs font-mono uppercase tracking-[1.5px] text-ink-2 mb-5 leading-normal">{programme.description}</p>
          
          <ul className="list-none flex flex-col gap-2.5 mb-6">
            {includes.map((item: string, i: number) => (
              <li key={i} className="text-xs sm:text-[13px] text-ink-2 flex items-start gap-2.5 leading-snug">
                <span className="text-[#FB923C] text-sm font-black shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {schedule && (
            <div className="bg-canvas/70 rounded-xl py-3 px-4 border border-line">
              <p className="text-[10px] font-mono text-ink-3 mb-1 tracking-[1px] uppercase font-bold">Class schedule</p>
              <strong className="text-xs sm:text-sm text-ink font-semibold block leading-snug">
                {schedule.days} · {schedule.time}{schedule.instructor ? ` · by ${schedule.instructor}` : ''}
              </strong>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-line">
          <div className="flex gap-2.5 sm:gap-3 flex-wrap mb-5">
            {programme.fees_monthly && (
              <div className="bg-canvas border border-line rounded-xl py-2 px-3 sm:py-2.5 sm:px-4 text-center shrink-0">
                <div className="heading-urban text-2xl sm:text-3xl text-ink font-bold leading-none">{formatCurrency(programme.fees_monthly)}</div>
                <div className="text-[9px] font-mono tracking-[1.5px] uppercase text-ink-3 mt-1">Monthly</div>
              </div>
            )}
            {programme.fees_quarterly && (
              <div className="bg-canvas border border-line rounded-xl py-2 px-3 sm:py-2.5 sm:px-4 text-center shrink-0">
                <div className="heading-urban text-2xl sm:text-3xl text-ink font-bold leading-none">{formatCurrency(programme.fees_quarterly)}</div>
                <div className="text-[9px] font-mono tracking-[1.5px] uppercase text-ink-3 mt-1">Quarterly</div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              href={`${ROUTES.enrol}?programme=${programme.slug}`}
              className="btn-peach flex-1 py-3 px-4 text-xs tracking-[0.15em] shadow-sm"
            >
              Enrol Now ──→
            </Link>
            {programme.slug === 'kuchipudi' && (
              <Link
                href="/kuchipudi"
                className="py-3 px-5 rounded-full text-center text-xs font-bold tracking-[0.15em] uppercase bg-surface hover:bg-canvas text-ink border border-line transition-all"
              >
                Syllabus
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

