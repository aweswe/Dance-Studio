-- Migration: 0019_gear_products.sql
-- Create table for Rhythmzz Academy Gear (10-product curated merchandise catalog)

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('all', 'teen', 'women', 'men', 'accessories')),
  tag TEXT DEFAULT 'GEAR',
  price INTEGER NOT NULL CHECK (price >= 0),
  sizes TEXT[] NOT NULL DEFAULT '{"S", "M", "L", "XL"}',
  image_url TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_products" ON public.products;
DROP POLICY IF EXISTS "admin_manage_products" ON public.products;

-- Public can view active products
CREATE POLICY "public_read_active_products" ON public.products
  FOR SELECT
  USING (is_active = true OR (auth.jwt() ->> 'role') = 'authenticated');

-- Instructors / Admins can manage products
CREATE POLICY "admin_manage_products" ON public.products
  FOR ALL
  TO authenticated
  USING (
    public.get_user_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
    OR (auth.jwt() ->> 'role') = 'service_role'
  )
  WITH CHECK (
    public.get_user_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
    OR (auth.jwt() ->> 'role') = 'service_role'
  );

-- Index for public storefront queries
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category, is_active, sort_order);

-- Seed initial 10 launch products
INSERT INTO public.products (name, slug, category, tag, price, sizes, image_url, description, is_active, sort_order)
VALUES
  (
    'Rhythmzz Dance Tee',
    'teen-dance-tee',
    'teen',
    'TEEN',
    599,
    ARRAY['XS', 'S', 'M', 'L'],
    '/gear/dance-tee.webp',
    'Signature lightweight, moisture-wicking studio tee with subtle Rhythmzz crest on the chest.',
    true,
    1
  ),
  (
    'Studio Dance Shorts',
    'teen-dance-shorts',
    'teen',
    'TEEN',
    549,
    ARRAY['XS', 'S', 'M', 'L'],
    '/gear/dance-shorts.webp',
    'Ultra-stretch performance shorts built for high-kicks, floor work, and energetic rehearsals.',
    true,
    2
  ),
  (
    'Pro Studio Sports Bra',
    'women-sports-bra',
    'women',
    'WOMEN',
    699,
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    '/gear/sports-bra.webp',
    'Medium-impact compression bra with reinforced cross-back straps and breathable mesh panel.',
    true,
    3
  ),
  (
    'Rhythmzz Warm-Up Jacket',
    'women-dance-jacket',
    'women',
    'WOMEN',
    1299,
    ARRAY['S', 'M', 'L', 'XL'],
    '/gear/dance-jacket.webp',
    'Raglan-sleeve zipped track jacket with high collar and brushed fleece lining for pre-class warmups.',
    true,
    4
  ),
  (
    'Active Movement Shorts',
    'women-active-shorts',
    'women',
    'WOMEN',
    649,
    ARRAY['XS', 'S', 'M', 'L'],
    '/gear/active-shorts.webp',
    'High-waisted compression shorts with anti-ride silicone hem and hidden locker key pocket.',
    true,
    5
  ),
  (
    'Academy Track Tee',
    'men-track-tee',
    'men',
    'MEN',
    649,
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    '/gear/track-tee.webp',
    'Athletic-cut breathable jersey tee with drop-tail hem and reflective Rhythmzz typography.',
    true,
    6
  ),
  (
    'Pro Studio Track Pants',
    'men-track-pants',
    'men',
    'MEN',
    899,
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    '/gear/track-pants.webp',
    'Tapered rehearsal track pants with ankle zips, deep zippered side pockets, and drawstring waistband.',
    true,
    7
  ),
  (
    'Rhythmzz Core Hoodie',
    'men-studio-hoodie',
    'men',
    'MEN',
    1499,
    ARRAY['S', 'M', 'L', 'XL'],
    '/gear/studio-hoodie.webp',
    'Heavyweight 380 GSM organic cotton fleece pullover hoodie with kangaroo pouch and ribbed cuffs.',
    true,
    8
  ),
  (
    'Studio Snapback Cap',
    'unisex-studio-cap',
    'accessories',
    'UNISEX',
    499,
    ARRAY['FREE SIZE'],
    '/gear/studio-cap.webp',
    'Structured 6-panel cotton twill snapback cap featuring 3D embroidered Rhythmzz emblem.',
    true,
    9
  ),
  (
    'Canvas Duffle Studio Bag',
    'unisex-duffle-bag',
    'accessories',
    'UNISEX',
    799,
    ARRAY['STANDARD'],
    '/gear/duffle-bag.webp',
    'Spacious 35L water-repellent canvas gym and dance duffle with dedicated shoe tunnel and shoulder strap.',
    true,
    10
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  tag = EXCLUDED.tag,
  price = EXCLUDED.price,
  sizes = EXCLUDED.sizes,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;
