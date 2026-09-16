import { createAdminSupabase } from '@/lib/supabase/server';
import Link from 'next/link';
import { ROUTES, SITE_URL } from '@/lib/utils/constants';
import { FALLBACK_EVENTS } from '@/data/events';
import type { Metadata } from 'next';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { sectionPadAfterTitle } from '@/lib/ui/section-layout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Events | Rhythmzz Academy',
  alternates: { canonical: `${SITE_URL}/events` },
};

export default async function EventsIndexPage() {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('events')
    .select('slug, title, starts_at, venue')
    .eq('is_published', true)
    .order('starts_at', { ascending: true });
  const events = data && data.length > 0 ? data : FALLBACK_EVENTS;

  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Stage"
        title="Upcoming events"
        description="Shows, recitals, and workshops from the Rhythmzz calendar."
      />

      <HomepageSection className={sectionPadAfterTitle}>
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          {(events as { slug: string; title: string; starts_at: string; venue: string }[]).map((e) => (
            <Link
              key={e.slug}
              href={`${ROUTES.events}/${e.slug}`}
              className="block border border-line rounded-md p-6 hover:border-ink/40 transition-colors bg-surface"
            >
              <h2 className="font-anton text-2xl uppercase tracking-tight">{e.title}</h2>
              <p className="text-sm text-ink-2 mt-1">
                {new Date(e.starts_at).toLocaleString('en-IN', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                  timeZone: 'Asia/Kolkata',
                })}
              </p>
              <p className="text-sm text-ink-2">{e.venue}</p>
            </Link>
          ))}
        </div>
      </HomepageSection>
    </PublicPage>
  );
}
