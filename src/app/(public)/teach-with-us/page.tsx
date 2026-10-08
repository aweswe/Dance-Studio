import { Metadata } from 'next';
import { ArrowUpRight, CheckCircle2, GraduationCap, Heart, Sparkles, Users } from 'lucide-react';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { TeachWithUsForm } from '@/components/public/teach-with-us-form';
import { sectionGap, sectionPadAfterTitleLg, sectionPadLg } from '@/lib/ui/section-layout';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Teach With Us | Join Our Faculty | Rhythmzz Academy of Dance',
  description:
    'Join Rhythmzz Academy of Dance in Secunderabad as a resident trainer, classical guru, or guest choreographer. Submit your dance faculty application.',
  alternates: { canonical: `${SITE_URL}/teach-with-us` },
};

const PERKS = [
  {
    icon: Sparkles,
    title: 'Professional Floors',
    description: '1,200 sq. ft. rehearsal space with Marley dance floor, full mirrors, and acoustic sound.',
  },
  {
    icon: Users,
    title: 'Engaged Students',
    description: 'Over 3,000 students trained across East Hyderabad, from eager beginners to stage performers.',
  },
  {
    icon: GraduationCap,
    title: 'IAO Standard',
    description: 'Telangana’s IAO-accredited dance institution with annual showcases, exams, and certifications.',
  },
  {
    icon: Heart,
    title: 'Respect & Growth',
    description: 'A transparent, collaborative studio culture that values your artistry, time, and pedagogy.',
  },
];

export default function TeachWithUsPage() {
  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow="Careers & Faculty"
        title="Teach With"
        accent="Us."
        description="We are always looking for dedicated dance educators, classical gurus, gymnastics coaches, and guest choreographers to join our teaching roster."
      />

      <HomepageSection className={sectionPadAfterTitleLg}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="rounded-md border border-line bg-surface p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-md bg-bl/10 text-bl flex items-center justify-center mb-3">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-anton text-lg uppercase tracking-tight text-ink mb-1.5">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-ink-2 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </HomepageSection>

      <HomepageSection className={sectionPadLg}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 space-y-5">
            <HomepageSectionHeading
              eyebrow="Application"
              title="Join The Floor"
              description="Tell us about your movement background, teaching philosophy, and preferred styles. Our artistic director will connect with you for a studio audition or interview."
              className="mb-0"
            />

            <div className="rounded-md border border-line bg-surface p-5 space-y-3">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-bl">
                What We Look For
              </h4>
              <ul className="space-y-2 text-xs text-ink-2">
                {[
                  'Formal dance training or equivalent performance credentials in your discipline.',
                  'Patient, encouraging teaching approach with clear technical feedback.',
                  'Punctuality and commitment to student progression and batch regularity.',
                  'Openness to collaborative stage choreography for annual recitals.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-bl shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <TeachWithUsForm />
          </div>
        </div>
      </HomepageSection>
    </PublicPage>
  );
}
