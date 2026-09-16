import { createAdminSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { EventRsvpForm } from '@/components/public/event-rsvp-form';
import { SITE_URL, ACADEMY } from '@/lib/utils/constants';
import { fallbackEvent } from '@/data/events';
import { whatsappLink } from '@/lib/utils/format';
import type { Metadata } from 'next';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { homepageCtaWhatsApp } from '@/lib/ui/homepage-cta';
import { sectionPadAfterTitle } from '@/lib/ui/section-layout';
import { cn } from '@/lib/utils/cn';
import { Calendar, MapPin, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = fallbackEvent(slug);
  return {
    title: `${event?.title ?? slug.replace(/-/g, ' ')} | Rhythmzz Academy`,
    alternates: { canonical: `${SITE_URL}/events/${slug}` },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminSupabase();
  const { data: row } = await supabase.from('events').select('*').eq('slug', slug).maybeSingle();
  const e = (row as any)?.is_published === false ? null : (row as any) || fallbackEvent(slug);
  if (!e) notFound();

  const when = new Date(e.starts_at).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });
  const dbReady = Boolean(row);
  const galleryImages: string[] = Array.isArray(e.images) ? e.images : [];

  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Stage & Showcase"
        title={e.title}
        description={`${when} · ${e.venue}`}
        align="center"
      />

      <HomepageSection className={sectionPadAfterTitle} innerClassName="px-6 sm:px-10 lg:px-12 xl:px-14">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Cover Poster if available */}
          {e.image_url ? (
            <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden border border-line shadow-lg bg-surface-2">
              <Image
                src={e.image_url}
                alt={e.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
                unoptimized
              />
            </div>
          ) : null}

          {/* Key Event Details Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-ink shadow-sm">
              <Calendar size={15} className="text-brand" />
              <span>{when}</span>
            </div>
            {e.venue ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-ink shadow-sm">
                <MapPin size={15} className="text-brand" />
                <span>{e.venue}</span>
              </div>
            ) : null}
          </div>

          {/* Description */}
          <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 space-y-4">
            <h3 className="font-display text-xl text-ink">About this event</h3>
            <p className="text-sm leading-relaxed text-ink-2 whitespace-pre-line">{e.description}</p>
          </div>

          {/* Event Gallery if photos exist */}
          {galleryImages.length > 0 ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand" />
                <h3 className="font-display text-xl text-ink">Photo Gallery</h3>
                <span className="text-xs text-ink-3">({galleryImages.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-line bg-surface-2 group shadow-sm"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${e.title} photo ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 240px"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* RSVP Section */}
          <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 space-y-4 text-center">
            <h3 className="font-display text-xl text-ink">Reserve your spot</h3>
            <p className="text-xs text-ink-3">
              RSVP helps us prepare seating, stage arrangements, and refreshments for your party.
            </p>
            {dbReady ? (
              <div className="pt-2 text-left">
                <EventRsvpForm slug={slug} />
              </div>
            ) : (
              <a
                href={whatsappLink(`Hi Rhythmzz, RSVP for ${e.title} — ${when}`)}
                className={cn(homepageCtaWhatsApp, 'inline-flex')}
              >
                RSVP on WhatsApp · {ACADEMY.phoneDisplay}
              </a>
            )}
          </div>
        </div>
      </HomepageSection>
    </PublicPage>
  );
}
