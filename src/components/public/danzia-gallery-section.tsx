'use client';

import Image from 'next/image';

const MOMENTS = [
  {
    title: 'Stage Horizon Leap',
    image: '/images/studio-training/studio-leaps.jpg',
    span: 'col-span-1 md:col-span-7 aspect-[16/10]',
  },
  {
    title: 'Theatrical Partner Lift',
    image: '/images/bento/bento-acrobat.png',
    span: 'col-span-1 md:col-span-5 aspect-[16/10] md:aspect-auto',
  },
  {
    title: 'Classical Natya Mudra',
    image: '/images/srilanka-tour/raasta-stage-5.jpg',
    span: 'col-span-1 md:col-span-4 aspect-[4/3] md:aspect-auto',
  },
  {
    title: 'Rehearsal Focus',
    image: '/images/studio-training/studio-technique.jpg',
    span: 'col-span-1 md:col-span-4 aspect-[4/3] md:aspect-auto',
  },
  {
    title: 'Concert Lighting & Arena',
    image: '/images/bento/bento-stage.png',
    span: 'col-span-1 md:col-span-4 aspect-[4/3] md:aspect-auto',
  },
];

export function DanziaGallerySection() {
  return (
    <section className="w-full px-4 sm:px-8 md:px-14 py-20 sm:py-28 max-w-[1440px] mx-auto select-none">
      {/* Editorial Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-ink uppercase leading-[0.92]">
          SNAPSHOTS OF MOVEMENT AND MAGIC
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-ink-2 mt-5 leading-relaxed max-w-2xl font-medium">
          Explore moments from our performances, rehearsals, and behind-the-scenes memories.
        </p>
      </div>

      {/* Cinematic Mosaic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {MOMENTS.map((item, idx) => (
          <div
            key={idx}
            className={`group relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#000000] shadow-lg min-h-[260px] sm:min-h-[320px] ${item.span}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center grayscale contrast-115 brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
          </div>
        ))}
      </div>
    </section>
  );
}
