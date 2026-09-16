'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import {
  CERTIFICATION_TRACKS,
  type CertificationTrackId,
} from '@/data/certification-tracks';
import {
  homepageCtaOutlineLight,
  homepageCtaPair,
  homepageCtaPairButton,
  homepageCtaPrimary,
  homepageMediaRadius,
} from '@/lib/ui/homepage-cta';
import { cn } from '@/lib/utils/cn';
import { enrolHref } from '@/lib/utils/constants';

interface LevelCertificationSectionProps {
  className?: string;
  defaultTrack?: CertificationTrackId;
}

export function LevelCertificationSection({
  className = '',
  defaultTrack = 'overview',
}: LevelCertificationSectionProps) {
  const [activeId, setActiveId] = useState<CertificationTrackId>(defaultTrack);
  const track = CERTIFICATION_TRACKS.find((t) => t.id === activeId) ?? CERTIFICATION_TRACKS[0];

  return (
    <HomepageSection id="certification" className={cn('py-16 sm:py-24', className)}>
      <HomepageSectionHeading
        eyebrow="Certification programmes"
        title="Level-based"
        accent="training."
        description="Board exams, published syllabi, and stage milestones — pick a track below."
        className="mb-6 sm:mb-8"
      />

      <div
        className="flex flex-wrap gap-2 mb-8 sm:mb-10"
        role="tablist"
        aria-label="Certification programme tracks"
      >
        {CERTIFICATION_TRACKS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeId === item.id}
            aria-controls={`certification-panel-${item.id}`}
            onClick={() => setActiveId(item.id)}
            className={cn(
              'px-3.5 py-2 rounded-md text-[10px] font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer active:scale-[0.98]',
              activeId === item.id
                ? 'bg-blk text-white'
                : 'bg-surface text-ink-2 ring-1 ring-line hover:text-ink hover:ring-ink/20',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        id={`certification-panel-${track.id}`}
        role="tabpanel"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center"
      >
        <div
          className={cn(
            'relative w-full aspect-[4/5] overflow-hidden bg-canvas border border-line',
            homepageMediaRadius,
          )}
        >
          <Image
            key={track.id}
            src={track.image}
            alt={track.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition-opacity duration-500"
            priority={track.id === 'overview'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bl mb-1">
              {track.imageBadge}
            </p>
            <p className="font-anton text-base sm:text-lg uppercase tracking-wide leading-tight">
              {track.imageTags}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 min-w-0">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl mb-2">
              {track.eyebrow}
            </p>
            <h3 className="font-anton text-2xl sm:text-3xl md:text-[2.25rem] text-ink tracking-tight uppercase leading-[0.95]">
              {track.title}
              {track.titleAccent ? (
                <>
                  {' '}
                  <span className="text-bl">{track.titleAccent}</span>
                </>
              ) : null}
            </h3>
            <p className="mt-3 text-sm text-ink-2 leading-relaxed max-w-lg">{track.summary}</p>
          </div>

          <div className="divide-y divide-line border-t border-b border-line">
            {track.details.map(({ label, value }) => (
              <div
                key={label}
                className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6"
              >
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-3 shrink-0 sm:w-36">
                  {label}
                </span>
                <span className="text-sm text-ink font-medium leading-relaxed">{value}</span>
              </div>
            ))}
          </div>

          <div className={homepageCtaPair}>
            <Link
              href={enrolHref({ programme: track.enrolProgramme, intent: 'trial' })}
              className={`${homepageCtaPrimary} ${homepageCtaPairButton}`}
            >
              {track.primaryCta}
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </Link>
            <Link
              href={track.syllabusHref}
              className={`${homepageCtaOutlineLight} ${homepageCtaPairButton}`}
            >
              {track.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </HomepageSection>
  );
}
