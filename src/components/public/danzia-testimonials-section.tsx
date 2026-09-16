'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { HomepageSection, HomepageSectionHeading } from '@/components/public/homepage-section';
import { homepageCardRadius } from '@/lib/ui/homepage-cta';

interface DanziaTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  category: 'parent' | 'student';
  image: string;
  highlight: string;
}

const TESTIMONIALS: DanziaTestimonial[] = [
  {
    id: 'pooja',
    quote:
      'Nitish doesn’t let you hide at the back. I came from AS Rao Nagar twice a week and my isolations finally look like isolations.',
    author: 'Pooja Reddy',
    role: 'Adults Dance · AS Rao Nagar',
    category: 'student',
    image: '/images/class-1.jpg',
    highlight: 'Technique',
  },
  {
    id: 'suresh',
    quote:
      'Our daughter was seven and would not talk in class. By the recital she pulled the other kids into the formation. We live in Sainikpuri — the drive is nothing.',
    author: 'Suresh & Deepa',
    role: 'Parents · Kids Dance · Sainikpuri',
    category: 'parent',
    image: '/images/class-2.jpg',
    highlight: 'Confidence',
  },
  {
    id: 'ananya',
    quote:
      'Srusti will stop the class for a hasta. That is why I stayed. Friday 6:30, every week.',
    author: 'Ananya Sharma',
    role: 'Kuchipudi Classical · Malkajgiri',
    category: 'student',
    image: '/images/kuchipudi/kuchipudi-traditional-standing.jpg',
    highlight: 'Classical',
  },
];

export function DanziaTestimonialsSection({
  quotes,
}: {
  quotes?: { name?: string; quote?: string; programme?: string }[];
}) {
  const mapped: DanziaTestimonial[] =
    quotes && quotes.length > 0
      ? quotes.map((q, i) => ({
          id: `q-${i}`,
          quote: q.quote || '',
          author: q.name || 'Rhythmzz family',
          role: q.programme || 'Secunderabad',
          category: (q.programme || '').toLowerCase().includes('kid') ? 'parent' : 'student',
          image: TESTIMONIALS[i % TESTIMONIALS.length].image,
          highlight: q.programme || 'Studio',
        }))
      : TESTIMONIALS;

  const [filter, setFilter] = useState<'all' | 'parent' | 'student'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredList =
    filter === 'all' ? mapped : mapped.filter((item) => item.category === filter);

  const activeIndex = filteredList.length ? currentIndex % filteredList.length : 0;
  const current = filteredList[activeIndex];
  if (!current) return null;

  const prev = () => {
    setCurrentIndex((p) => (p === 0 ? filteredList.length - 1 : p - 1));
  };

  const next = () => {
    setCurrentIndex((p) => (p === filteredList.length - 1 ? 0 : p + 1));
  };

  return (
    <HomepageSection className="py-16 sm:py-24 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <HomepageSectionHeading
              eyebrow="05 · Voices from the floor"
              title="What our students &"
              accent="parents say"
              description="Google has 480 of these. Here are three we hear in the parking lot."
            />

            <div className="flex items-center gap-2 mb-8 -mt-2">
              {(['all', 'parent', 'student'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilter(cat);
                    setCurrentIndex(0);
                  }}
                  className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] transition-all cursor-pointer ${
                    filter === cat
                      ? 'bg-blk text-bl'
                      : 'bg-surface text-ink-2 border border-line hover:border-ink/40'
                  }`}
                >
                  {cat === 'all' ? 'All stories' : cat === 'parent' ? 'Parents' : 'Students'}
                </button>
              ))}
            </div>
          </div>

          <div className={`${homepageCardRadius} bg-surface border border-line p-6 sm:p-7 mt-6 flex flex-col justify-between gap-4`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-gold text-gold" />
                ))}
              </div>
              <span className="font-anton text-2xl text-ink tracking-tight">4.9 / 5.0</span>
            </div>
            <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-3">
                480+ Google Reviews
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-bl font-semibold">
                Secunderabad
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col">
          <div
            className={`relative ${homepageCardRadius} bg-light dark:bg-blk border border-line p-8 sm:p-10 md:p-12 flex-1 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-bl bg-bl/10 px-3 py-1.5 rounded-md border border-bl/20">
                {current.highlight}
              </span>
              <Quote size={24} className="text-bl/40 rotate-180" />
            </div>

            <blockquote className="text-lg sm:text-xl md:text-2xl text-ink font-serif italic leading-relaxed mb-8 sm:mb-10">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            <div className="pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-md overflow-hidden bg-blk border border-line shrink-0">
                  <Image
                    src={current.image}
                    alt={current.author}
                    fill
                    sizes="56px"
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-anton text-xl sm:text-2xl uppercase tracking-wide text-ink leading-none">
                    {current.author}
                  </h4>
                  <span className="text-xs sm:text-sm font-mono text-ink-2 mt-1">{current.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-ink-2 mr-1">
                  0{activeIndex + 1} / 0{filteredList.length}
                </span>
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md border border-line hover:border-ink bg-surface text-ink hover:bg-blk hover:text-bl transition-all cursor-pointer active:scale-95"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md border border-line hover:border-ink bg-surface text-ink hover:bg-blk hover:text-bl transition-all cursor-pointer active:scale-95"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomepageSection>
  );
}
