import { Metadata } from 'next';
import { getGalleryImages } from '@/data/gallery';
import { GalleryClient } from '@/components/public/gallery-client';
import { HomepageSection } from '@/components/public/homepage-section';
import { PublicBookTrialCta } from '@/components/public/public-book-trial-cta';
import { PublicPage } from '@/components/public/public-page';
import { PublicPageTitle } from '@/components/public/public-page-title';
import { sectionPadAfterTitleLg } from '@/lib/ui/section-layout';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Gallery — Stage & Studio Archive | Rhythmzz Academy',
  description: 'Photos and captures from our dance classes, live concerts, and international festival tours at Neredmet X Road, Secunderabad.',
  alternates: { canonical: `${SITE_URL}/gallery` },
};

export default async function GalleryPage() {
  const images = await getGalleryImages(100);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Rhythmzz Academy Gallery',
    description: 'Photos of dance classes and events at Rhythmzz Academy.',
    url: `${SITE_URL}/gallery`,
    image: ((images ?? []) as { url: string }[]).slice(0, 5).map((img) => img.url),
  };

  return (
    <PublicPage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PublicPageTitle
        eyebrow="Stage · tours · studio"
        title="Gallery"
        description="Stage captures, studio technique sessions, workshops, and international festival tours since 2010."
      />

      <HomepageSection className={sectionPadAfterTitleLg}>
        <GalleryClient images={images} />
      </HomepageSection>

      <PublicBookTrialCta />
    </PublicPage>
  );
}
