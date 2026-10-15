import { getPublicSupabase } from '@/lib/supabase/public';

// Verified faculty directly from official website https://rhythmzzdance.com/about-us/trainers/
const DEFAULT_INSTRUCTORS = [
  {
    id: "i1-nitish",
    name: "Nitish Kumar",
    role: "Founder & Artistic Director · Contemporary Dance Trainer",
    bio: "Started dancing professionally at 16. Holds a Diploma in Performance & Dance from ISPTD, Bengaluru, and has spent 15+ years teaching, choreographing, and performing across India and internationally. Founded Rhythmzz in 2010, registered in 2013, and opened the Neredmet X Road studio. Represented India at the nATFEST Festival in Sri Lanka and led projects in Canada.",
    photo_url: "/images/team/nitish-kumar.jpg",
    certifications: ["ISPTD Bengaluru", "nATFEST Sri Lanka", "Art Unites & Indywood Awardee"],
    is_active: true,
  },
  {
    id: "i-amulya",
    name: "Amulya Rajendran",
    role: "Co-Founder & Legal Advisor",
    bio: "Electronics & Communications Engineer and Master's in Business Law graduate from NLSIU Bengaluru. Oversees governance, compliance, long-term direction, content, and communications at Rhythmzz Academy of Dance.",
    photo_url: "/images/team/amulya-rajendran.jpg",
    certifications: ["NLSIU Bengaluru MBL", "ECE Engineer", "Legal & Strategic Advisor"],
    is_active: true,
  },
  {
    id: "i-sheel",
    name: "Sheel Awasthi",
    role: "Strategic Partner",
    bio: "Solution Engineer and Solution Architect with 14+ years of corporate experience. Advises on academy growth strategy, technology integration, and digital architecture.",
    photo_url: "/images/team/sheel-awasthi.jpg",
    certifications: ["Solution Architect", "14+ Years Enterprise Tech", "Strategic Partner"],
    is_active: true,
  },
  {
    id: "i-saurabh",
    name: "Saurabh Sureka",
    role: "Director of Event Management",
    bio: "Founder & CEO of Celebration Makers with 20+ years of event management experience. Oversees conceptualisation and execution of academy showcases, recitals, and productions across India.",
    photo_url: "/images/team/saurabh-sureka.jpg",
    certifications: ["Celebration Makers CEO", "20+ Years Events", "Social Entrepreneur"],
    is_active: true,
  },
  {
    id: "i-meghna",
    name: "Meghna Menon",
    role: "Content Creator & Writer",
    bio: "With Rhythmzz since 2015. Psychology graduate leading creative content, storytelling, and digital media campaigns that capture the academy's unique identity.",
    photo_url: "/images/team/meghna-menon.jpg",
    certifications: ["Content Lead", "Psychology Graduate", "Digital Storyteller"],
    is_active: true,
  },
  {
    id: "i-swapna",
    name: "Swapna Sujit",
    role: "Studio Operations Manager",
    bio: "Operational backbone of Rhythmzz Academy since 2019. M.Tech in ECE (VLSI System Design) and former Assistant Professor for 10 years at MLRITM Hyderabad. Manages day-to-day studio scheduling, student operations, and facilities.",
    photo_url: "/images/team/swapna-sujit.jpg",
    certifications: ["M.Tech VLSI", "Former Assistant Professor (10 Yrs)", "Operations Lead"],
    is_active: true,
  },
  {
    id: "i2-pranith",
    name: "Pranith Nair",
    role: "Hip Hop / Contemporary Trainer",
    bio: "Senior instructor at Rhythmzz since 2015. Trained in contemporary under Nitish Kumar and Ajeesh Balakrishnan, and represented India at the NATANDA International Dance Festival in Sri Lanka.",
    photo_url: "/images/team/pranith-nair.jpg",
    certifications: ["Hip Hop Specialist", "Contemporary Artiste", "Natfest Sri Lanka Performer"],
    is_active: true,
  },
  {
    id: "i4-deepak",
    name: "Deepak Rao",
    role: "Bollywood / Freestyle Trainer",
    bio: "Joined Rhythmzz in 2013 and evolved into a core instructor. Renowned for high-energy, interactive sessions in Bollywood, Tollywood, and freestyle choreography.",
    photo_url: "/images/team/deepak-rao.jpg",
    certifications: ["Bollywood & Freestyle Master", "10+ Years with Rhythmzz", "Stage Choreographer"],
    is_active: true,
  },
  {
    id: "i3-kajal",
    name: "Kajal Devi",
    role: "Bollywood / Semi Classical / Kids Specialist",
    bio: "Part of Rhythmzz since 2014, trained under in-house and international faculty. Known as the 'Elastic Girl' for exceptional flexibility, Kajal is the primary specialist for Kids Foundation and Semi Classical batches.",
    photo_url: "/images/team/kajal-devi.jpg",
    certifications: ["Kids Specialist", "Bollywood & Semi Classical", "Flexibility Coach"],
    is_active: true,
  },
  {
    id: "i5-srushti",
    name: "Srushti Nidhi",
    role: "Kuchipudi Dance Guru",
    bio: "Began dancing at age 5 with 10+ years of rigorous formal Kuchipudi classical training. Combines classical Abhinaya, Adavus, and stage storytelling for certification and exam batches.",
    photo_url: "/images/team/srushti-nidhi.jpg",
    certifications: ["Kuchipudi Classical Guru", "Level Syllabus Examiner", "Classical Abhinaya"],
    is_active: true,
  },
  {
    id: "i-shailaja",
    name: "Shailaja Puri",
    role: "Mind and Body Fitness Specialist",
    bio: "Specialist trainer leading morning wellness, Zumba, complete fitness combo packs, and yoga sessions designed for all fitness levels.",
    photo_url: "/images/team/shailaja-puri.jpg",
    certifications: ["Fitness Specialist", "Zumba Certified", "Wellness Coach"],
    is_active: true,
  },
  {
    id: "i-prerna",
    name: "Prerna Kapuria",
    role: "Semi-Classical Trainer (Online)",
    bio: "Expert semi-classical trainer conducting online masterclasses and structured choreography modules for remote and hybrid learners.",
    photo_url: "/images/studio-training/alignment-drills-1.jpg",
    certifications: ["Semi-Classical Trainer", "Online Masterclasses", "Expressive Choreography"],
    is_active: true,
  },
  {
    id: "i-srikanth",
    name: "Srikanth Sree",
    role: "Gymnastics Specialist",
    bio: "Specialist coach for gymnastics, acrobatics, tumbling, and athletic conditioning. Trains children and youth in spatial awareness, core control, and foundational agility.",
    photo_url: "/images/team/srikanth-sree.jpg",
    certifications: ["Gymnastics Specialist", "Tumbling Coach", "Acrobatics Coach"],
    is_active: true,
  },
  {
    id: "i8-ajeesh",
    name: "Ajeesh Balakrishnan",
    role: "Guest Trainer — Kalaripayattu & Contemporary",
    bio: "Certified performer and trainer from Attakkalari since 2006. Has performed in numerous international productions and trains dancers in contemporary dance mechanics and traditional Kalaripayattu martial movement.",
    photo_url: "/images/ajeesh-balakrishnan.png",
    certifications: ["Guest Trainer", "Kalaripayattu Master", "Attakkalari Certified"],
    is_active: true,
  },
  {
    id: "i6-poonam",
    name: "Poonam Nayak Jamwale",
    role: "Kathak Classical Faculty",
    bio: "10+ years training in Lucknow Gharana of Kathak. Visharad Poorna from Gandharva Mahavidyalaya Mumbai and Diploma from Telugu University. Disciple of Guru Pandit Shri Sanjay Kumar Joshi.",
    photo_url: null,
    certifications: ["Visharad Poorna", "Telugu University Diploma", "Kathak Examiner"],
    is_active: true,
  },
];

export async function getInstructors() {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return DEFAULT_INSTRUCTORS;
    const { data } = await supabase
      .from('instructors')
      .select('id, name, role, bio, photo_url, certifications, is_active')
      .eq('is_active', true);
    if (data && data.length > 0) return data;
  } catch {}
  return DEFAULT_INSTRUCTORS;
}
