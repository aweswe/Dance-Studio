import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProgrammes, getProgrammeBySlug } from '@/data/programmes';
import { CheckCircle2, Clock, Calendar, IndianRupee, MapPin } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const programmes: any[] = (await getProgrammes()) || [];
  if (programmes.length > 0) {
    return programmes.map((p) => ({
      slug: p.slug,
    }));
  }
  return [
    { slug: 'kids-dance' },
    { slug: 'adults-dance' },
    { slug: 'mind-body-fitness' },
    { slug: 'kuchipudi' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme: any = await getProgrammeBySlug(slug);
  
  if (!programme) {
    return {
      title: 'Programme Not Found'
    };
  }
  
  return {
    title: programme.name,
    description: programme.description || `Join our ${programme.name} classes in Secunderabad. Perfect for ${programme.age_group || 'all ages'}.`,
  };
}

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const programme: any = await getProgrammeBySlug(slug);
  
  if (!programme) {
    notFound();
  }

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": programme.name,
    "description": programme.description,
    "provider": {
      "@type": "Organization",
      "name": "Rhythmzz Academy of Dance",
      "sameAs": "https://www.rhythmzzdance.com"
    }
  };

  const includesList = programme.includes ? (typeof programme.includes === 'string' ? JSON.parse(programme.includes) : programme.includes) : [];

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      {/* Hero */}
      <section className="bg-blk text-white py-20 px-6 md:px-16 text-center relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[2px] uppercase mb-6">
            {programme.age_group || 'All Ages'}
          </div>
          <h1 className="heading-display text-5xl md:text-7xl mb-6">{programme.name}</h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            {programme.description}
          </p>
          <div className="mt-10">
            <Link 
              href={`/enrol?programme=${programme.slug}`}
              className="inline-block text-[11px] font-semibold tracking-[2px] uppercase py-4 px-10 bg-bl text-white hover:bg-[#22a0c4] transition-all"
            >
              Enrol Now
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* About */}
          <div>
            <h2 className="heading-display text-3xl mb-6">ABOUT THIS PROGRAMME</h2>
            <div className="prose prose-sm md:prose-base prose-neutral max-w-none text-mu">
              <p>
                Our {programme.name} program is designed to provide comprehensive training in a supportive and energetic environment. Whether you are a beginner taking your first steps or an experienced dancer looking to refine your technique, our expert instructors are here to guide you.
              </p>
              <p>
                Located near Neredmet X Road, Secunderabad, we are easily accessible for students from Sainikpuri, AS Rao Nagar, and surrounding areas.
              </p>
            </div>
          </div>

          {/* Includes */}
          {includesList.length > 0 && (
            <div>
              <h2 className="heading-display text-3xl mb-6">WHAT YOU&apos;LL LEARN</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {includesList.map((item: string, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start bg-off p-4 rounded-xl">
                    <CheckCircle2 className="text-bl shrink-0 mt-0.5" size={20} />
                    <span className="text-sm font-medium text-blk">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Batches / Schedule */}
          <div>
            <h2 className="heading-display text-3xl mb-6">CLASS SCHEDULE</h2>
            {programme.batches && programme.batches.length > 0 ? (
              <div className="space-y-4">
                {programme.batches.map((batch: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-light border border-black/5 rounded-2xl gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-blk font-semibold">
                        <Calendar size={18} className="text-bl" />
                        {Array.isArray(batch.days) ? batch.days.join(', ') : batch.days}
                      </div>
                      <div className="flex items-center gap-2 text-mu text-sm">
                        <Clock size={16} />
                        {batch.time_start} - {batch.time_end}
                      </div>
                    </div>
                    {batch.instructor && (
                      <div className="flex items-center gap-3">
                        {batch.instructor.photo_url ? (
                          <Image src={batch.instructor.photo_url} alt={batch.instructor.name} width={40} height={40} className="rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blk text-white flex items-center justify-center text-xs font-bold">
                            {batch.instructor.name?.charAt(0) || 'I'}
                          </div>
                        )}
                        <div className="text-sm">
                          <div className="text-xs text-mu uppercase tracking-wider mb-0.5">Instructor</div>
                          <div className="font-semibold">{batch.instructor.name}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-mu bg-off p-6 rounded-xl text-center">Schedule details will be updated soon.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Pricing Card */}
          <div className="bg-white border border-black/10 rounded-2xl p-8 shadow-sm">
            <h3 className="heading-display text-2xl mb-6 border-b border-black/5 pb-4">FEES</h3>
            
            <div className="space-y-6">
              {programme.fees_monthly && (
                <div className="flex justify-between items-center">
                  <div className="text-sm font-semibold uppercase tracking-wider text-mu">Monthly</div>
                  <div className="flex items-center text-xl font-bold">
                    <IndianRupee size={20} className="mr-1" />
                    {programme.fees_monthly}
                  </div>
                </div>
              )}
              {programme.fees_quarterly && (
                <div className="flex justify-between items-center">
                  <div className="text-sm font-semibold uppercase tracking-wider text-mu">Quarterly</div>
                  <div className="flex items-center text-xl font-bold text-bl">
                    <IndianRupee size={20} className="mr-1" />
                    {programme.fees_quarterly}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-black/5">
              <Link 
                href={`/enrol?programme=${programme.slug}`}
                className="block text-center text-[11px] font-semibold tracking-[2px] uppercase py-4 bg-blk text-white hover:bg-black transition-all w-full rounded-lg"
              >
                Book Your Spot
              </Link>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-light p-6 rounded-2xl border border-black/5">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="text-bl shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-[12px] font-bold tracking-[2px] uppercase mb-1">Location</h4>
                <p className="text-sm text-mu">
                  Rhythmzz Academy, Neredmet X Road, Secunderabad
                </p>
              </div>
            </div>
            <p className="text-xs text-mu/70">
              Easily accessible from Sainikpuri, AS Rao Nagar, and Yapral.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
