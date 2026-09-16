import { createAdminSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
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

  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Stage"
        title={e.title}
        description={`${when} · ${e.venue}`}
        align="center"
      />

      <HomepageSection className={sectionPadAfterTitle} innerClassName="px-6 sm:px-10 lg:px-12 xl:px-14">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <p className="text-sm leading-relaxed text-ink">{e.description}</p>
          {dbReady ? (
            <EventRsvpForm slug={slug} />
          ) : (
            <a
              href={whatsappLink(`Hi Rhythmzz, RSVP for ${e.title} — ${when}`)}
              className={cn(homepageCtaWhatsApp, 'inline-flex')}
            >
              RSVP on WhatsApp · {ACADEMY.phoneDisplay}
            </a>
          )}
        </div>
      </HomepageSection>
    </PublicPage>
  );
}
