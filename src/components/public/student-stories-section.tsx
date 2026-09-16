'use client';

import { Star, Quote } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  batch: string;
  tenure: string;
  quote: string;
  rating: number;
}

const REVIEWS: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Ananya Sharma',
    role: 'Student · Adults Urban Batch',
    batch: 'Hip Hop & Bolly-Hop',
    tenure: '2 Years at Studio',
    quote:
      'Joining Rhythmzz completely changed my stage confidence. The faculty doesn’t just teach routine moves — they break down musicality, bounce, and body weight. Performing live at Natfest was an unforgettable milestone.',
    rating: 5,
  },
  {
    id: 't-2',
    name: 'Kavitha & Rajesh Reddy',
    role: 'Parents of Rohan (Age 10)',
    batch: 'Kids Foundation & Acrobatics',
    tenure: '3 Years at Studio',
    quote:
      'The discipline and warmth here are unmatched. Rohan was shy, but Kajal ma’am and Nitish sir nurtured his flexibility and rhythm so lovingly. He now leads his school dance team with immense pride!',
    rating: 5,
  },
  {
    id: 't-3',
    name: 'Pooja Varma',
    role: 'Diploma Candidate',
    batch: 'Kuchipudi Classical 10-Yr Syllabus',
    tenure: '4 Years at Studio',
    quote:
      'Srusti ma’am teaches the pure Vempati parampara with rigorous attention to hastas and padabhedas. The certified exams and stage recitals give us genuine government-recognized artistic credentials.',
    rating: 5,
  },
];

export function StudentStoriesSection() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-10 py-24 sm:py-24 max-w-[1440px] mx-auto select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-bl font-bold">
              07 · Student Stories &amp; Growth
            </span>
          </div>
          <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl text-ink tracking-wide uppercase leading-[0.92]">
            TESTIMONIALS &amp; STAGE REVIEWS
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-2 bg-surface px-4 py-2 rounded-md border border-line">
          <div className="flex text-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-gold" />
            ))}
          </div>
          <span className="font-bold text-ink">4.9 / 5.0</span>
          <span>· 480+ Google Reviews</span>
        </div>
      </div>

      {/* 3-Column Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="rounded-md p-7 sm:p-8 bg-surface border border-line hover:border-bl transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1.5"
          >
            {/* Top Stars & Verified Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex text-gold">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-gold" />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-bl font-bold">
                  
                  <span>Verified Dancer</span>
                </div>
              </div>

              {/* Quote Body */}
              <p className="text-sm sm:text-base text-ink/85 leading-relaxed font-medium mb-6">
                &ldquo;{review.quote}&rdquo;
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 border-t border-line flex items-center justify-between">
              <div>
                <h4 className="font-anton text-lg tracking-wide uppercase text-ink">
                  {review.name}
                </h4>
                <p className="text-xs text-ink-2 font-mono">
                  {review.role}
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-md">
                {review.tenure}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
