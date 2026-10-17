import { Metadata } from 'next';
import { EventsAchievementsContent } from '@/components/public/events-achievements-content';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { PublicPage } from '@/components/public/public-page';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Events & Achievements | Rhythmzz Academy of Dance',
  description:
    'Explore major historic milestones of Rhythmzz Academy of Dance: representing Team India at nATFEST Sri Lanka, 1,500+ participants at HDPL, Amazon & Sony IPL choreography, college certificate courses, and verified press coverage.',
  alternates: { canonical: `${SITE_URL}/events-achievements` },
  openGraph: {
    title: 'Events & Achievements | Rhythmzz Academy of Dance',
    description:
      'Representing Team India at nATFEST Sri Lanka, hosting Hyderabad Dance Premier League, choreographing for Amazon, Sony IPL, and educating across colleges since 2010.',
    url: `${SITE_URL}/events-achievements`,
    siteName: 'Rhythmzz Academy of Dance',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function EventsAchievementsPage() {
  return (
    <PublicPage>
      <EventsAchievementsContent />

      <PublicBookTrialCta
        title="Ready to Start Your Dance Journey with Champions?"
        description="Every new student receives one complimentary trial class with personal feedback from certified faculty. Zero admission fees."
      />
    </PublicPage>
  );
}
