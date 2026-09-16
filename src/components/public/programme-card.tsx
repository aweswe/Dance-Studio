import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { CardFooterActions, CardPriceBlock } from '@/components/public/card-footer-actions';
import { enrolHref, ROUTES } from '@/lib/utils/constants';
import { formatCurrency } from '@/lib/utils/format';

interface ProgrammeCardProps {
  programme: any;
  schedule?: { days: string; time: string; instructor?: string };
}

const PROGRAMME_IMAGES: Record<string, string> = {
  'commercial-expressive': '/images/studio-training/contemporary-conditioning.jpg',
  'mind-body-fitness': '/images/studio-training/floorwork-stretch.jpg',
  'classical-dance': '/images/classical-certification-dancer.png',
  'kids-dance': '/images/studio-training/group-circle-drill.jpg',
  'adults-dance': '/images/studio-training/contemporary-conditioning.jpg',
  kuchipudi: '/images/classical-certification-dancer.png',
};

export function ProgrammeCard({ programme, schedule }: ProgrammeCardProps) {
  const imageSrc =
    PROGRAMME_IMAGES[programme.slug] ||
    '/images/studio-training/floorwork-stretch.jpg';

  return (
    <div className="@container group flex flex-col border border-line rounded-md overflow-hidden hover:border-ink/30 transition-colors bg-canvas">
      {/* Photo */}
      <div className="relative h-52 w-full overflow-hidden bg-surface">
        <Image
          src={imageSrc}
          alt={programme.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-6 pt-6 pb-8 sm:px-7 sm:pt-7 sm:pb-9 gap-5">
        {/* Name + age */}
        <div className="space-y-1.5">
          <h3 className="font-anton text-xl sm:text-2xl text-ink uppercase tracking-tight leading-tight">
            {programme.name}
          </h3>
          <p className="text-[11px] font-mono uppercase tracking-wider text-ink-3">
            {programme.age_group}
          </p>
        </div>

        {/* Schedule if available */}
        {(schedule || (programme.batches_info && programme.batches_info[0])) && (
          <div className="py-4 border-y border-line">
            <p className="text-xs text-ink-2 font-mono leading-relaxed">
              {schedule
                ? `${schedule.days} · ${schedule.time}`
                : programme.batches_info[0].schedule}
            </p>
          </div>
        )}

        {/* Price + actions — column in narrow cards; row only when the card itself is wide */}
        <div className="mt-auto pt-5 sm:pt-6 border-t border-line flex flex-col gap-4 sm:gap-5 @md:flex-row @md:items-center @md:justify-between @md:gap-8">
          {programme.fees_monthly ? (
            <CardPriceBlock amount={formatCurrency(programme.fees_monthly)} />
          ) : (
            <div className="hidden @md:block @md:flex-1" aria-hidden />
          )}

          <CardFooterActions
            className="@md:shrink-0"
            secondaryHref={ROUTES.programme(programme.slug)}
            secondaryLabel="Details"
            primaryHref={enrolHref({ programme: programme.slug, intent: 'pay' })}
            primaryLabel="Enrol & pay"
            primaryIcon={<ArrowUpRight size={12} strokeWidth={2} />}
          />
        </div>
      </div>
    </div>
  );
}
