import { Metadata } from 'next';
import { getGalleryImages } from '@/data/gallery';
import { GalleryClient } from '@/components/public/gallery-client';
import { SITE_URL } from '@/lib/utils/constants';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from our dance classes, performances and events at Neredmet X Road, Secunderabad.',
  alternates: { canonical: `${SITE_URL}/gallery` },
};

export default async function GalleryPage() {
  const images = await getGalleryImages(100);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Rhythmzz Academy Gallery",
    "description": "Photos of dance classes and events at Rhythmzz Academy.",
    "url": `${SITE_URL}/gallery`,
    "image": ((images ?? []) as any[]).slice(0, 5).map((img: any) => img.url)
  };

  return (
    <div className="bg-canvas text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <section className="bg-blk text-white py-20 px-6 md:px-16 text-center">
        <h1 className="heading-display text-5xl md:text-7xl mb-4">OUR GALLERY</h1>
        <p className="text-white/60 max-w-2xl mx-auto">
          Moments captured in our studios, during performances, and at our special events.
        </p>
      </section>

      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto min-h-[60vh]">
        <Reveal y={20}>
          <GalleryClient images={images} />
        </Reveal>
      </section>
    </div>
  );
}
