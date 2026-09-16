import { createAdminSupabase } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES, SITE_URL } from '@/lib/utils/constants';
import { FALLBACK_EVENTS } from '@/data/events';
import type { Metadata } from 'next';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { sectionPadAfterTitle } from '@/lib/ui/section-layout';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Events & Showcases | Rhythmzz Academy',
  description: 'Stage recitals, annual days, student showcases, and dance workshops from Rhythmzz Academy of Dance.',
  alternates: { canonical: `${SITE_URL}/events` },
};

interface PublicEventItem {
  slug: string;
  title: string;
  starts_at: string;
  venue: string;
  description?: string | null;
  image_url?: string | null;
  images?: string[] | null;
}

export default async function EventsIndexPage() {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('events')
    .select('slug, title, starts_at, venue, description, image_url, images')
    .eq('is_published', true)
    .order('starts_at', { ascending: true });
  const events = data && data.length > 0 ? (data as unknown as PublicEventItem[]) : (FALLBACK_EVENTS as unknown as PublicEventItem[]);

  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Stage & Showcases"
        title="Upcoming events"
        description="Recitals, annual showcases, and masterclasses from the Rhythmzz calendar."
      />

      <HomepageSection className={sectionPadAfterTitle}>
        <div className="max-w-4xl mx-auto space-y-4">
          {events.map((e) => (
            <Link
              key={e.slug}
              href={`${ROUTES.events}/${e.slug}`}
              className="group block border border-line rounded-xl p-5 sm:p-6 hover:border-brand/40 transition-all bg-surface hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {e.image_url ? (
                  <div className="relative w-full sm:w-48 aspect-[16/10] sm:aspect-square shrink-0 rounded-lg overflow-hidden border border-line bg-surface-2">
                    <Image
                      src={e.image_url}
                      alt={e.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 200px"
                      unoptimized
                    />
                  </div>
                ) : null}

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-anton text-2xl uppercase tracking-tight text-ink group-hover:text-brand transition-colors">
                      {e.title}
                    </h2>
                    <span className="shrink-0 text-brand opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      <ArrowRight size={18} />
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} className="text-brand" />
                      {new Date(e.starts_at).toLocaleString('en-IN', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                        timeZone: 'Asia/Kolkata',
                      })}
                    </span>
                    {e.venue ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="text-brand" />
                        {e.venue}
                      </span>
                    ) : null}
                  </div>

                  {e.description ? (
                    <p className="text-sm text-ink-2 line-clamp-2 leading-relaxed pt-1">
                      {e.description}
                    </p>
                  ) : null}

                  {e.images && e.images.length > 0 ? (
                    <p className="text-xs text-brand font-medium pt-1">
                      Includes photo gallery ({e.images.length} photo{e.images.length === 1 ? '' : 's'})
                    </p>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </HomepageSection>
    </PublicPage>
  );
}
