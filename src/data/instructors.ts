import { getPublicSupabase } from '@/lib/supabase/public';

// Verified faculty directly from official website https://rhythmzzdance.com/about-us/trainers/
const DEFAULT_INSTRUCTORS = [
  {
    id: "i1-nitish",
    name: "Nitish Kumar",
    role: "Founder & Artistic Director",
    bio: "Founder of Rhythmzz Academy. Achieving a Diploma from ISPTD Bengaluru, Nitish is a contemporary expert and senior instructor who has trained 1,000+ students and represented India at the Natfest International Contemporary Dance Festival in Sri Lanka.",
    photo_url: null,
    certifications: ["ISPTD Certified (Bengaluru)", "Natfest International Stage (Sri Lanka)", "Art Unites & Indywood Awardee"],
    is_active: true,
  },
  {
    id: "i2-pranith",
    name: "Pranith Nair",
    role: "Senior Instructor — Hip Hop & Bolly-Hop",
    bio: "Senior instructor at Rhythmzz since 2015. Trained in contemporary under Nitish Kumar and Ajeesh Balakrishnan, and represented India as part of Rhythmzz at the NATANDA International Dance Festival in Sri Lanka.",
    photo_url: null,
    certifications: ["Hip Hop & Bolly-Hop Specialist", "Natfest Sri Lanka Artiste", "Fitness Enthusiast"],
    is_active: true,
  },
  {
    id: "i3-kajal",
    name: "Kajal Devi",
    role: "Instructor — Bollywood & Kids Batch",
    bio: "Part of Rhythmzz since 2014, trained under in-house and international faculty. Known as the 'Elastic Girl' for exceptional flexibility, Kajal is the primary instructor for the Kids Foundation Batches.",
    photo_url: null,
    certifications: ["Kids Dance Specialist", "Contemporary & Flexibility", "Rhythmzz Core Faculty"],
    is_active: true,
  },
  {
    id: "i4-deepak",
    name: "Deepak Rao",
    role: "Instructor — Bollywood, Tollywood & Dance Fitness",
    bio: "Joined in 2013 and evolved from a student to core instructor. Renowned for his jovial, high-energy interactive sessions in Bollywood, Tollywood, and adult dance fitness.",
    photo_url: null,
    certifications: ["Bollywood & Tollywood Master", "Dance Fitness Instructor", "10+ Years with Rhythmzz"],
    is_active: true,
  },
  {
    id: "i5-srushti",
    name: "Srushti Nidhi",
    role: "Faculty — Kuchipudi Classical & Bollywood",
    bio: "Started dancing at age 5 with 10 years of formal Kuchipudi classical training, combining classical precision with contemporary storytelling and Bollywood choreography.",
    photo_url: null,
    certifications: ["10-Year Kuchipudi Trainee", "Classical Abhinaya", "Freestyle & Bollywood"],
    is_active: true,
  },
  {
    id: "i6-poonam",
    name: "Poonam Nayak Jamwale",
    role: "Kathak Classical Faculty",
    bio: "10+ years training in Lucknow Gharana of Kathak. Visharad Poorna from Gandharva Mahavidyalaya Mumbai and Diploma from Telugu University. Disciple of Guru Pandit Shri Sanjay Kumar Joshi.",
    photo_url: null,
    certifications: ["Visharad Poorna (Gandharva Mahavidyalaya)", "Kathak Diploma (Telugu University)", "Official Kathak Examiner"],
    is_active: true,
  },
  {
    id: "i7-bhavya",
    name: "Bhavya Vallala",
    role: "Certified Yoga Trainer",
    bio: "Certified RYT 200 Yoga Instructor specializing in Hatha Yoga, Power Yoga, Vinyasa Yoga, and Meditation. Associated with Rhythmzz since 2014.",
    photo_url: null,
    certifications: ["RYT 200 Certified Yoga Instructor", "Hatha & Vinyasa Specialist", "Meditation Coach"],
    is_active: true,
  },
  {
    id: "i8-ajeesh",
    name: "Ajeesh Balakrishnan",
    role: "Contemporary & Kalaripayattu Trainer",
    bio: "Certified performer and trainer from Attakkalari since 2006. Has performed in numerous international productions and trained students in contemporary dance and martial movement.",
    photo_url: null,
    certifications: ["Attakkalari Certified", "International Production Artiste", "Kalaripayattu Movement"],
    is_active: true,
  },
  {
    id: "i9-archana",
    name: "Archana Singh",
    role: "Bombay Jam, Zumba & Fitness Trainer",
    bio: "STAR Trainer Award recipient for Bombay Jam, Certified Zumba Instructor, Masters in Health Care, and Certified CPR/AED by the American Heart Association.",
    photo_url: null,
    certifications: ["Bombay Jam STAR Trainer", "Certified Zumba Instructor", "American Heart Association CPR/AED"],
    is_active: true,
  },
];

export async function getInstructors() {
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from('instructors')
      .select('id, name, role, bio, photo_url, certifications, is_active')
      .eq('is_active', true);
    if (data && data.length > 0) return data;
  } catch {}
  return DEFAULT_INSTRUCTORS;
}
