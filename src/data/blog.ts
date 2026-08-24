import { getPublicSupabase } from '@/lib/supabase/public';

const DEFAULT_POSTS = [
  {
    id: "b1b2c3d4-0001-0000-0000-000000000001",
    title: "Welcome to Rhythmzz Academy of Dance",
    slug: "welcome-to-rhythmzz-dance-academy",
    excerpt: "Discover dance in Secunderabad at Rhythmzz Academy of Dance — certified instructors, four programmes and a free trial class at Neredmet X Road.",
    content: "<p>Welcome to Rhythmzz Academy of Dance at Neredmet X Road, Secunderabad. Founded in 2013 and teaching since 2010, we train dancers of every age across four programmes.</p><p>Looking for Kids Dance classes, Kuchipudi Classical training, Adults Dance choreography, or Mind & Body Fitness (Zumba & Yoga)? Our studio has a place for you — and your first class is a free trial.</p>",
    cover_image_url: null,
    published_at: "2026-01-01T00:00:00.000Z",
    tags: ["News", "Dance Classes", "Secunderabad"],
    author: { name: "Rhythmzz Academy", photo_url: null, bio: "Dance and fitness studio at Neredmet X Road, Secunderabad since 2013." },
    is_published: true,
  }
];

export async function getBlogPosts() {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image_url, published_at, tags')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (data && data.length > 0) return data;
  } catch {}
  return DEFAULT_POSTS;
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    if (data) return data;
  } catch {}
  return DEFAULT_POSTS.find((p) => p.slug === slug) ?? null;
}
