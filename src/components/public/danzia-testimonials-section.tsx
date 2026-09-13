'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

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
    id: 'linda',
    quote:
      'My daughter started as a shy 6-year-old — now she’s confident, expressive, and can’t wait to dance every single week. The teachers are nurturing and deeply professional. We’re so grateful for this creative home.',
    author: 'Linda M.',
    role: 'Parent of Tara (Kids & Foundations)',
    category: 'parent',
    image: '/images/danzia/card-1.webp',
    highlight: 'Confidence & Growth',
  },
  {
    id: 'chloe',
    quote:
      'I started contemporary classes here and felt welcome instantly. The supportive atmosphere pushed me to try new floorwork moves, and my musicality and stage presence grew more than I could ever imagine.',
    author: 'Chloe R.',
    role: 'Contemporary & Lyrical Dancer',
    category: 'student',
    image: '/images/danzia/card-3.webp',
    highlight: 'Musicality & Artistry',
  },
  {
    id: 'alex',
    quote:
      'The choreographers here are inspiring and always challenge us to express ourselves fully. It’s about true artistry, not just memorizing steps. This studio completely elevated my passion for live performance.',
    author: 'Alex K.',
    role: 'Urban Choreography & Hip Hop',
    category: 'student',
    image: '/images/class-1.jpg',
    highlight: 'Stage Expression',
  },
  {
    id: 'david',
    quote:
      'The studio provides top-notch technical training while genuinely prioritizing a warm, uplifting atmosphere. My son’s balance and form have improved rapidly, and he truly loves coming to dance.',
    author: 'David S.',
    role: 'Parent of Arjun (Acrobatics Batch)',
    category: 'parent',
    image: '/images/class-2.jpg',
    highlight: 'Form & Discipline',
  },
];

export function DanziaTestimonialsSection() {
  const [filter, setFilter] = useState<'all' | 'parent' | 'student'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredList =
    filter === 'all'
      ? TESTIMONIALS
      : TESTIMONIALS.filter((item) => item.category === filter);

  // Keep index within bounds if filter changes
  const activeIndex = currentIndex % filteredList.length;
  const current = filteredList[activeIndex];

  const prev = () => {
    setCurrentIndex((p) => (p === 0 ? filteredList.length - 1 : p - 1));
  };

  const next = () => {
    setCurrentIndex((p) => (p === filteredList.length - 1 ? 0 : p + 1));
  };

  return (
    <section className="w-full px-4 sm:px-8 md:px-14 py-20 sm:py-32 max-w-[1440px] mx-auto select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
        
        {/* ── LEFT COLUMN: Headline, 98% Satisfaction & Polaroid Accent ── */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Editorial Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#7C5CFC] font-bold">
               05 / VOICES FROM THE FLOOR
              </span>
            </div>

            {/* Monumental Headline */}
            <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight uppercase leading-[0.92] text-ink mb-6">
              WHAT OUR
              <br />
              <span className="text-[#7C5CFC]">STUDENTS &amp;</span>
              <br />
              PARENTS SAY
            </h2>

            <p className="text-sm sm:text-base text-ink-2 leading-relaxed mb-8 max-w-md font-medium">
              Real reflections from our dancers, parents, and community who have made Rhythmzz their second home.
            </p>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-8">
              {(['all', 'parent', 'student'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilter(cat);
                    setCurrentIndex(0);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    filter === cat
                      ? 'bg-[#000000] text-[#F5FB38] font-bold shadow-sm'
                      : 'bg-surface text-ink-2 border border-line hover:border-ink/40'
                  }`}
                >
                  {cat === 'all' ? 'All Stories' : cat === 'parent' ? 'Parents' : 'Students'}
                </button>
              ))}
            </div>
          </div>

          {/* Danzia-Inspired 98% Satisfaction Stat Block */}
          <div className="rounded-[28px] bg-[#000000] text-[#FAF6EE] p-7 sm:p-7 border border-white/10 shadow-xl mt-4">
            <div className="flex flex-col">
              <span className="font-anton text-5xl sm:text-6xl text-[#F5FB38] leading-none">
                98%
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#FAF6EE]/80 mt-1 font-bold">
                Student &amp; Parent Satisfaction
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Magazine Pull-Quote Card with Photo Accent ── */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative rounded-[32px] sm:rounded-[44px] bg-[#FAF6EE] dark:bg-[#0A0A0A] border border-line p-8 sm:p-12 md:p-14 shadow-2xl flex-1 flex flex-col justify-between transition-all duration-300">
            
            {/* Top Bar: Highlight Pill & Quote Glyph */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7C5CFC] font-bold bg-[#7C5CFC]/10 px-3.5 py-1.5 rounded-md border border-[#7C5CFC]/20">
                {current.highlight}
              </span>
              <Quote size={28} className="text-[#7C5CFC]/40 rotate-180" />
            </div>

            {/* Massive Italic Quote */}
            <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-ink font-serif italic leading-relaxed md:leading-snug mb-10">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            {/* Bottom Card Footer: Author Profile & Navigation Buttons */}
            <div className="pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              {/* Author Info with Thumbnail Photo */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#000000] border border-line shadow-md shrink-0">
                  <Image
                    src={current.image}
                    alt={current.author}
                    fill
                    sizes="56px"
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-anton text-2xl sm:text-3xl uppercase tracking-wide text-ink leading-none">
                    {current.author}
                  </h4>
                  <span className="text-xs sm:text-sm font-mono text-ink-2 mt-1">
                    {current.role}
                  </span>
                </div>
              </div>

              {/* Navigation Arrows & Counter */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-ink-2 mr-2">
                  0{activeIndex + 1} / 0{filteredList.length}
                </span>
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="w-12 h-12 rounded-full border border-line hover:border-ink bg-surface flex items-center justify-center text-ink hover:bg-[#000000] hover:text-[#F5FB38] transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="w-12 h-12 rounded-full border border-line hover:border-ink bg-surface flex items-center justify-center text-ink hover:bg-[#000000] hover:text-[#F5FB38] transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <ArrowRight size={18} />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
