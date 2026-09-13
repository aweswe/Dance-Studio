import { Metadata } from 'next';
import { getGalleryImages } from '@/data/gallery';
import { GalleryClient } from '@/components/public/gallery-client';
import { SITE_URL } from '@/lib/utils/constants';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Gallery — Stage & Studio Archive | Rhythmzz Academy',
  description: 'Photos and captures from our dance classes, live concerts, and international festival tours at Neredmet X Road, Secunderabad.',
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
      
      {/* Hero with Monumental Typography */}
      <section className="relative overflow-hidden py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 text-center border-b border-line bg-canvas">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#7C5CFC] uppercase font-bold">
            STAGE PERFORMANCES · TOURS · STUDIO ARCHIVE
          </div>
          <h1 className="font-anton text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-ink leading-[0.92] tracking-tight uppercase">
            THE VISUAL REEL &amp; ARCHIVE
          </h1>
          <p className="text-ink-2 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto pt-2">
            Stage captures, studio technique sessions, workshops, and international festival tours since 2010.
          </p>
        </div>
      </section>

      {/* Spacious Gallery Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto min-h-[60vh]">
        <Reveal y={20}>
          <GalleryClient images={images} />
        </Reveal>
      </section>
    </div>
  );
}
