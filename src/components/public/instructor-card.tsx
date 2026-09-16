import Image from 'next/image';

interface InstructorCardProps {
  instructor: any;
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full group rounded-md hover:border-line-strong transition-all">
      <div>
        <div className="w-full aspect-[4/5] rounded-md overflow-hidden mb-5 relative bg-canvas border border-line">
          {instructor.photo_url ? (
            <Image
              src={instructor.photo_url}
              alt={instructor.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-ink-3 font-anton bg-canvas">
              {instructor.name?.charAt(0) || 'I'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-blk bg-bl px-2.5 py-1 rounded-md shadow-sm inline-block">
              {instructor.role || 'Senior Coach'}
            </span>
          </div>
        </div>

        <h4 className="font-anton text-2xl text-ink mb-1 group-hover:text-bl transition-colors tracking-wide uppercase">
          {instructor.name}
        </h4>
        <p className="text-xs text-ink-2 leading-relaxed mt-2 line-clamp-3">
          {instructor.bio}
        </p>
      </div>

      {Array.isArray(instructor.certifications) && instructor.certifications.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-line">
          {instructor.certifications.map((cert: string, i: number) => (
            <span
              key={i}
              className="text-[9px] font-mono tracking-wider uppercase font-bold text-bl bg-canvas border border-line rounded-md px-2.5 py-0.5"
            >
              [{cert}]
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
