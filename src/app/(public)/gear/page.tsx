import type { Metadata } from 'next';
import { SITE_URL, ACADEMY } from '@/lib/utils/constants';
import { getProducts } from '@/data/products';
import { GearStorefront } from '@/components/public/gear-storefront';
import { StructuredData } from '@/components/shared/structured-data';

export const metadata: Metadata = {
  title: 'Rhythmzz Gear — Wear The Brand | Official Dancewear & Merch',
  description: `Shop official ${ACADEMY.name} studio dancewear, sports bras, hoodies, and rehearsal track gear. Order instantly on WhatsApp with size selection.`,
  alternates: { canonical: `${SITE_URL}/gear` },
  openGraph: {
    title: 'Rhythmzz Gear — Wear The Brand',
    description: `Shop official ${ACADEMY.name} studio dancewear, sports bras, hoodies, and rehearsal track gear.`,
    url: `${SITE_URL}/gear`,
    siteName: ACADEMY.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function GearPage() {
  const products = await getProducts();

  return (
    <div className="relative bg-canvas text-ink min-h-screen">
      <StructuredData />
      <GearStorefront initialProducts={products} />
    </div>
  );
}
