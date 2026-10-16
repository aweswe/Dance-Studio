'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ShoppingBag } from 'lucide-react';
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
    'Hi Rhythmzz Academy, I would like to know more about the upcoming studio dancewear and merchandise.'
  );

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 border-t border-line bg-canvas">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {isComingSoon ? (
          /* ── COMING SOON: MINIMAL, HUMAN, MOBILE RESPONSIVE ── */
          <div className="rounded-lg border border-line bg-surface p-6 sm:p-10 md:p-14 text-center shadow-2xs">
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
              {/* Simple Eyebrow */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-bl/10 text-bl border border-bl/25">
                <ShoppingBag size={13} />
                <span>Official Studio Merchandise</span>
              </div>

              {/* Title */}
              <h2 className="font-anton text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-ink leading-tight">
                COMING <span className="text-bl">SOON</span>
              </h2>

              {/* Simple Natural Description */}
              <p className="text-sm sm:text-base text-ink-2 font-body leading-relaxed max-w-xl mx-auto">
                Official Rhythmzz dancewear, hoodies, and training apparel will be available soon. For inquiries or early orders, message us on WhatsApp.
              </p>

              {/* Action Buttons - Fully Mobile Responsive */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <a
                  href={notifyWaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-6 rounded-md font-bold text-xs uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors shadow-xs active:scale-[0.98] w-full sm:w-auto"
                >
                  <span>Inquire on WhatsApp</span>
                  <ArrowUpRight size={15} strokeWidth={2.2} />
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-6 rounded-md font-bold text-xs uppercase tracking-wider bg-canvas border border-line text-ink hover:border-ink/40 transition-colors active:scale-[0.98] w-full sm:w-auto"
                >
                  <span>Contact Studio</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* ── LIVE STORE: REAL PRODUCTS ── */
          <div>
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div className="space-y-1.5 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-bl/10 text-bl border border-bl/30">
                  <ShoppingBag size={12} />
                  Official Studio Store
                </span>
                <h2 className="font-anton text-2xl sm:text-4xl uppercase tracking-tight text-ink">
                  Rhythmzz Merch &amp; Gear
                </h2>
                <p className="text-xs sm:text-sm text-ink-2 font-body leading-relaxed">
                  Official dancewear and practice gear for academy students and dancers.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/gear"
                  className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-5 rounded-md font-bold text-xs uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors shadow-xs active:scale-[0.98] w-full sm:w-auto"
                >
                  <span>Shop All Gear</span>
                  <ArrowRight size={15} strokeWidth={2.2} />
                </Link>
              </div>
            </div>

            {/* Product Cards Grid - Responsive from 1 to 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/75 text-white backdrop-blur-md border border-white/15">
                          {product.tag || product.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-surface">
                      <div>
                        <h3 className="font-anton text-base sm:text-lg uppercase tracking-wide text-ink group-hover:text-bl transition-colors truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-ink-3 line-clamp-2 mt-1 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-line-subtle flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-ink-3 uppercase block">Price</span>
                          <span className="font-anton text-base sm:text-lg text-ink">
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
