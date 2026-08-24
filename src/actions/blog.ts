'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { blogPostSchema, type BlogPostData } from '@/lib/validators/blog';
import { revalidatePath } from 'next/cache';

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function createPost(data: BlogPostData) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid post' };
  }
  const d = parsed.data;

  const slug = slugify(d.title);
  if (!slug) return { success: false, error: 'Title has no valid characters' };

  const { data: existing } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (existing) return { success: false, error: `A post with slug "${slug}" already exists — tweak the title` };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('blog_posts').insert({
    title: d.title,
    slug,
    content: d.content,
    excerpt: d.excerpt ?? null,
    cover_image_url: d.coverImageUrl || null,
    meta_description: d.metaDescription || null,
    tags: d.tags,
    is_published: d.isPublished,
    published_at: d.isPublished ? new Date().toISOString() : null,
    author_id: user?.id ?? null,
  });
  if (error) return { success: false, error: error.message };

  revalidatePath('/blog');
  revalidatePath('/');
  return { success: true };
}

export async function updatePost(id: string, data: BlogPostData) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid post' };
  }
  const d = parsed.data;

  const slug = slugify(d.title);
  if (!slug) return { success: false, error: 'Title has no valid characters' };

  // Slugs are UNIQUE — a renamed post must not collide with another post
  const { data: collision } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', slug)
    .neq('id', id)
    .maybeSingle();
  if (collision) return { success: false, error: `A post with slug "${slug}" already exists — tweak the title` };

  const { data: existing } = await supabase
    .from('blog_posts')
    .select('is_published, published_at')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('blog_posts')
    .update({
      title: d.title,
      slug,
      content: d.content,
      excerpt: d.excerpt ?? null,
      cover_image_url: d.coverImageUrl || null,
      meta_description: d.metaDescription || null,
      tags: d.tags,
      is_published: d.isPublished,
      published_at: d.isPublished
        ? (existing?.published_at ?? new Date().toISOString())
        : null,
    })
    .eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/blog');
  revalidatePath('/');
  return { success: true };
}

export async function deletePost(id: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/blog');
  revalidatePath('/');
  return { success: true };
}
