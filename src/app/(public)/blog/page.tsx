import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts } from '@/data/blog';
import { formatDate } from '@/lib/utils/format';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest updates, dance tips, and news from Rhythmzz Academy of Dance.',
};

export default async function BlogPage() {
  const posts: any[] = (await getBlogPosts()) || [];

  return (
    <div className="bg-canvas text-ink">
      {/* Header */}
      <section className="bg-blk text-white py-20 px-6 md:px-16 text-center">
        <h1 className="heading-display text-5xl md:text-7xl mb-4">THE RHYTHMZZ BLOG</h1>
        <p className="text-white/60 max-w-2xl mx-auto">
          Insights, tips, and stories from our dance community.
        </p>
      </section>

      {/* Grid */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto min-h-[50vh]">
        {posts.length > 0 ? (
          <Reveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full flex flex-col bg-surface border border-line rounded-card overflow-hidden hover:shadow-pop hover:-translate-y-1 transition-all focus-visible:focus-ring">
                <div className="relative aspect-video bg-canvas-muted-2 w-full overflow-hidden">
                  {post.cover_image_url || post.cover_image ? (
                    <Image
                      src={post.cover_image_url || post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-2 text-xs">No Cover</div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold tracking-[2px] uppercase text-bl-ink">
                      {post.author?.name || 'Academy'}
                    </span>
                    <span className="text-[10px] text-ink-2 uppercase tracking-wider">
                      {post.published_at ? formatDate(post.published_at) : ''}
                    </span>
                  </div>

                  <h3 className="heading-display text-2xl mb-3 text-ink group-hover:text-bl-ink transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-ink-2 line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center text-[11px] font-bold tracking-[2px] uppercase text-ink group-hover:text-bl-ink transition-colors">
                    Read Article &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </Reveal>
        ) : (
          <div className="text-center py-20 text-ink-2">
            <h3 className="heading-display text-3xl mb-2 text-ink">No posts yet</h3>
            <p>Check back later for exciting updates and articles.</p>
          </div>
        )}
      </section>
    </div>
  );
}
