'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { homepageFilterPillMd } from '@/lib/ui/homepage-cta';
import { formatTime } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';

interface ScheduleFilterProps {
  batches: any[];
}

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const THEME_BORDER: Record<string, string> = {
  'mind-body-fitness': 'border-l-bl',
  'kids-dance': 'border-l-green',
  'adults-dance': 'border-l-gold',
  'kuchipudi': 'border-l-purp',
};

const PROGRAMME_ICONS: Record<string, string> = {
  'mind-body-fitness': '/images/studio-training/floorwork-stretch.jpg',
  'kids-dance': '/images/studio-training/group-circle-drill.jpg',
  'adults-dance': '/images/studio-training/contemporary-conditioning.jpg',
  'kuchipudi': '/images/kuchipudi/kuchipudi-natyarambham-posture.jpg',
};

function durationLabel(start: string, end: string): string {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const hours = eh - sh + (em - sm) / 60;
  return hours === 1 ? '1 hr' : `${hours} hrs`;
}

const BATCH_CATEGORIES = [
  { id: 'all', label: 'All Batches' },
  { id: 'kids-dance', label: 'Kids Dance' },
  { id: 'gymnastics', label: 'Gymnastic' },
  { id: 'adults-dance', label: 'Adults Dance' },
  { id: 'mind-body-fitness', label: 'Mind & Body Fitness' },
  { id: 'kuchipudi', label: 'Kuchipudi Classical' },
];

export function ScheduleFilter({ batches }: ScheduleFilterProps) {
  const [activeBatch, setActiveBatch] = useState<string>('all');

  const filteredBatches = activeBatch === 'all'
    ? batches
    : batches.filter((b) => {
        const slug = b.programme?.slug;
        if (activeBatch === 'gymnastics') return slug === 'gymnastics' || slug === 'gymnastic';
        if (activeBatch === 'kuchipudi') return slug === 'kuchipudi' || slug === 'classical-dance';
        return slug === activeBatch;
      });

  // Group by programme name for clean batch hierarchy
  const groupedByProgramme = Array.from(
    new Set(filteredBatches.map((b) => b.programme?.name || 'Dance Batch'))
  ).map((progName) => ({
    programmeName: progName,
    batches: filteredBatches.filter((b) => (b.programme?.name || 'Dance Batch') === progName),
  }));

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 sm:flex-wrap mb-6 sm:mb-8" role="group" aria-label="Filter classes by batch">
        {BATCH_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveBatch(cat.id)}
            aria-pressed={activeBatch === cat.id}
            className={homepageFilterPillMd(activeBatch === cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {groupedByProgramme.length > 0 ? (
        <div className="flex flex-col gap-6 sm:gap-8">
          {groupedByProgramme.map(({ programmeName, batches: progBatches }) => (
            <div key={programmeName} className="bg-surface rounded-md p-4 sm:p-5 md:p-6 border border-line shadow-sm">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-line">
                <h3 className="font-anton text-lg sm:text-xl uppercase tracking-tight text-ink">
                  {programmeName}
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">
                  {progBatches.length} {progBatches.length === 1 ? 'Batch' : 'Batches'}
                </span>
              </div>
              <div className="divide-y divide-line/60">
                {progBatches.map((batch, i) => {
                  const slotsLeft = (batch.capacity ?? 0) - (batch.enrolled_count ?? 0);
                  const thumb = PROGRAMME_ICONS[batch.programme?.slug] || '/images/studio-training/studio-practice-mirrors.jpg';

                  // Format batch title cleanly without trainer names (per item 7)
                  const cleanBatchTitle = (batch.name || '')
                    .replace(/-\s*(Kajal|Deepak|Nitish|Pranith|Shailaja|Srusti|Srikanth).*$/i, '')
                    .trim() || `${batch.programme?.name} Batch`;

                  return (
                    <div
                      key={batch.id ?? i}
                      className={cn(
                        "flex flex-col sm:grid sm:grid-cols-[90px_1fr_auto] md:grid-cols-[90px_44px_1fr_120px_120px] items-start sm:items-center gap-3 md:gap-4 py-3.5 px-2.5 sm:px-2 hover:bg-canvas-muted/60 transition-colors rounded-md border-l-4",
                        THEME_BORDER[batch.programme?.slug]
                      )}
                    >
                      {/* Mobile header / desktop columns */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:contents">
                        {/* Time */}
                        <span className="text-xs font-bold text-ink shrink-0 tabular-nums">
                          {formatTime(batch.time_start)}
                        </span>

                        {/* Thumbnail badge */}
                        <div className="hidden md:block relative w-9 h-9 rounded-full overflow-hidden border border-line shrink-0">
                          <Image
                            src={thumb}
                            alt={batch.programme?.name || 'Class preview'}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Discipline info */}
                        <div className="min-w-0 flex-1 sm:flex-initial">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-anton text-base sm:text-[17px] text-ink leading-tight uppercase tracking-tight">
                              {cleanBatchTitle}
                            </span>
                            {batch.programme?.slug === 'kuchipudi' && (
                              <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purp/10 text-purp">
                                Certified
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] tracking-[1.5px] uppercase text-ink-2 mt-0.5">
                            {Array.isArray(batch.days) ? batch.days.join(' · ') : batch.days}
                          </p>
                        </div>
                      </div>

                      {/* Duration */}
                      <span className="hidden md:block text-[11px] text-ink-2">
                        {durationLabel(batch.time_start, batch.time_end)} · {formatTime(batch.time_end)}
                      </span>

                      {/* Actions with highlighted BOOK button */}
                      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end md:flex-col md:items-end gap-2 md:gap-1.5 pt-2 sm:pt-0 border-t border-line/40 sm:border-t-0">
                        <span className="text-[10px] font-bold tracking-[1px] uppercase text-slate-800 border border-slate-300 px-2 py-0.5 rounded-md whitespace-nowrap bg-slate-100">
                          {slotsLeft > 0 ? `${slotsLeft} slots left` : 'Filling fast'}
                        </span>
                        <Link
                          href={`${ROUTES.enrol}?programme=${batch.programme?.slug ?? ''}`}
                          className="text-[10px] font-bold tracking-[1.5px] uppercase px-4 py-1.5 bg-slate-950 text-white hover:bg-black transition-all rounded-md whitespace-nowrap shadow-sm focus-visible:focus-ring active:scale-[0.98]"
                        >
                          Book Trial
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-ink-2 text-sm bg-surface p-8 rounded-md border border-line text-center">
          No batches found for this category.
        </p>
      )}
    </div>
  );
}
