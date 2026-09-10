import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts } from '@/data/blog';
import { formatDate } from '@/lib/utils/format';
import { Reveal } from '@/components/motion/reveal';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Journal & Insights | Rhythmzz Academy of Dance',
  description: 'Dance conditioning, choreography breakdowns, performance culture, and community stories from Rhythmzz Academy in Secunderabad.',
};

export default async function BlogPage() {
  const posts: any[] = (await getBlogPosts()) || [];

  return (
    <div className="bg-canvas text-ink">
      {/* Hero with Generous Breathing Space */}
      <section className="relative overflow-hidden py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-16 text-center border-b border-line bg-canvas">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center mb-4 px-3.5 py-1 rounded-full border border-line bg-surface/80 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] inline-block mr-2" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FB923C] uppercase font-bold">
              CHOREOGRAPHY · CONDITIONING · STUDIO JOURNAL
            </span>
          </div>

          <h1 className="heading-urban text-4xl sm:text-6xl md:text-7xl text-ink mb-6 leading-tight tracking-tight">
            THE RHYTHMZZ JOURNAL
          </h1>

          <p className="text-ink-2 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Essays on movement mechanics, musicality, performance mindset, and academy news from our coaches.
          </p>
        </div>
      </section>

      {/* Spacious Grid */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 max-w-6xl mx-auto min-h-[50vh]">
        {posts.length > 0 ? (
          <Reveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bento-card group flex flex-col justify-between p-0 overflow-hidden active:scale-[0.98] transition-transform"
              >
                <div className="relative aspect-video bg-canvas w-full overflow-hidden border-b border-line">
                  {post.cover_image_url || post.cover_image ? (
                    <Image
                      src={post.cover_image_url || post.cover_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-3 text-xs font-mono bg-surface">
                      Rhythmzz Journal
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-[#FB923C]">
                        {post.author?.name || 'Academy'}
                      </span>
                      <span className="text-[10px] font-mono text-ink-3 uppercase tracking-wider">
                        {post.published_at ? formatDate(post.published_at) : ''}
                      </span>
                    </div>

                    <h3 className="heading-urban text-xl sm:text-2xl mb-2 text-ink group-hover:text-[#FB923C] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-ink-2 line-clamp-2 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-line flex items-center gap-1.5 text-xs font-mono font-bold tracking-[1.5px] uppercase text-[#FB923C] group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </Reveal>
        ) : (
          <div className="text-center py-20 text-ink-2">
            <h3 className="heading-urban text-3xl mb-2 text-ink">NO POSTS YET</h3>
            <p>Check back later for new choreo breakdowns and technique essays.</p>
          </div>
        )}
      </section>
    </div>
  );
}
