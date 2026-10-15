'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, MessageCircle, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { type Product, type ProductCategory, buildWhatsAppOrderLink } from '@/data/products';
import { cn } from '@/lib/utils/cn';

interface GearStorefrontProps {
  initialProducts: Product[];
  embedded?: boolean;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Gear' },
  { id: 'teen', label: 'Teen' },
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'accessories', label: 'Accessories' },
];

export function GearStorefront({ initialProducts, embedded = false }: GearStorefrontProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    initialProducts.forEach((p) => {
      defaults[p.id] = p.sizes[0] || 'M';
    });
    return defaults;
  });
  const [orderModal, setOrderModal] = useState<{
    open: boolean;
    productName: string;
    size: string;
    price: number;
    whatsappUrl: string;
  } | null>(null);

  const filteredProducts = initialProducts.filter((product) => {
    if (activeCategory === 'all') return true;
    return product.category === activeCategory;
  });

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleOrderClick = (product: Product) => {
    const chosenSize = selectedSizes[product.id] || product.sizes[0] || 'M';
    const link = buildWhatsAppOrderLink(product, chosenSize);

    // Open WhatsApp directly
    if (typeof window !== 'undefined') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }

    // Display standardized one-response confirmation modal
    setOrderModal({
      open: true,
      productName: product.name,
      size: chosenSize,
      price: product.price,
      whatsappUrl: link,
    });
  };

  return (
    <section id="gear" className={cn('relative bg-canvas text-ink py-16 sm:py-24', embedded && 'pt-12 sm:pt-16')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-bl/10 border border-bl/20 text-bl text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} className="text-bl" />
              <span>Rhythmzz Gear Collection</span>
            </div>
            <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-ink uppercase tracking-tight leading-none">
              Wear the <span className="text-bl">brand.</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink-2 max-w-xl font-body leading-relaxed">
              Every class. Every city. Official academy dancewear and performance merchandise designed for dancers, movement artists, and fitness enthusiasts.
            </p>
          </div>

          {/* Quick Support Badge */}
          <div className="flex items-center gap-3 p-3.5 rounded-md border border-line bg-surface shrink-0">
            <div className="w-9 h-9 rounded-md bg-bl/10 flex items-center justify-center text-bl">
              <MessageCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-ink-3">Instant Ordering</p>
              <p className="text-xs font-bold text-ink">WhatsApp Desk Automation</p>
            </div>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto py-8 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? initialProducts.length
                : initialProducts.filter((p) => p.category === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'h-10 min-h-[40px] px-4 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl',
                  isActive
                    ? 'bg-ink text-canvas border border-ink shadow-sm'
                    : 'bg-surface text-ink-2 border border-line hover:border-ink/30 hover:text-ink'
                )}
                aria-pressed={isActive}
              >
                <span>{cat.label}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded font-mono',
                    isActive ? 'bg-canvas text-ink' : 'bg-canvas-muted text-ink-3'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid: Minimalist, Uniform Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const chosenSize = selectedSizes[product.id] || product.sizes[0] || 'M';

            return (
              <article
                key={product.id}
                className="group relative flex flex-col rounded-md border border-line bg-surface hover:border-bl/40 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {/* Image Container with Consistent 3:4 Aspect Ratio */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-canvas-muted/80 to-surface border-b border-line flex items-center justify-center p-4">
                  {/* Category / Collection Pill */}
                  <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-ink text-canvas shadow-sm">
                    {product.tag || product.category}
                  </span>

                  {/* Artwork / Mockup */}
                  <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={320}
                      height={400}
                      className="w-full h-full object-contain drop-shadow-md"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Product Meta & Size Controls */}
                <div className="flex flex-col flex-1 p-5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3">
                    {product.category} Collection
                  </span>
                  <h3 className="font-anton text-xl tracking-tight text-ink uppercase line-clamp-1 mt-0.5">
                    {product.name}
                  </h3>
                  <p className="text-xs text-ink-2 line-clamp-2 mt-1 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Interactive Size Selection */}
                  <div className="mt-4 pt-3 border-t border-line/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3 font-bold">
                        Select Size
                      </span>
                      <span className="text-[10px] font-mono text-bl font-semibold">
                        Selected: {chosenSize}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {product.sizes.map((size) => {
                        const isSelected = chosenSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSelectSize(product.id, size)}
                            className={cn(
                              'h-8 min-w-[2.25rem] px-2 rounded text-[11px] font-mono font-bold uppercase transition-all duration-150 flex items-center justify-center cursor-pointer',
                              isSelected
                                ? 'bg-bl text-blk border border-bl shadow-xs font-extrabold'
                                : 'bg-canvas text-ink-2 border border-line hover:border-ink/40'
                            )}
                            aria-label={`Select size ${size}`}
                            aria-pressed={isSelected}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price & Uniform CTA Button */}
                  <div className="mt-5 pt-3 border-t border-line flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] font-mono uppercase text-ink-3 font-medium">Price</span>
                      <div className="text-right">
                        <span className="font-anton text-2xl text-ink tracking-tight">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Standardized Button Size across all cards */}
                    <button
                      type="button"
                      onClick={() => handleOrderClick(product)}
                      className="h-11 min-h-[44px] w-full rounded-md font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-bl text-blk hover:bg-bl-deep transition-all duration-150 cursor-pointer shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bl"
                    >
                      <MessageCircle size={15} className="fill-current" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Brand Promise Strip */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-line">
          <div className="flex items-start gap-3.5 p-4 rounded-md border border-line bg-surface">
            <div className="w-10 h-10 rounded-md bg-bl/10 flex items-center justify-center text-bl shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink uppercase font-mono tracking-wider">
                Studio-Grade Fabric
              </h4>
              <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                100% moisture-wicking and ultra-stretch cotton blends tested rigorously during high-intensity rehearsals.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-md border border-line bg-surface">
            <div className="w-10 h-10 rounded-md bg-bl/10 flex items-center justify-center text-bl shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink uppercase font-mono tracking-wider">
                Studio Pickup or Courier
              </h4>
              <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                Direct pickup at our Defence Colony academy or same-day dispatch via local courier across Hyderabad.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-md border border-line bg-surface">
            <div className="w-10 h-10 rounded-md bg-bl/10 flex items-center justify-center text-bl shrink-0">
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink uppercase font-mono tracking-wider">
                Hassle-Free Size Exchange
              </h4>
              <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                Unworn gear with original tags can be easily swapped for alternate sizing directly at the studio desk.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {orderModal && orderModal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blk/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-md border border-line bg-canvas p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-bl/15 text-bl flex items-center justify-center">
              <Check size={24} className="stroke-[3]" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-bl">
                Order Enquiry Initiated
              </span>
              <h3 className="font-anton text-2xl text-ink uppercase tracking-tight">
                Your order is with our desk
              </h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                WhatsApp has been launched with your exact order details pre-filled.
              </p>
            </div>

            <div className="p-4 rounded-md border border-line bg-surface text-left space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-ink-3">Product:</span>
                <span className="font-bold text-ink">{orderModal.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-3">Size:</span>
                <span className="font-bold text-bl">{orderModal.size}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-line/60">
                <span className="text-ink-3">Price:</span>
                <span className="font-bold text-ink text-sm">₹{orderModal.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 rounded bg-bl/5 border border-bl/20 text-[11px] text-ink-2 text-left">
              <strong>Notice:</strong> Your order has been received. Our studio team is working to verify availability and confirm your payment / dispatch options immediately.
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={orderModal.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 min-h-[44px] w-full rounded-md font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-bl text-blk hover:bg-bl-deep transition-colors"
              >
                <MessageCircle size={15} />
                <span>Open WhatsApp Again</span>
              </a>
              <button
                type="button"
                onClick={() => setOrderModal(null)}
                className="h-10 min-h-[40px] w-full rounded-md font-mono text-xs font-bold uppercase tracking-wider text-ink-2 border border-line hover:bg-surface transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
