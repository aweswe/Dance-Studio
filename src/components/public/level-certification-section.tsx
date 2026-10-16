'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Flame,
  GraduationCap,
  ShieldCheck,
  Users,
} from 'lucide-react';
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
} from '@/lib/ui/homepage-cta';
import { sectionPad } from '@/lib/ui/section-layout';
import { cn } from '@/lib/utils/cn';
import { enrolHref } from '@/lib/utils/constants';

interface LevelCertificationSectionProps {
  className?: string;
  defaultTrack?: CertificationTrackId;
}

function getTrackIcon(id: CertificationTrackId) {
  switch (id) {
    case 'overview':
      return GraduationCap;
    case 'kuchipudi':
      return Award;
    case 'kathak':
      return Flame;
    default:
      return Award;
  }
}

function getFeatureIcon(name: string) {
  switch (name) {
    case 'calendar':
      return Calendar;
    case 'users':
      return Users;
    case 'award':
      return Award;
    case 'book':
    default:
      return BookOpen;
  }
}

export function LevelCertificationSection({
  className = '',
  defaultTrack = 'overview',
}: LevelCertificationSectionProps) {
  const [activeId, setActiveId] = useState<CertificationTrackId>(defaultTrack);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const track = CERTIFICATION_TRACKS.find((t) => t.id === activeId) ?? CERTIFICATION_TRACKS[0];

  // Active image safely derived from track gallery or primary image
  const gallery = track.gallery && track.gallery.length > 0 ? track.gallery : [];
  const activeImage =
    gallery[selectedImageIndex] ??
    gallery[0] ?? {
      src: track.image,
      alt: track.imageAlt,
      label: track.imageBadge,
      shortLabel: 'Featured',
    };

  const handleTabChange = (id: CertificationTrackId) => {
    setActiveId(id);
    setSelectedImageIndex(0);
  };

  return (
    <HomepageSection id="certification" className={cn(sectionPad, 'border-t border-line/60', className)}>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 sm:mb-10">
        <HomepageSectionHeading
          eyebrow="Certification programmes"
          title="Level-based"
          accent="training."
          description="Learn step-by-step with clear levels, yearly board exams, and certificates — choose your dance style below."
          className="mb-0 max-w-xl"
        />

        {/* Modern Segmented Tab Bar — Grid on mobile, inline pill on desktop */}
        <div
          role="tablist"
          aria-label="Certification programme tracks"
          className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex p-1 sm:p-1.5 rounded-xl sm:rounded-full bg-canvas-muted/80 border border-line/80 shadow-sm backdrop-blur-sm self-stretch md:self-end gap-1"
        >
          {CERTIFICATION_TRACKS.map((item) => {
            const Icon = getTrackIcon(item.id);
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`certification-panel-${item.id}`}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  'flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2 rounded-lg sm:rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-[0.97] text-center',
                  isActive
                    ? 'bg-ink text-white shadow-md shadow-ink/20 ring-1 ring-white/10'
                    : 'text-ink-2 hover:text-ink hover:bg-surface/80',
                )}
              >
                <Icon
                  size={14}
                  className={cn('transition-colors shrink-0', isActive ? 'text-bl' : 'text-ink-3')}
                  strokeWidth={2.5}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Elevated Showcase Card */}
      <div
        id={`certification-panel-${track.id}`}
        role="tabpanel"
        className="relative rounded-2xl sm:rounded-3xl border border-line/80 bg-surface/90 shadow-xl shadow-slate-950/[0.03] backdrop-blur-sm overflow-hidden p-3.5 sm:p-7 lg:p-9"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 xl:gap-12 items-center">
          {/* Left Column: Master Image Showcase (Fitting 100% of photo without cut down) */}
          <div className="lg:col-span-6 w-full">
            <figure className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl flex flex-col justify-between">
              {/* Top Floating Bar: Accreditation Badge & Multi-Photo Switcher */}
              <div className="relative z-10 p-2.5 sm:p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/15 text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-white shadow-lg shrink-0">
                  <ShieldCheck size={13} className="text-bl shrink-0" strokeWidth={2.5} />
                  {track.imageBadge}
                </span>

                {gallery.length > 1 && (
                  <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md border border-white/15 p-0.5 sm:p-1 rounded-full shadow-lg shrink-0">
                    {gallery.map((img, idx) => (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={cn(
                          'px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer',
                          selectedImageIndex === idx
                            ? 'bg-bl text-slate-950 shadow-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/10',
                        )}
                        title={img.label}
                      >
                        {img.shortLabel}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Image Frame with object-contain: NEVER cuts down heads, feet, or certificates */}
              <div className="relative z-[2] w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/11] flex items-center justify-center p-2 sm:p-4">
                <Image
                  key={activeImage.src}
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain transition-all duration-500 rounded-lg drop-shadow-2xl"
                  priority={track.id === 'overview'}
                />
              </div>

              {/* Bottom Information Ribbon */}
              <figcaption className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-bl animate-pulse shrink-0" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-white/90">
                    {track.imageTags}
                  </span>
                </div>
                <span className="text-[11px] text-white/70 font-medium">
                  {activeImage.label}
                </span>
              </figcaption>
            </figure>
          </div>

          {/* Right Column: Curriculum & Accreditation Bento Architecture */}
          <div className="lg:col-span-6 flex flex-col justify-between min-w-0">
            <div>
              {/* Track Eyebrow */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bl/10 border border-bl/25 text-[10px] font-mono font-bold uppercase tracking-widest text-bl">
                  {track.eyebrow}
                </span>
                <span className="text-[11px] font-mono text-ink-3">
                  • Certified Course
                </span>
              </div>

              {/* Title & Punchy Display Typography */}
              <h3 className="font-anton text-2xl sm:text-3xl lg:text-[2.65rem] text-ink uppercase tracking-tight leading-[0.96]">
                {track.title}
                {track.titleAccent ? (
                  <>
                    {' '}
                    <span className="text-bl">{track.titleAccent}</span>
                  </>
                ) : null}
              </h3>

              {/* Summary Description */}
              <p className="mt-3 text-sm sm:text-[15px] text-ink-2 leading-relaxed">
                {track.summary}
              </p>

              {/* Bento Milestones Grid */}
              <div className="my-5 sm:my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {track.features.map((feature) => {
                  const Icon = getFeatureIcon(feature.iconName);
                  return (
                    <div
                      key={feature.label}
                      className="p-3.5 rounded-xl border border-line bg-canvas-muted/40 hover:border-bl/40 hover:bg-canvas-muted/70 transition-all flex flex-col justify-between gap-2.5 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-bl/10 text-bl flex items-center justify-center shrink-0">
                          <Icon size={14} strokeWidth={2.5} />
                        </div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-3">
                          {feature.label}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-[13px] font-bold text-ink leading-snug">
                          {feature.value}
                        </p>
                        {feature.subtext && (
                          <p className="text-[11px] text-ink-3 mt-0.5 leading-normal">
                            {feature.subtext}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trust Guarantees Checklist */}
              <div className="mb-6 flex flex-wrap items-center gap-y-2 gap-x-4 text-[12px] text-ink-2 font-medium">
                {track.trustHighlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-bl shrink-0" strokeWidth={2.5} />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Impact CTA Pair */}
            <div className={homepageCtaPair}>
              <Link
                href={enrolHref({ programme: track.enrolProgramme, intent: 'trial' })}
                className={`${homepageCtaPrimary} ${homepageCtaPairButton} group`}
              >
                <span>{track.primaryCta}</span>
                <ArrowUpRight
                  size={13}
                  strokeWidth={2.5}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
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
      </div>
    </HomepageSection>
  );
}
