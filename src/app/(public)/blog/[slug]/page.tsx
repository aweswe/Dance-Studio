import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPosts, getBlogPostBySlug } from '@/data/blog';
import { formatDate } from '@/lib/utils/format';
import { SITE_URL } from '@/lib/utils/constants';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts: any[] = (await getBlogPosts()) || [];
  if (posts.length > 0) {
    return posts.map((p) => ({
      slug: p.slug,
    }));
  }
  return [
    { slug: 'welcome-to-rhythmzz-dance-academy' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post: any = await getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on the Rhythmzz Academy blog.`,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      images: post.cover_image_url || post.cover_image ? [post.cover_image_url || post.cover_image] : [],
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post: any = await getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const coverImg = post.cover_image_url || post.cover_image;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": coverImg ? [coverImg] : [],
    "datePublished": post.published_at,
    "author": {
      "@type": "Person",
      "name": post.author?.name || "Rhythmzz Academy"
    }
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="max-w-4xl mx-auto px-6 md:px-16 py-16 md:py-24">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold tracking-[2px] uppercase mb-6">
            <span className="text-bl">{post.author?.name || 'Academy'}</span>
            <span className="w-1 h-1 rounded-full bg-black/20" />
            <span className="text-mu">{post.published_at ? formatDate(post.published_at) : 'Draft'}</span>
          </div>
          
          <h1 className="heading-display text-4xl md:text-6xl mb-8 leading-tight">
            {post.title}
          </h1>
          
          {coverImg && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mt-10">
              <Image 
                src={coverImg} 
                alt={post.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg md:prose-xl prose-neutral max-w-none prose-headings:font-display prose-headings:font-normal prose-a:text-bl prose-img:rounded-xl">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p className="text-mu text-center italic py-10">Content is empty.</p>
          )}
        </div>

        {/* Footer / Author */}
        <footer className="mt-20 pt-10 border-t border-black/10">
          <div className="flex items-center gap-6 bg-light p-8 rounded-2xl">
            {post.author?.photo_url ? (
              <Image 
                src={post.author.photo_url} 
                alt={post.author.name} 
                width={80} 
                height={80} 
                className="rounded-full object-cover shrink-0" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blk text-white flex items-center justify-center text-2xl font-bold shrink-0">
                {post.author?.name?.charAt(0) || 'R'}
              </div>
            )}
            <div>
              <h3 className="text-[12px] font-bold tracking-[2px] uppercase mb-2">Written by {post.author?.name || 'Academy'}</h3>
              {post.author?.bio && (
                <p className="text-sm text-mu leading-relaxed">
                  {post.author.bio}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link 
              href="/blog"
              className="inline-block text-[11px] font-semibold tracking-[2px] uppercase py-4 px-8 border border-black/20 hover:border-bl hover:text-bl transition-all"
            >
              &larr; Back to Blog
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
