import { Metadata } from 'next';
import { getGalleryImages } from '@/data/gallery';
import { GalleryClient } from '@/components/public/gallery-client';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from our dance classes, performances and events at Neredmet X Road, Secunderabad.',
  alternates: { canonical: 'https://www.rhythmzzdance.com/gallery' },
};

export default async function GalleryPage() {
  const images = await getGalleryImages(100);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Rhythmzz Academy Gallery",
    "description": "Photos of dance classes and events at Rhythmzz Academy.",
    "url": "https://www.rhythmzzdance.com/gallery",
    "image": ((images ?? []) as any[]).slice(0, 5).map((img: any) => img.url)
  };

  return (
    <div className="bg-white">
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
        <GalleryClient images={images} />
      </section>
    </div>
  );
}
