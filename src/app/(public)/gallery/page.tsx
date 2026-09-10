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
      
      {/* Hero with Generous Breathing Space */}
      <section className="relative overflow-hidden py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-16 text-center border-b border-line bg-canvas">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center mb-4 px-3.5 py-1 rounded-full border border-line bg-surface/80 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] inline-block mr-2" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FB923C] uppercase font-bold">
              STAGE PERFORMANCES · TOURS · STUDIO ARCHIVE
            </span>
          </div>
          <h1 className="heading-urban text-4xl sm:text-6xl md:text-7xl text-ink mb-6 leading-tight tracking-tight">
            THE VISUAL REEL &amp; ARCHIVE
          </h1>
          <p className="text-ink-2 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Stage captures, studio technique sessions, workshops, and international festival tours since 2010.
          </p>
        </div>
      </section>

      {/* Spacious Gallery Grid */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 max-w-6xl mx-auto min-h-[60vh]">
        <Reveal y={20}>
          <GalleryClient images={images} />
        </Reveal>
      </section>
    </div>
  );
}
