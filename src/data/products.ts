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
    imageUrl: '/gear/dance-tee.svg',
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
    imageUrl: '/gear/dance-shorts.svg',
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
    imageUrl: '/gear/sports-bra.svg',
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
    imageUrl: '/gear/dance-jacket.svg',
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
    imageUrl: '/gear/active-shorts.svg',
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
    imageUrl: '/gear/track-tee.svg',
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
    imageUrl: '/gear/track-pants.svg',
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
    imageUrl: '/gear/studio-hoodie.svg',
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
    imageUrl: '/gear/studio-cap.svg',
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
    imageUrl: '/gear/duffle-bag.svg',
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
      imageUrl: item.image_url || '/gear/dance-tee.webp',
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
