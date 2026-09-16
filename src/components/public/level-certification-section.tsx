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
  homepageFilterPill,
  homepageMediaFrame,
} from '@/lib/ui/homepage-cta';
import { sectionPad } from '@/lib/ui/section-layout';
import { cn } from '@/lib/utils/cn';
import { enrolHref } from '@/lib/utils/constants';

interface LevelCertificationSectionProps {
  className?: string;
  defaultTrack?: CertificationTrackId;
}

/** Shared vertical rhythm inside the copy column */
const BLOCK_GAP = 'gap-4 sm:gap-5';
const COL_GAP = 'gap-12 lg:gap-24 xl:gap-28';

export function LevelCertificationSection({
  className = '',
  defaultTrack = 'overview',
}: LevelCertificationSectionProps) {
  const [activeId, setActiveId] = useState<CertificationTrackId>(defaultTrack);
  const track = CERTIFICATION_TRACKS.find((t) => t.id === activeId) ?? CERTIFICATION_TRACKS[0];

  return (
    <HomepageSection id="certification" className={cn(sectionPad, className)}>
      <HomepageSectionHeading
        eyebrow="Certification programmes"
        title="Level-based"
        accent="training."
        description="Board exams, published syllabi, and stage milestones — pick a track below."
        className="mb-8 sm:mb-10"
      />

      <div
        className="mb-10 sm:mb-12 flex flex-wrap gap-2"
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
            className={homepageFilterPill(activeId === item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/*
        Reference layout: equal-width columns, equal outer inset (via HomepageSection),
        image top ↔ title top, image bottom ↔ CTA bottom, uniform gaps between text blocks.
      */}
      <div
        id={`certification-panel-${track.id}`}
        role="tabpanel"
        className={cn('grid w-full grid-cols-1 lg:grid-cols-2 items-stretch', COL_GAP)}
      >
        {/* Left — portrait, fills column width, height driven by row */}
        <figure
          className={cn(
            'relative w-full aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[26rem] xl:min-h-[28rem]',
            homepageMediaFrame,
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
          <figcaption className="absolute bottom-0 inset-x-0 z-[2] flex items-end pb-3 px-3 sm:px-4 pointer-events-none">
            <p className="min-w-0 max-w-[85%] rounded-md bg-black/55 backdrop-blur-sm px-2.5 py-1 font-body text-[12px] sm:text-[13px] font-medium normal-case tracking-normal text-white/90 leading-snug line-clamp-3">
              {track.imageBadge} · {track.imageTags}
            </p>
          </figcaption>
        </figure>

        {/* Right — single left edge, even spacing, stretched to match image height */}
        <div className={cn('flex min-w-0 flex-col justify-between', BLOCK_GAP)}>
          <header>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl mb-3">
              {track.eyebrow}
            </p>
            <h3 className="font-anton text-[1.75rem] sm:text-3xl md:text-[2.35rem] text-ink tracking-tight uppercase leading-[0.94]">
              {track.title}
              {track.titleAccent ? (
                <>
                  {' '}
                  <span className="text-bl">{track.titleAccent}</span>
                </>
              ) : null}
            </h3>
            <p className="mt-2.5 text-sm sm:text-[15px] text-ink-2 leading-[1.7]">
              {track.summary}
            </p>
          </header>

          <dl className="w-full border-y border-line divide-y divide-line">
            {track.details.map(({ label, value }) => (
              <div key={label} className="py-2.5 sm:py-3 flex flex-col gap-1">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">
                  {label}
                </dt>
                <dd className="text-sm sm:text-[15px] text-ink font-medium leading-relaxed">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

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
