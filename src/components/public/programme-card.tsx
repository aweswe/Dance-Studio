import Link from 'next/link';
import Image from 'next/image';
import { enrolHref, ROUTES } from '@/lib/utils/constants';
import { formatCurrency } from '@/lib/utils/format';
import { ArrowUpRight } from 'lucide-react';

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
    <div className="group flex flex-col border border-line rounded-[24px] overflow-hidden hover:border-ink/30 transition-colors bg-canvas">
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
      <div className="flex flex-col flex-1 p-5 sm:p-6 gap-4">
        {/* Name + age */}
        <div>
          <h3 className="font-anton text-xl sm:text-2xl text-ink uppercase tracking-tight leading-tight">
            {programme.name}
          </h3>
          <p className="text-[11px] font-mono uppercase tracking-wider text-ink-3 mt-1">
            {programme.age_group}
          </p>
        </div>

        {/* Schedule if available */}
        {(schedule || (programme.batches_info && programme.batches_info[0])) && (
          <p className="text-xs text-ink-2 font-mono border-t border-line pt-3">
            {schedule
              ? `${schedule.days} · ${schedule.time}`
              : programme.batches_info[0].schedule}
          </p>
        )}

        {/* Price + actions */}
        <div className="mt-auto pt-4 border-t border-line flex items-end justify-between gap-3">
          <div>
            {programme.fees_monthly && (
              <div>
                <span className="font-anton text-2xl text-ink tracking-tight">
                  {formatCurrency(programme.fees_monthly)}
                </span>
                <span className="text-[10px] font-mono text-ink-3 ml-1">/month</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={ROUTES.programme(programme.slug)}
              className="text-[11px] font-mono uppercase tracking-wider text-ink-3 hover:text-ink transition-colors"
            >
              Details
            </Link>
            <Link
              href={enrolHref({ programme: programme.slug, intent: 'pay' })}
              className="btn-sun py-2.5 px-4 text-[11px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5"
            >
              Enrol &amp; pay <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
