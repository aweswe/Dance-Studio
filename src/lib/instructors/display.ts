export interface InstructorDisplay {
  id: string;
  name: string;
  role?: string | null;
  bio?: string | null;
  photo_url?: string | null;
}

/** Fallback portraits — same mapping as the About Us faculty grid. */
export function resolveInstructorPhoto(name: string, photoUrl?: string | null): string {
  if (photoUrl) return photoUrl;

  const n = name.toLowerCase();
  if (n.includes('amulya')) return '/images/amulya-rajendran.jpg';
  if (n.includes('sheel')) return '/images/sheel-awasthi.png';
  if (n.includes('saurabh') || n.includes('sureka')) return '/images/saurabh-sureka.png';
  if (n.includes('meghna')) return '/images/meghna-menon.png';
  if (n.includes('nitish')) return '/images/studio-training/studio-technique.jpg';
  if (n.includes('pranith')) return '/images/pranith-nair.png';
  if (n.includes('kajal')) return '/images/kajal-devi.png';
  if (n.includes('deepak')) return '/images/studio-training/contemporary-movement-1.jpg';
  if (n.includes('srikanth')) return '/images/srikanth-gymnastics.png';
  if (n.includes('srushti')) return '/images/kuchipudi/kuchipudi-traditional-standing.jpg';
  if (n.includes('poonam')) return '/images/studio-training/alignment-drills-1.jpg';
  if (n.includes('ajeesh')) return '/images/ajeesh-balakrishnan.png';
  return '/images/studio-training/contemporary-movement-1.jpg';
}

/** Short label for cards — takes text before the em dash when present. */
export function formatInstructorRole(role?: string | null): string {
  if (!role) return 'Faculty';
  return role.split('—')[0]?.trim() || role;
}

const NON_TEACHING_ROLE =
  /co-founder|strategic partner|event management|^manager\b|creative content lead/i;

/** Floor faculty only — excludes management / leadership that doesn’t teach on schedule. */
export function filterTeachingInstructors(instructors: InstructorDisplay[]): InstructorDisplay[] {
  return instructors.filter((person) => {
    const role = (person.role ?? '').trim();
    if (!role) return true;
    return !NON_TEACHING_ROLE.test(role);
  });
}
