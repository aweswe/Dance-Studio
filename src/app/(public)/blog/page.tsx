import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts } from '@/data/blog';
import { formatDate } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest updates, dance tips, and news from Rhythmzz Academy of Dance.',
};

export default async function BlogPage() {
  const posts: any[] = (await getBlogPosts()) || [];

  return (
    <div className="bg-white">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full flex flex-col bg-white border border-black/5 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="relative aspect-video bg-off w-full overflow-hidden">
                  {post.cover_image_url || post.cover_image ? (
                    <Image 
                      src={post.cover_image_url || post.cover_image} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-mu text-xs">No Cover</div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold tracking-[2px] uppercase text-bl">
                      {post.author?.name || 'Academy'}
                    </span>
                    <span className="text-[10px] text-mu uppercase tracking-wider">
                      {post.published_at ? formatDate(post.published_at) : ''}
                    </span>
                  </div>
                  
                  <h3 className="heading-display text-2xl mb-3 text-blk group-hover:text-bl transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-mu line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center text-[11px] font-bold tracking-[2px] uppercase text-blk group-hover:text-bl transition-colors">
                    Read Article &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-mu">
            <h3 className="heading-display text-3xl mb-2 text-blk">No posts yet</h3>
            <p>Check back later for exciting updates and articles.</p>
          </div>
        )}
      </section>
    </div>
  );
}
