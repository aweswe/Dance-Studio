import Image from 'next/image';

interface InstructorCardProps {
  instructor: any; // Type properly in a real scenario
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 flex flex-col items-center text-center p-8">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-5 relative bg-off">
        {instructor.photo_url ? (
          <Image 
            src={instructor.photo_url} 
            alt={instructor.name} 
            fill 
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-black/20 font-bold bg-gray-100">
            {instructor.name?.charAt(0) || 'I'}
          </div>
        )}
      </div>
      <h4 className="heading-display text-2xl text-blk mb-1">{instructor.name}</h4>
      <p className="text-[10px] tracking-[2px] uppercase text-bl font-semibold mb-4">
        {instructor.role || 'Instructor'}
      </p>
      <p className="text-sm text-mu leading-relaxed">
        {instructor.bio}
      </p>
      {Array.isArray(instructor.certifications) && instructor.certifications.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {instructor.certifications.map((cert: string, i: number) => (
            <span
              key={i}
              className="text-[9px] tracking-[1.5px] uppercase font-semibold text-bl bg-bl/10 border border-bl/20 rounded-full px-3 py-1"
            >
              {cert}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
