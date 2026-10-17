import { Metadata } from 'next';
import { EventsAchievementsContent } from '@/components/public/events-achievements-content';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { PublicPage } from '@/components/public/public-page';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Achievements & Press | Rhythmzz Academy of Dance',
  description:
    'Explore major historic milestones of Rhythmzz Academy of Dance: contemporary workshops in Canada, representing Team India at nATFEST Sri Lanka, 1,500+ participants at HDPL, Amazon & Sony IPL choreography, and verified press coverage.',
  alternates: { canonical: `${SITE_URL}/events-achievements` },
  openGraph: {
    title: 'Achievements & Press | Rhythmzz Academy of Dance',
    description:
      'Contemporary workshops in Canada, representing Team India at nATFEST Sri Lanka, hosting Hyderabad Dance Premier League, choreographing for Amazon, and verified press coverage.',
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
