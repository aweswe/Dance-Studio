'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ShoppingBag, Clock } from 'lucide-react';
import { type Product, DEFAULT_PRODUCTS, resolveProductImageUrl } from '@/data/products';
import { formatCurrency, whatsappLink } from '@/lib/utils/format';

interface HomepageEcomSectionProps {
  mode?: 'coming_soon' | 'live';
  products?: Product[];
}

export function HomepageEcomSection({
  mode = 'coming_soon',
  products = DEFAULT_PRODUCTS,
}: HomepageEcomSectionProps) {
  const isComingSoon = mode === 'coming_soon';

  const displayProducts = (products && products.length > 0 ? products : DEFAULT_PRODUCTS)
    .filter((p) => p.isActive)
    .slice(0, 4);

  const notifyWaHref = whatsappLink(
    'Hi Rhythmzz Academy, please notify me when the official studio gear and dancewear collection drops.'
  );

  return (
    <section className="w-full py-16 sm:py-24 border-t border-line bg-canvas relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        {isComingSoon ? (
          /* ── COMING SOON: ZERO PRODUCTS, PURE MINIMAL EDITORIAL TEASER ── */
          <div className="relative rounded-xl border border-line bg-surface p-8 sm:p-14 md:p-20 text-center shadow-xs overflow-hidden">
            {/* Subtle background glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bl/15 via-transparent to-transparent"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-bl/10 text-bl border border-bl/25">
                <ShoppingBag size={13} strokeWidth={2.2} />
                <span>Official Studio Merch · Drop 01</span>
              </div>

              {/* Big Bold Typographic Statement */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-ink-3">
                  Rhythmzz Academy of Dance
                </p>
                <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-ink leading-[0.95]">
                  OFFICIAL GEAR <span className="text-bl">COMING SOON</span>
                </h2>
              </div>

              {/* Editorial Description */}
              <p className="text-sm sm:text-base md:text-lg text-ink-2 max-w-2xl mx-auto leading-relaxed font-body">
                Our custom line of studio dancewear, breathable rehearsal layers, dance grip socks, and classical stage accessories is currently in production. Built specifically for daily academy training and stage showcases.
              </p>

              {/* Upcoming Category Tags (No products, just clean labels) */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-2">
                {[
                  'Rehearsal Hoodies',
                  'Performance Activewear',
                  'Dance Grip Socks',
                  'Classical Stage Gear',
                ].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-canvas border border-line text-ink-2"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={notifyWaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-6 rounded-md font-bold text-xs uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors shadow-xs active:scale-[0.98] w-full sm:w-auto"
                >
                  <span>Notify Me on WhatsApp</span>
                  <ArrowUpRight size={15} strokeWidth={2.2} />
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-6 rounded-md font-bold text-xs uppercase tracking-wider bg-canvas border border-line text-ink hover:border-ink/40 transition-colors active:scale-[0.98] w-full sm:w-auto"
                >
                  <span>Studio Desk Inquiry</span>
                </Link>
              </div>

              {/* Status Note */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-mono text-ink-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Batch 01 in production · Academy students receive priority pre-order access</span>
              </div>
            </div>
          </div>
        ) : (
          /* ── LIVE STORE: FULL PRODUCTS SHOWCASE ── */
          <div>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-bl/10 text-bl border border-bl/30">
                    <ShoppingBag size={12} />
                    Official Studio Store
                  </span>
                </div>
                <h2 className="font-anton text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-ink">
                  Rhythmzz Merch &amp; Gear
                </h2>
                <p className="text-sm sm:text-base text-ink-2 font-body leading-relaxed">
                  Studio-grade apparel, breathable warmup gear, and authentic classical dance accessories built for daily rehearsals and stage showcases.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/gear"
                  className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-5 rounded-md font-bold text-xs uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors shadow-xs active:scale-[0.98]"
                >
                  <span>Shop All Gear</span>
                  <ArrowRight size={16} strokeWidth={2.2} />
                </Link>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {displayProducts.map((product) => {
                const imgUrl = resolveProductImageUrl(product.imageUrl);

                return (
                  <div
                    key={product.id}
                    className="group relative rounded-md border border-line bg-surface overflow-hidden shadow-2xs hover:shadow-md hover:border-bl/50 transition-all flex flex-col"
                  >
                    {/* Visual Cover */}
                    <div className="relative aspect-square w-full bg-canvas-muted overflow-hidden">
                      <Image
                        src={imgUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/75 text-white backdrop-blur-md border border-white/15">
                          {product.tag || product.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-surface">
                      <div>
                        <h3 className="font-anton text-lg uppercase tracking-wide text-ink group-hover:text-bl transition-colors truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-ink-3 line-clamp-2 mt-1 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-line-subtle flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-ink-3 uppercase block">Studio Price</span>
                          <span className="font-anton text-lg text-ink">
                            {formatCurrency(product.price)}
                          </span>
                        </div>

                        <Link
                          href="/gear"
                          className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-bl hover:underline cursor-pointer"
                        >
                          <span>View</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
