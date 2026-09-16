'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { HomepageSection } from '@/components/public/homepage-section';
import { homepageCardRadius, homepageFilterPill } from '@/lib/ui/homepage-cta';
import { sectionGap } from '@/lib/ui/section-layout';
import { ACADEMY } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

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
            <header className="mb-7 sm:mb-10 max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bl mb-2">
                Voices from the floor
              </p>
              <h2 className="font-anton text-2xl sm:text-3xl md:text-[2.25rem] uppercase leading-[0.95] tracking-tight text-ink">
                <span className="block whitespace-nowrap">What our parents</span>
                <span className="block">
                  &amp; <span className="text-bl">students say</span>
                </span>
              </h2>
              <p className="mt-2.5 text-sm text-ink-2 leading-relaxed">
                Google has 480 of these. Here are three we hear in the parking lot.
              </p>
            </header>

            <div className={cn('flex flex-wrap items-center', sectionGap)}>
              {(['all', 'parent', 'student'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilter(cat);
                    setCurrentIndex(0);
                  }}
                  className={homepageFilterPill(filter === cat, 'px-4 py-1.5 tracking-[0.1em]')}
                >
                  {cat === 'all' ? 'All stories' : cat === 'parent' ? 'Parents' : 'Students'}
                </button>
              ))}
            </div>
          </div>

          <div
            className={cn(
              homepageCardRadius,
              'bg-surface border border-line p-6 sm:p-7 mt-6 flex flex-col',
              sectionGap,
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white border border-line shadow-sm"
                  aria-hidden
                >
                  <GoogleMark className="h-5 w-5" />
                </span>
                <div className="flex items-center gap-1 text-gold" aria-hidden>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-gold text-gold shrink-0" />
                  ))}
                </div>
              </div>
              <span className="font-anton text-2xl text-ink tracking-tight shrink-0 tabular-nums">
                {ACADEMY.googleRating} / 5.0
              </span>
            </div>
            <div className="border-t border-line pt-3 flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-3">
                {ACADEMY.googleReviewCount}+ Google reviews
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-bl font-semibold shrink-0">
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
              <div className="min-w-0">
                <h4 className="font-anton text-xl sm:text-2xl uppercase tracking-wide text-ink leading-none">
                  {current.author}
                </h4>
                <span className="text-xs sm:text-sm font-mono text-ink-2 mt-1 block">{current.role}</span>
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
