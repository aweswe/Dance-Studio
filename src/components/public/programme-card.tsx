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
  const theme = PROGRAMME_THEMES[programme.slug as keyof typeof PROGRAMME_THEMES] || PROGRAMME_THEMES['adults-dance'];
  const includes = Array.isArray(programme.includes) ? programme.includes : [];
  const imageSrc = PROGRAMME_IMAGES[programme.slug] || PROGRAMME_IMAGES['adults-dance'];

  return (
    <SpotlightCard className={cn("rounded-2xl h-full flex flex-col justify-between overflow-hidden", theme.card)}>
      {/* Visual Header with authentic photography */}
      <div className="relative h-44 w-full overflow-hidden border-b border-white/10">
        <Image
          src={imageSrc}
          alt={`${programme.name} training at Rhythmzz Academy`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 hover:scale-105 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blk via-blk/40 to-transparent" />
        
        {/* Recommended / Featured Badge */}
        {programme.sort_order === 1 && (
          <div className={cn(
            "absolute top-4 right-4 text-[9px] tracking-[2px] uppercase font-bold py-1.5 px-3 rounded-full shadow-sm z-10",
            programme.slug === 'adults-dance' ? "bg-gold text-black" : "bg-bl text-white"
          )}>
            Recommended
          </div>
        )}

        <div className="absolute bottom-3 left-6 z-10">
          <div className={cn("inline-flex items-center gap-1.5 text-[9px] tracking-[3px] uppercase font-bold py-1 px-2.5 rounded-full", theme.badge)}>
            {programme.age_group}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 md:p-10 relative z-10 flex-1 flex flex-col justify-between gap-6">
        <div>
          <h3 className="heading-display text-2xl sm:text-3xl md:text-[34px] text-white mb-2 leading-tight">{programme.name}</h3>
          <p className="text-[11px] tracking-[1.5px] sm:tracking-[2px] uppercase text-white/60 mb-5 leading-normal">{programme.description}</p>
          
          <ul className="list-none flex flex-col gap-2 mb-6">
            {includes.map((item: string, i: number) => (
              <li key={i} className="text-xs sm:text-[13px] text-white/80 flex items-start gap-2.5 leading-snug">
                <span className={cn("text-xs font-bold shrink-0 mt-0.5", theme.checkmark)}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {schedule && (
            <div className="bg-white/5 rounded-lg py-3 px-4 border border-white/10">
              <p className="text-[10px] sm:text-[11px] text-white/50 mb-1 tracking-[0.5px] uppercase font-semibold">Class schedule</p>
              <strong className="text-xs sm:text-sm text-white/90 font-medium block leading-snug">
                {schedule.days} · {schedule.time}{schedule.instructor ? ` · by ${schedule.instructor}` : ''}
              </strong>
            </div>
          )}
        </div>

        <div className="pt-2">
          <div className="flex gap-2.5 sm:gap-3 flex-wrap mb-5">
            {programme.fees_monthly && (
              <div className={cn("rounded-lg py-2 px-3 sm:py-2.5 sm:px-4 text-center border shrink-0", theme.chip)}>
                <div className="heading-display text-2xl sm:text-3xl text-white font-bold leading-none">{formatCurrency(programme.fees_monthly)}</div>
                <div className="text-[9px] tracking-[1.5px] uppercase text-white/50 mt-1">Monthly</div>
              </div>
            )}
            {programme.fees_quarterly && (
              <div className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 sm:py-2.5 sm:px-4 text-center shrink-0">
                <div className="heading-display text-2xl sm:text-3xl text-white font-bold leading-none">{formatCurrency(programme.fees_quarterly)}</div>
                <div className="text-[9px] tracking-[1.5px] uppercase text-white/50 mt-1">Quarterly</div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              href={`${ROUTES.enrol}?programme=${programme.slug}`}
              className={cn("block w-full sm:flex-1 text-center text-[11px] font-semibold tracking-[2px] uppercase py-3.5 px-4 transition-all focus-visible:focus-ring active:scale-[0.98] rounded-control shadow-md", theme.button)}
            >
              Enrol Now
            </Link>
            {programme.slug === 'kuchipudi' && (
              <Link
                href="/kuchipudi"
                className="block w-full sm:w-auto text-center text-[11px] font-semibold tracking-[2px] uppercase py-3.5 px-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all rounded-control focus-visible:focus-ring"
              >
                Syllabus
              </Link>
            )}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

