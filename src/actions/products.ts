'use server';

import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { revalidatePath } from 'next/cache';
import { DEFAULT_PRODUCTS, MAX_CATALOG_PRODUCTS, resolveProductImageUrl, type Product } from '@/data/products';

import type { Database } from '@/lib/supabase/types';

export interface ProductInput {
  name: string;
  slug?: string;
  category: 'teen' | 'women' | 'men' | 'accessories';
  tag?: string;
  price: number;
  sizes: string[];
  image_url?: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}

/**
 * Fetch all products for admin dashboard (including inactive items).
 */
export async function getAdminProducts(): Promise<{
  success: boolean;
  products?: Product[];
  error?: string;
}> {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data || data.length === 0) {
    // Return default 10 products so admin dashboard is never empty
    return { success: true, products: DEFAULT_PRODUCTS };
  }

  const products: Product[] = data.map((item) => ({
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

  return { success: true, products };
}

/**
 * Update an existing product's details or image URL.
 */
export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  const admin = createAdminSupabase();

  const updatePayload: Database['public']['Tables']['products']['Update'] = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) updatePayload.name = input.name.trim();
  if (input.price !== undefined) updatePayload.price = Math.max(0, Math.round(Number(input.price)));
  if (input.category !== undefined) updatePayload.category = input.category;
  if (input.tag !== undefined) updatePayload.tag = input.tag.trim();
  if (input.sizes !== undefined) updatePayload.sizes = input.sizes;
  if (input.image_url !== undefined) {
    const newUrl = input.image_url.trim();
    updatePayload.image_url = newUrl;

    // Purge old image from Vercel Blob if it was replaced
    const { data: current } = await admin.from('products').select('image_url').eq('id', id).maybeSingle();
    const oldUrl = (current as any)?.image_url;
    if (oldUrl && oldUrl !== newUrl && oldUrl.includes('blob.vercel-storage.com')) {
      try {
        const { del } = await import('@vercel/blob');
        await del(oldUrl);
      } catch (e) {
        console.warn('Vercel Blob old product image cleanup warning:', e);
      }
    }
  }
  if (input.description !== undefined) updatePayload.description = input.description.trim();
  if (input.is_active !== undefined) updatePayload.is_active = input.is_active;
  if (input.sort_order !== undefined) updatePayload.sort_order = input.sort_order;

  const { error } = await admin.from('products').update(updatePayload).eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/gear');
  revalidatePath('/admin/gear');

  return { success: true };
}

/**
 * Create a new product.
 * Enforces maximum catalog cap of 10 products.
 */
export async function createProduct(
  input: ProductInput
): Promise<{ success: boolean; error?: string; id?: string }> {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  const admin = createAdminSupabase();

  // Enforce catalog limit: only 10 products allowed
  const { count, error: countErr } = await admin
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    return { success: false, error: countErr.message };
  }

  if ((count ?? 0) >= MAX_CATALOG_PRODUCTS) {
    return {
      success: false,
      error: `Maximum catalog capacity of ${MAX_CATALOG_PRODUCTS} products reached. Please edit or deactivate an existing product.`,
    };
  }

  const baseSlug = (input.slug || input.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const { data: last } = await admin
    .from('products')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  const nextSort = ((last?.[0] as { sort_order: number } | undefined)?.sort_order ?? 0) + 1;

  const { data: inserted, error: insertErr } = await admin
    .from('products')
    .insert({
      name: input.name.trim(),
      slug,
      category: input.category,
      tag: input.tag?.trim() || 'GEAR',
      price: Math.max(0, Math.round(Number(input.price))),
      sizes: input.sizes && input.sizes.length > 0 ? input.sizes : ['M'],
      image_url: input.image_url?.trim() || '/gear/dance-tee.webp',
      description: input.description?.trim() || '',
      is_active: input.is_active ?? true,
      sort_order: input.sort_order ?? nextSort,
    })
    .select('id')
    .single();

  if (insertErr || !inserted) {
    return { success: false, error: insertErr?.message || 'Failed to create product' };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/gear');
  revalidatePath('/admin/gear');

  return { success: true, id: inserted.id };
}

/**
 * Toggle product visibility.
 */
export async function toggleProductActive(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  return updateProduct(id, { is_active: isActive });
}

/**
 * Delete a product from catalog.
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  const admin = createAdminSupabase();

  // Purge image from Vercel Blob if stored there
  const { data: current } = await admin.from('products').select('image_url').eq('id', id).maybeSingle();
  const imageUrl = (current as any)?.image_url;
  if (imageUrl && imageUrl.includes('blob.vercel-storage.com')) {
    try {
      const { del } = await import('@vercel/blob');
      await del(imageUrl);
    } catch (e) {
      console.warn('Vercel Blob product image delete warning:', e);
    }
  }

  const { error } = await admin.from('products').delete().eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/gear');
  revalidatePath('/admin/gear');

  return { success: true };
}
