import { Metadata } from 'next';
import Image from 'next/image';
import { getInstructors } from '@/data/instructors';
import { InstructorCard } from '@/components/public/instructor-card';
import { Award, Target, Heart, Star, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Rhythmzz Academy of Dance, our journey, our expert instructors, and our mission to spread the joy of dance in Secunderabad.',
};

const STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "5000+", label: "Students Taught" },
  { value: "15+", label: "Dance Styles" },
  { value: "2", label: "Studio Branches" },
];

const TIMELINE = [
  { year: "2013", title: "The Beginning", desc: "Started as a small dance crew with a passion for hip-hop and contemporary dance." },
  { year: "2015", title: "First Studio", desc: "Opened our first studio space in Secunderabad, offering classes in 3 core styles." },
  { year: "2018", title: "Expanding Horizons", desc: "Introduced Kuchipudi and fitness programs, expanding our instructor team." },
  { year: "2023", title: "New Flagship Studio", desc: "Launched our premium, state-of-the-art facility to accommodate our growing community." },
];

export default async function AboutPage() {
  const instructors = await getInstructors();

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-blk text-white py-24 px-6 md:px-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-[10px] tracking-[5px] uppercase text-bll mb-4">Our Story</div>
          <h1 className="heading-display text-5xl md:text-7xl mb-6">MORE THAN JUST A DANCE STUDIO</h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed">
            We are a community of movers, dreamers, and artists dedicated to the universal language of dance.
          </p>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-bl/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      </section>

      {/* The Vision */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="heading-display text-4xl mb-6">OUR VISION</h2>
            <div className="space-y-4 text-mu leading-relaxed">
              <p>
                Founded on the belief that dance is for everyone, Rhythmzz Academy was created to be a safe, inspiring space where individuals can explore their creative potential through movement.
              </p>
              <p>
                Whether it&apos;s a 4-year-old taking their first ballet steps, a working professional seeking a fun fitness routine, or an aspiring artist training for stage, we provide the guidance, space, and community to help them thrive.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="flex gap-4">
                <Target className="text-bl shrink-0" size={24} />
                <div>
                  <h4 className="text-[11px] font-bold tracking-[1px] uppercase mb-1">Mission</h4>
                  <p className="text-xs text-mu">To inspire and nurture dancers of all levels.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Heart className="text-bl shrink-0" size={24} />
                <div>
                  <h4 className="text-[11px] font-bold tracking-[1px] uppercase mb-1">Values</h4>
                  <p className="text-xs text-mu">Passion, discipline, community, and joy.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-off rounded-2xl relative overflow-hidden mt-8">
              <Image src="/images/about-1.jpg" alt="Dance Studio" fill className="object-cover" />
            </div>
            <div className="h-64 bg-off rounded-2xl relative overflow-hidden">
              <Image src="/images/about-2.jpg" alt="Performance" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-bl text-blk py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-black/10 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="heading-display text-4xl md:text-5xl mb-2">{stat.value}</span>
              <span className="text-[10px] font-bold tracking-[2px] uppercase opacity-70">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 md:px-16 bg-light">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-display text-4xl">OUR JOURNEY</h2>
          </div>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-black/10 before:to-transparent">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-light bg-bl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-black/5 shadow-sm">
                  <div className="text-bl font-bold tracking-wider mb-1">{item.year}</div>
                  <h3 className="heading-display text-2xl mb-2">{item.title}</h3>
                  <p className="text-sm text-mu leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-24 px-6 md:px-16 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <div className="text-[10px] tracking-[5px] uppercase text-bl mb-3">The Experts</div>
            <h2 className="heading-display text-4xl md:text-5xl">MEET OUR INSTRUCTORS</h2>
            <p className="text-mu mt-4 max-w-xl mx-auto">
              Our team of certified, passionate professionals bring years of training, stage experience, and teaching expertise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {((instructors ?? []) as any[]).map((instructor: any) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Awards */}
      <section className="py-16 px-6 md:px-16 bg-blk text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="heading-display text-3xl mb-10">AWARDS & RECOGNITION</h2>
          <div className="flex flex-wrap justify-center gap-12">
            {[1,2,3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center mb-4">
                  <Award className="text-gold" size={32} />
                </div>
                <div className="text-[11px] font-bold tracking-[2px] uppercase">Best Studio {2020 + i}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
