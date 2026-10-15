import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PRODUCTS,
  MAX_CATALOG_PRODUCTS,
  buildWhatsAppOrderLink,
  getProducts,
} from '@/data/products';
import { ACADEMY } from '@/lib/utils/constants';

describe('Rhythmzz Gear & Merch Catalog', () => {
  it('launches with exactly 10 default curated products', () => {
    expect(DEFAULT_PRODUCTS).toHaveLength(10);
    expect(MAX_CATALOG_PRODUCTS).toBe(10);
  });

  it('ensures all products have valid pricing, category, and size options', () => {
    for (const p of DEFAULT_PRODUCTS) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.price).toBeGreaterThan(0);
      expect(['teen', 'women', 'men', 'accessories']).toContain(p.category);
      expect(p.sizes.length).toBeGreaterThan(0);
      expect(p.imageUrl).toMatch(/^(https?:\/\/|\/gear\/).*/);
      expect(p.isActive).toBe(true);
    }
  });

  it('correctly resolves legacy .webp paths to working .svg and preserves external URLs', async () => {
    const { resolveProductImageUrl } = await import('@/data/products');
    expect(resolveProductImageUrl('/gear/dance-tee.webp')).toBe('/gear/dance-tee.svg');
    expect(resolveProductImageUrl('/gear/studio-hoodie.webp')).toBe('/gear/studio-hoodie.svg');
    expect(resolveProductImageUrl('https://images.unsplash.com/photo-123')).toBe('https://images.unsplash.com/photo-123');
    expect(resolveProductImageUrl('')).toBe('/gear/dance-tee.svg');
    expect(resolveProductImageUrl(null)).toBe('/gear/dance-tee.svg');
  });

  it('correctly constructs automated WhatsApp message with pre-filled details', () => {
    const testProduct = { name: 'Rhythmzz Core Hoodie', price: 1499 };
    const link = buildWhatsAppOrderLink(testProduct, 'XL');

    const cleanPhone = ACADEMY.phone.replace(/[^0-9]/g, '');
    expect(link).toContain(`https://wa.me/${cleanPhone}?text=`);

    const decoded = decodeURIComponent(link.split('?text=')[1]);
    expect(decoded).toContain('Product: Rhythmzz Core Hoodie');
    expect(decoded).toContain('Size: XL');
    expect(decoded).toContain('Price: ₹1,499');
    expect(decoded).toContain('Please confirm availability and dispatch details');
  });

  it('falls back to "Standard" size if empty string passed to link builder', () => {
    const testProduct = { name: 'Studio Snapback Cap', price: 499 };
    const link = buildWhatsAppOrderLink(testProduct, '');
    const decoded = decodeURIComponent(link.split('?text=')[1]);
    expect(decoded).toContain('Size: Standard');
  });

  it('filters products by category and respects 10-product cap', async () => {
    const teenGear = await getProducts('teen');
    expect(teenGear.length).toBeGreaterThan(0);
    expect(teenGear.every((p) => p.category === 'teen')).toBe(true);

    const womenGear = await getProducts('women');
    expect(womenGear.length).toBeGreaterThan(0);
    expect(womenGear.every((p) => p.category === 'women')).toBe(true);

    const allGear = await getProducts('all');
    expect(allGear.length).toBeLessThanOrEqual(MAX_CATALOG_PRODUCTS);
  });
});
