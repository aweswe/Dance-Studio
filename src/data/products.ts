import { getPublicSupabase } from '@/lib/supabase/public';
import { ACADEMY } from '@/lib/utils/constants';

export type ProductCategory = 'all' | 'teen' | 'women' | 'men' | 'accessories';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'teen' | 'women' | 'men' | 'accessories';
  tag: string;
  price: number;
  sizes: string[];
  imageUrl: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

export const MAX_CATALOG_PRODUCTS = 10;

export function resolveProductImageUrl(url?: string | null, fallbackSvg: string = '/gear/dance-tee.svg'): string {
  if (!url || typeof url !== 'string') return fallbackSvg;
  const trimmed = url.trim();
  if (!trimmed) return fallbackSvg;
  // If a legacy .webp path was saved that does not exist on disk, map it to .svg
  if (trimmed.startsWith('/gear/') && trimmed.endsWith('.webp')) {
    return trimmed.replace('.webp', '.svg');
  }
  return trimmed;
}

/** Default launch catalog of 10 academy merchandise items */
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-teen-1',
    name: 'Rhythmzz Dance Tee',
    slug: 'teen-dance-tee',
    category: 'teen',
    tag: 'TEEN',
    price: 599,
    sizes: ['XS', 'S', 'M', 'L'],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    description: 'Signature lightweight, moisture-wicking studio tee with subtle Rhythmzz crest on the chest.',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'prod-teen-2',
    name: 'Studio Dance Shorts',
    slug: 'teen-dance-shorts',
    category: 'teen',
    tag: 'TEEN',
    price: 549,
    sizes: ['XS', 'S', 'M', 'L'],
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-stretch performance shorts built for high-kicks, floor work, and energetic rehearsals.',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'prod-women-1',
    name: 'Pro Studio Sports Bra',
    slug: 'women-sports-bra',
    category: 'women',
    tag: 'WOMEN',
    price: 699,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    description: 'Medium-impact compression bra with reinforced cross-back straps and breathable mesh panel.',
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'prod-women-2',
    name: 'Rhythmzz Warm-Up Jacket',
    slug: 'women-dance-jacket',
    category: 'women',
    tag: 'WOMEN',
    price: 1299,
    sizes: ['S', 'M', 'L', 'XL'],
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    description: 'Raglan-sleeve zipped track jacket with high collar and brushed fleece lining for warmups.',
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'prod-women-3',
    name: 'Active Movement Shorts',
    slug: 'women-active-shorts',
    category: 'women',
    tag: 'WOMEN',
    price: 649,
    sizes: ['XS', 'S', 'M', 'L'],
    imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
    description: 'High-waisted compression shorts with anti-ride silicone hem and hidden locker key pocket.',
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 'prod-men-1',
    name: 'Academy Track Tee',
    slug: 'men-track-tee',
    category: 'men',
    tag: 'MEN',
    price: 649,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    description: 'Athletic-cut breathable jersey tee with drop-tail hem and reflective Rhythmzz typography.',
    isActive: true,
    sortOrder: 6,
  },
  {
    id: 'prod-men-2',
    name: 'Pro Studio Track Pants',
    slug: 'men-track-pants',
    category: 'men',
    tag: 'MEN',
    price: 899,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
    description: 'Tapered rehearsal track pants with ankle zips, deep zippered side pockets, and drawstring waist.',
    isActive: true,
    sortOrder: 7,
  },
  {
    id: 'prod-men-3',
    name: 'Rhythmzz Core Hoodie',
    slug: 'men-studio-hoodie',
    category: 'men',
    tag: 'MEN',
    price: 1499,
    sizes: ['S', 'M', 'L', 'XL'],
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    description: 'Heavyweight 380 GSM organic cotton fleece pullover hoodie with kangaroo pouch and ribbed cuffs.',
    isActive: true,
    sortOrder: 8,
  },
  {
    id: 'prod-acc-1',
    name: 'Studio Snapback Cap',
    slug: 'unisex-studio-cap',
    category: 'accessories',
    tag: 'UNISEX',
    price: 499,
    sizes: ['FREE SIZE'],
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    description: 'Structured 6-panel cotton twill snapback cap featuring 3D embroidered Rhythmzz emblem.',
    isActive: true,
    sortOrder: 9,
  },
  {
    id: 'prod-acc-2',
    name: 'Canvas Duffle Studio Bag',
    slug: 'unisex-duffle-bag',
    category: 'accessories',
    tag: 'UNISEX',
    price: 799,
    sizes: ['STANDARD'],
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious 35L water-repellent canvas dance duffle with dedicated shoe tunnel and shoulder strap.',
    isActive: true,
    sortOrder: 10,
  },
];

/**
 * Builds direct WhatsApp URL with pre-filled order inquiry.
 * No checkout, no gateway, no manual typing required.
 */
export function buildWhatsAppOrderLink(
  product: Pick<Product, 'name' | 'price'>,
  selectedSize: string
): string {
  const cleanPhone = ACADEMY.phone.replace(/[^0-9]/g, '');
  const message = `Hi Rhythmzz Academy! I would like to order:

• Product: ${product.name}
• Size: ${selectedSize || 'Standard'}
• Price: ₹${product.price.toLocaleString('en-IN')}

Please confirm availability and dispatch details. Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Fetch active products from Supabase (or fallback to DEFAULT_PRODUCTS).
 * Enforces maximum of 10 products.
 */
export async function getProducts(category?: string): Promise<Product[]> {
  const supabase = getPublicSupabase();

  if (!supabase) {
    return filterAndLimitProducts(DEFAULT_PRODUCTS, category);
  }

  try {
    const query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(MAX_CATALOG_PRODUCTS);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return filterAndLimitProducts(DEFAULT_PRODUCTS, category);
    }

    const mapped: Product[] = data.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: item.category as Product['category'],
      tag: item.tag || 'GEAR',
      price: item.price,
      sizes: Array.isArray(item.sizes) && item.sizes.length > 0 ? item.sizes : ['M'],
      imageUrl: resolveProductImageUrl(item.image_url, '/gear/dance-tee.svg'),
      description: item.description || '',
      isActive: item.is_active,
      sortOrder: item.sort_order,
    }));

    return filterAndLimitProducts(mapped, category);
  } catch {
    return filterAndLimitProducts(DEFAULT_PRODUCTS, category);
  }
}

function filterAndLimitProducts(products: Product[], category?: string): Product[] {
  let list = products.filter((p) => p.isActive);
  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }
  return list.slice(0, MAX_CATALOG_PRODUCTS);
}
