import { Metadata } from 'next';
import { getProgrammes } from '@/data/programmes';
import { getBatches } from '@/data/batches';
import { EnrolForm } from '@/components/public/enrol-form';
import { SITE_URL, ACADEMY, parseEnrolIntent } from '@/lib/utils/constants';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { homepageCtaWhatsApp } from '@/lib/ui/homepage-cta';
import { sectionGap, sectionPadAfterTitleLg } from '@/lib/ui/section-layout';
import { cn } from '@/lib/utils/cn';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string; intent?: string }>;
}): Promise<Metadata> {
  const { intent } = await searchParams;
  const isPay = parseEnrolIntent(intent) === 'pay';
  return {
    title: isPay ? 'Enrol & Pay | Rhythmzz Academy' : 'Enrol — Free Trial Class | Rhythmzz Academy',
    description: isPay
      ? 'Enrol at Rhythmzz Academy of Dance, Neredmet X Road, Secunderabad. Pay the first month or quarter online and join your batch.'
      : 'Book your free trial class at Rhythmzz Academy of Dance, Neredmet X Road, Secunderabad. Kids Dance, Adults Dance, Mind & Body Fitness and Kuchipudi. No registration fee.',
    alternates: { canonical: `${SITE_URL}/enrol` },
  };
}

export default async function EnrolPage({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string; intent?: string }>;
}) {
  const [programmes, batches, params] = await Promise.all([
    getProgrammes(),
    getBatches(),
    searchParams,
  ]);
  const intent = parseEnrolIntent(params.intent);
  const isPay = intent === 'pay';

  return (
    <PublicPage>
      <PublicPageTitle
        eyebrow={isPay ? 'Enrol' : 'Free trial'}
        title={isPay ? 'Enrol and pay' : 'Book your first class'}
        description={
          isPay
            ? 'Pay the first month or quarter from here. If checkout is down, we finish on WhatsApp. Use this mobile number to log into the student portal.'
            : 'First class is free. No admission fee. We confirm the slot on WhatsApp after you send the form.'
        }
      />

      <HomepageSection className={sectionPadAfterTitleLg}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7">
            <EnrolForm
              key={`${intent}-${params.programme ?? ''}`}
              programmes={programmes}
              batches={batches}
              defaultProgramme={params.programme}
              intent={intent}
            />
          </div>

          <div className={cn('lg:col-span-5 lg:sticky lg:top-24 flex flex-col', sectionGap)}>
            {[
              {
                n: '01',
                title: isPay ? 'Pay to join the batch' : '100% free trial',
                body: isPay
                  ? 'Monthly or quarterly fees match the pricing card. Receipts land on the student portal after confirmation.'
                  : 'No admission or registration fee. Experience the coaching before deciding.',
              },
              {
                n: '02',
                title: 'WhatsApp coordination',
                body: 'The desk confirms your batch timing and sends directions immediately.',
              },
              {
                n: '03',
                title: 'Sprung floor studio',
                body: '1,200 sq. ft. air-conditioned rehearsal floor with full-length mirrors and sound system.',
              },
            ].map((item) => (
              <div key={item.n} className="rounded-md border border-line bg-surface p-4 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-md bg-bl/10 text-bl flex items-center justify-center shrink-0 text-xs font-bold">
                  {item.n}
                </div>
                <div>
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">{item.title}</h2>
                  <p className="text-sm text-ink-2 mt-0.5 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}

            <div className="rounded-md border border-line bg-surface p-6 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-ink-3 block mb-0.5">Need guidance?</span>
                <p className="text-xs font-bold text-ink">Call or WhatsApp us directly</p>
              </div>
              <a
                href={ACADEMY.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={homepageCtaWhatsApp}
              >
                Chat
              </a>
            </div>
          </div>
        </div>
      </HomepageSection>
    </PublicPage>
  );
}
