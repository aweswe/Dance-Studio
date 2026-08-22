import { getPublicSupabase } from '@/lib/supabase/public';

const DEFAULT_POSTS = [
  {
    id: "b1b2c3d4-0001-0000-0000-000000000001",
    title: "Welcome to Rhythmzz Academy of Dance",
    slug: "welcome-to-rhythmzz-dance-academy",
    excerpt: "Discover the vibrant world of dance in Secunderabad with our certified instructors, welcoming community, and state-of-the-art studio facilities.",
    content: "<p>Welcome to Rhythmzz Academy of Dance, Secunderabad's premier dance institution located near Neredmet X Road. Since 2013, our mission has been to ignite a lifelong passion for dance and movement across all ages.</p><p>Whether you're looking for energetic Kids Dance classes, soulful Kuchipudi Classical training, fun Adults Dance choreography, or energizing Mind & Body Fitness (Zumba & Yoga), our studio has a place for you.</p>",
    cover_image_url: null,
    published_at: "2026-01-01T00:00:00.000Z",
    tags: ["News", "Dance Classes", "Secunderabad"],
    author: { name: "Rhythmzz Academy", photo_url: null, bio: "Premier dance studio in Secunderabad since 2013." },
    is_published: true,
  }
];

export async function getBlogPosts() {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image_url, published_at, tags, author:instructors(name)')
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
      .select('*, author:instructors(name, photo_url, bio)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    if (data) return data;
  } catch {}
  return DEFAULT_POSTS.find((p) => p.slug === slug) ?? null;
}
