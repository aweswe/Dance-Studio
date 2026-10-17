export interface AchievementStat {
  number: string;
  label: string;
  detail: string;
}

export interface MilestoneEvent {
  id: string;
  title: string;
  year?: string;
  category: 'international' | 'competitions' | 'corporate' | 'social_cause';
  categoryLabel: string;
  clientOrPartner?: string;
  description: string;
  badge?: string;
  highlights?: string[];
}

export interface AcademicTraining {
  id: string;
  institution: string;
  role: string;
  tenure: string;
  description: string;
  location?: string;
  isOngoing?: boolean;
}

export interface PressItem {
  id: string;
  title: string;
  publication: string;
  date?: string;
  category: 'newspaper' | 'showcase' | 'stage';
  image: string;
  description: string;
}

export interface SocialChannel {
  name: string;
  handle: string;
  href: string;
  description: string;
  icon: 'linktree' | 'instagram' | 'facebook' | 'twitter' | 'whatsapp';
  badge?: string;
}

export const ACHIEVEMENT_STATS: AchievementStat[] = [
  {
    number: 'Global',
    label: 'Canada & Sri Lanka',
    detail: 'Workshops in Toronto & Ottawa; nATFEST Sri Lanka',
  },
  {
    number: '1,500+',
    label: 'HDPL Competitors',
    detail: 'Across Telangana & Andhra Pradesh in 2015',
  },
  {
    number: '15+',
    label: 'Educational Partners',
    detail: 'Colleges & schools officially certified since 2010',
  },
  {
    number: '3,000+',
    label: 'Dancers Trained',
    detail: 'Across classical, contemporary & commercial styles',
  },
];

export const MAJOR_EVENTS: MilestoneEvent[] = [
  {
    id: 'canada-collaborations',
    title: 'International Presence & Creative Collaborations – Canada',
    year: '2023 – 2026',
    category: 'international',
    categoryLabel: 'Global Workshops & Films',
    clientOrPartner: 'Toronto, Ottawa & Magic Mist Media',
    description:
      'Extending Rhythmzz Academy of Dance beyond borders, founder Nitish Kumar conducted multiple contemporary dance workshops for dancers in Toronto and Ottawa, Canada, between 2024 and 2026. These workshops explored contemporary movement, musicality, improvisation, and innovative choreography, fostering artistic growth and creative exchange within the dance community.\n\nFurther expanding Rhythmzz’s creative footprint, Nitish choreographed a music video in 2023 for Magic Mist Media, a Toronto-based short film production company, blending expressive movement with visual storytelling. These milestones reflect Rhythmzz’s growing international presence, cross-cultural collaborations, and commitment to pushing creative boundaries through dance.',
    badge: 'Toronto & Ottawa',
    highlights: [
      'Contemporary dance workshops across Toronto & Ottawa (2024–2026)',
      'Exploration of movement, musicality, improvisation & choreography',
      'Music video choreography for Magic Mist Media Toronto (2023)',
      'Cross-cultural creative exchange and global storytelling',
    ],
  },
  {
    id: 'natfest-srilanka',
    title: 'Represented Team India at nATFEST Sri Lanka',
    year: '2017',
    category: 'international',
    categoryLabel: 'International Tour',
    clientOrPartner: 'nATFEST International Contemporary Dance Festival',
    description:
      'Rhythmzz Academy of Dance represented India on the global stage at the nATFEST International Contemporary Dance Festival in Sri Lanka, presenting the acclaimed full-length contemporary production "Raasta – The Inside Light".',
    badge: 'Global Representation',
    highlights: [
      'Original production "Raasta – The Inside Light"',
      'Selected to represent Indian contemporary movement',
      'Cross-cultural choreography masterclasses',
    ],
  },
  {
    id: 'hdpl-2015',
    title: 'Hyderabad Dance Premier League (HDPL)',
    year: '2015',
    category: 'competitions',
    categoryLabel: 'National Tournament',
    clientOrPartner: 'Rhythmzz Academy of Dance (Organizer)',
    description:
      'Conceived, hosted, and directed Hyderabad’s largest national-level dance competition in history, bringing together more than 1,500 dancers across Andhra Pradesh and Telangana in an unprecedented celebration of youth dance talent.',
    badge: '1,500+ Dancers',
    highlights: [
      'Largest dance championship in united AP / Telangana history',
      'Over 1,500 participants across solo, duet, and crew tracks',
      'Comprehensive print and television media coverage',
    ],
  },
  {
    id: 'amazon-global-campus',
    title: "Amazon World's Largest Campus Mega Flash Mob",
    year: '2019',
    category: 'corporate',
    categoryLabel: 'Corporate Launch',
    clientOrPartner: 'Wizcraft India PVT. LTD & Amazon',
    description:
      "Choreographed and executed the official high-energy inauguration flash mob launching Amazon's largest campus building worldwide in Hyderabad, partnered with premier event agency Wizcraft India.",
    badge: 'Amazon Global HQ',
    highlights: [
      'Global corporate campus inauguration',
      'High-energy synchronization flash mob with 50+ performers',
      'Executed under mandate of Wizcraft India PVT. LTD',
    ],
  },
  {
    id: 'ipl-sony-cricket',
    title: 'Indian Premier League (IPL) & Sony Entertainment Television',
    year: '2014 – 2016',
    category: 'corporate',
    categoryLabel: 'Broadcast & Sports',
    clientOrPartner: 'Sony Entertainment Television & Sunrisers Hyderabad',
    description:
      'Staged viral stadium flash mobs and televised live promotional showcases for Sony Entertainment Television’s "Indian Premier League of Cricket Screen", energising thousands of fans in support of the Sunrisers Hyderabad IPL cricket team.',
    badge: 'Televised Broadcast',
    highlights: [
      'Televised national broadcast on Sony channels',
      'Official campaign in support of Sunrisers Hyderabad',
      'Interactive stadium crowd activations',
    ],
  },
  {
    id: 'corporate-launches',
    title: 'National Brand & High-Profile Product Launches',
    year: '2014 – 2021',
    category: 'corporate',
    categoryLabel: 'Brand Launches',
    clientOrPartner: 'Airtel 4G, Uninor-Telenor, Tata Sky & Bharat Biotech',
    description:
      'Choreographed custom high-impact launch sequences for marquee brands including the Airtel 4G Hyderabad network launch, Uninor-to-Telenor brand conversion, Tata Sky Active Fitness campaign, and the intensive 4-day Bharat Biotech pharmaceutical product launch.',
    badge: 'Brand Activations',
    highlights: [
      'Airtel 4G Official Launch, Hyderabad',
      'Tata Sky "Active Fitness" promotional launch',
      'Bharat Biotech 4-Day pharmaceutical launch choreography',
      'Uninor-Telenor telecommunications brand transition',
    ],
  },
  {
    id: 'mnc-corporate-choreography',
    title: 'MNC Annual Days & Foreign Delegate Showcases',
    category: 'corporate',
    categoryLabel: 'Corporate Choreography',
    clientOrPartner: 'Wipro, Intellect Tech, Chennai Super Kings (CSK) & Infosys',
    description:
      'Directorial choreography for Family Day, Annual Gala, and milestone events for Fortune 500 corporations including Wipro, Intellect Design, CSK, Amazon corporate, and exclusive cultural showcases for visiting foreign delegates at Infosys.',
    badge: 'Fortune 500 Clients',
    highlights: [
      'Infosys International Delegate Cultural Showcase',
      'Wipro Technologies Annual Gala',
      'Intellect Tech Corporate Family Day',
      'Chennai Super Kings (CSK) promotional activations',
    ],
  },
  {
    id: 'inter-college-sweep',
    title: 'Inter-Collegiate Championship Victories',
    category: 'competitions',
    categoryLabel: 'Competitive Dance',
    clientOrPartner: 'IIT Guwahati, NIFT, CBIT, Badruka, Sreenidhi, VJIM',
    description:
      'Commanded podium wins across prestigious national inter-collegiate dance fests — claiming 1st place in solo, duet, and crew categories at IIT Guwahati, NIFT Hyderabad, Badruka College of Commerce, Chaitanya Bharathi Institute of Technology (CBIT), St. Mary’s College, Sreenidhi Engineering College, VJIM, and Vivekananda Youth Front.',
    badge: 'Multi-Gold Champion',
    highlights: [
      'Podium finishes across premier national engineering & business colleges',
      'Championship titles in Western, Street Dance, and Contemporary Duets',
      'Consistent top-ranking crew across Telangana and national circuits',
    ],
  },
  {
    id: 'war-of-dance',
    title: 'Finalists — War of Dance Championship',
    year: '2009',
    category: 'competitions',
    categoryLabel: 'State Tournament',
    clientOrPartner: "Twist 'n' Turn Dance Institute",
    description:
      'Emerged as celebrated grand finalists at Hyderabad’s most competitive dance battle championship "War of Dance", held at the historic Harihar Kala Bhavan in Secunderabad.',
    badge: 'Secunderabad Milestone',
    highlights: [
      'Grand finale battle at Harihar Kala Bhavan',
      'Recognised as one of Secunderabad’s pioneering modern crews',
    ],
  },
  {
    id: 'sachin-tendulkar-tribute',
    title: 'Sachin Tendulkar Birthday Tribute Flash Mob',
    category: 'social_cause',
    categoryLabel: 'Social Initiative',
    clientOrPartner: 'Army Public School, Secunderabad',
    description:
      'Conceptualised and executed a massive public flash mob as a heartfelt tribute to cricket legend Sachin Tendulkar on his birthday, staged for youth athletic encouragement in proud association with Army Public School.',
    badge: 'Youth & Sports Tribute',
    highlights: [
      'In association with Army Public School Secunderabad',
      'Public youth fitness and cricket tribute activation',
    ],
  },
  {
    id: 'jallosh-cancer-fundraiser',
    title: 'Jallosh 2k15 — Cancer Patient Charity Showcase',
    year: '2015',
    category: 'social_cause',
    categoryLabel: 'Charity Production',
    clientOrPartner: 'Mount Litera Zee School',
    description:
      'Organised the large-scale student dance production "Jallosh 2k15" in January 2015, uniting hundreds of academy dancers for a dedicated fund-raising showcase benefiting cancer patients, hosted in collaboration with Mount Litera Zee School.',
    badge: 'Charity Fundraiser',
    highlights: [
      '100% fundraiser event in aid of cancer patient treatment',
      'Collaborative production with Mount Litera Zee School',
      'Featured hundreds of academy student dancers across all age tiers',
    ],
  },
];

export const ACADEMIC_PARTNERSHIPS: AcademicTraining[] = [
  {
    id: 'loyola-degree-college',
    institution: 'Loyola Degree College, Hyderabad',
    role: 'Professional Certificate Course Director',
    tenure: '2016 – Present',
    description:
      'Directing accredited dance certificate courses for collegiate students, cultivating rigorous training in contemporary, hip-hop, and stage technique.',
    location: 'Old Alwal, Secunderabad',
    isOngoing: true,
  },
  {
    id: 'bhavans-aurobindo-college',
    institution: "Bhavan's Sri Aurobindo College, Sainikpuri",
    role: 'Professional Certificate Course Director',
    tenure: '2017 – Present',
    description:
      'Leading the official performing arts certification curriculum, mentoring undergraduate dancers for competitive festivals and annual campus productions.',
    location: 'Sainikpuri, Secunderabad',
    isOngoing: true,
  },
  {
    id: 'bhavans-degree-college',
    institution: "Bhavan's Degree College, Sainikpuri",
    role: 'Professional Dance Certificate Faculty',
    tenure: '2018 – Present',
    description:
      'Delivering credit-aligned professional dance training, choreographing annual collegiate showcases, and training campus dance society squads.',
    location: 'Sainikpuri, Secunderabad',
    isOngoing: true,
  },
  {
    id: 'bhavans-vivekananda-college',
    institution: "Bhavan's Vivekananda Degree College",
    role: 'Official Dance Instructor',
    tenure: '2010 – 2013',
    description:
      'Spearheaded the campus dance academy and structured foundational movement programmes during the formative founding years of Rhythmzz.',
    location: 'Sainikpuri, Secunderabad',
    isOngoing: false,
  },
  {
    id: 'bhavans-junior-college',
    institution: "Bhavan's Sri Aurobindo Junior College",
    role: 'Annual Production Choreographer',
    tenure: '2017 & 2018',
    description:
      'Directed full-scale stage choreography for the prestigious Annual Day productions, staging over 200 student performers in theatrical dance sequences.',
    location: 'Sainikpuri, Secunderabad',
    isOngoing: false,
  },
  {
    id: 'schools-summer-camps',
    institution: "Bhavan's Sri Ramakrishna Vidyalaya & Children's House",
    role: 'Summer Intensive Dance Camps',
    tenure: 'Multiple Seasons',
    description:
      'Curated youth immersion dance camps across school branches, introducing kids and teenagers to rhythm foundation, flexibility, and creative movement.',
    location: 'Secunderabad',
    isOngoing: false,
  },
  {
    id: 'rockwood-high-school',
    institution: 'Rockwood High School',
    role: 'Opening Ceremony Choreographer',
    tenure: 'District Sports Meet',
    description:
      'Choreographed the grand stadium opening ceremony for the District Inter-Sports Meet held at the prestigious Lal Bahadur Shastri Stadium in Hyderabad.',
    location: 'Lal Bahadur Stadium, Hyderabad',
    isOngoing: false,
  },
  {
    id: 'international-guest-workshops',
    institution: 'International Dance Instructor Exchanges',
    role: 'Curator & Host Studio',
    tenure: '2014 – Present',
    description:
      'Regularly partnering with acclaimed international guest instructors from Canada, USA, and Europe to conduct intensive masterclasses and artist residencies at Rhythmzz.',
    location: 'Neredmet Studio, Secunderabad',
    isOngoing: true,
  },
];

export const PRESS_ITEMS: PressItem[] = [
  {
    id: 'dc-paper',
    title: 'Deccan Chronicle Newspaper Feature',
    publication: 'Deccan Chronicle',
    category: 'newspaper',
    image: '/images/press/dc-paper.jpg',
    description:
      'Deccan Chronicle spotlight on Rhythmzz Academy of Dance, highlighting the emergence of high-caliber dance education in Secunderabad.',
  },
  {
    id: 'hans-india',
    title: 'The Hans India Special Report',
    publication: 'The Hans India (24th April)',
    category: 'newspaper',
    image: '/images/press/hans-india-24th-april.jpg',
    description:
      'Special print edition feature in The Hans India detailing the growth of contemporary dance, youth fitness, and professional coaching at Rhythmzz.',
  },
  {
    id: 'hdpl-finale',
    title: 'HDPL Grand Finale Press Coverage',
    publication: 'State Print Media',
    category: 'newspaper',
    image: '/images/press/hdpl-finale-news-paper-article.j.jpg',
    description:
      'Comprehensive media recap of the Hyderabad Dance Premier League Grand Finale, spotlighting 1,500+ participants and crowned state champions.',
  },
  {
    id: 'hdpl-announcement',
    title: 'Hyderabad Dance Premier League Launch',
    publication: 'Regional Press Bureau',
    category: 'newspaper',
    image: '/images/press/hdpl-news-paper-article.jpg',
    description:
      'Official newspaper publication announcing the inception of Hyderabad Dance Premier League across Andhra Pradesh and Telangana.',
  },
  {
    id: 'oct-workshop',
    title: 'October Masterclass & Workshop Feature',
    publication: 'Academy Arts Gazette',
    category: 'showcase',
    image: '/images/press/OCt-workshop-2014_Page_1.jpg',
    description:
      'Official print feature documenting Rhythmzz Academy intensive dance masterclasses and technical skill-building workshops.',
  },
  {
    id: 'inter-college-stage',
    title: 'Inter-College Dance Showcase Live Stage',
    publication: 'Stage & Event Archives',
    category: 'stage',
    image: '/images/press/IMG_20141031_140314-scaled.jpg',
    description:
      'Rhythmzz competitive crew in action during collegiate dance championships, capturing dynamic stage formations and athletic sync.',
  },
  {
    id: 'jallosh-performance',
    title: 'Jallosh 2k15 Charity Dance Presentation',
    publication: 'Charity Production Showcase',
    category: 'stage',
    image: '/images/press/IMG-20150118-WA0017.jpg',
    description:
      'Live stage performance from Jallosh 2k15 in collaboration with Mount Litera Zee School, raising vital funds for cancer patients.',
  },
  {
    id: 'stage-production-1908',
    title: 'Contemporary Production Stage Debut',
    publication: 'Festival Stage Gallery',
    category: 'stage',
    image: '/images/press/1908361_718365878281509_8605578698806625011_n.jpg',
    description:
      'Choreographic contemporary stage sequence featuring academy dancers under dramatic theatrical spotlighting.',
  },
  {
    id: 'crew-performance-1925',
    title: 'Ensemble Crew Live Choreography',
    publication: 'Live Event Series',
    category: 'stage',
    image: '/images/press/1925132_930210606998858_1323432686174199850_n.jpg',
    description:
      'Academy ensemble executing high-energy synchronized choreography at an outdoor cultural festival.',
  },
  {
    id: 'press-cutout-1030',
    title: 'Youth Performing Arts Press Spotlight',
    publication: 'Print Media Archives',
    category: 'newspaper',
    image: '/images/press/10300295_10152285316624891_7743281403421183965_n.jpg',
    description:
      'Newspaper column spotlight on Rhythmzz Academy students making waves in regional and state talent competitions.',
  },
  {
    id: 'rehearsal-stage-1035',
    title: 'Stage Production Rehearsal & Showcase',
    publication: 'Production Showcase',
    category: 'stage',
    image: '/images/press/10355797_930210693665516_2819292597888781420_n.jpg',
    description:
      'Live capture of academy dancers during technical stage dress rehearsals for annual showcase productions.',
  },
  {
    id: 'newspaper-article-1046',
    title: 'Secunderabad Dance Revolution Feature',
    publication: 'City Arts Chronicle',
    category: 'newspaper',
    image: '/images/press/10464372_10152278989984891_8964084519248705932_n.jpg',
    description:
      'Editorial write-up chronicling the mission of Rhythmzz Academy to provide structured dance certifications in East Hyderabad.',
  },
  {
    id: 'newspaper-copy-1046',
    title: 'Competition Winners Print Release',
    publication: 'City Arts Chronicle',
    category: 'newspaper',
    image: '/images/press/10464372_10152278989984891_8964084519248705932_n-Copy.jpg',
    description:
      'Press column honoring Rhythmzz competitive teams following a sweep of inter-collegiate and open dance cups.',
  },
  {
    id: 'regional-spotlight-1099',
    title: 'Regional Media Dance Spotlight',
    publication: 'Telangana Press Release',
    category: 'newspaper',
    image: '/images/press/10990888_718555318262565_8553633992839105554_n.jpg',
    description:
      'Print spotlight detailing the academy curriculum and community training programmes in Sainikpuri and Neredmet.',
  },
  {
    id: 'felicitation-ceremony-1100',
    title: 'Stage Felicitation & Honors Ceremony',
    publication: 'Academy Awards & Honors',
    category: 'stage',
    image: '/images/press/11008392_718369924947771_6292065215810326631_n.jpg',
    description:
      'Rhythmzz faculty and senior dancers felicitated on stage by cultural dignitaries for meritorious contributions to the arts.',
  },
  {
    id: 'print-cutout-140411',
    title: 'Print Media Archives — Youth Talent',
    publication: 'Regional Daily',
    category: 'newspaper',
    image: '/images/press/1404116315981.jpg',
    description:
      'Archived newspaper clipping honoring student milestones and academy participation in landmark cultural events.',
  },
  {
    id: 'print-cutout-140439',
    title: 'Media Archive — Performance Bulletin',
    publication: 'Cultural News Digest',
    category: 'newspaper',
    image: '/images/press/1404399646700.jpg',
    description:
      'Press notice celebrating the academy’s school partnerships and academic certifications in Hyderabad.',
  },
];

export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    name: 'Linktree',
    handle: '@rhythmzzdance.in',
    href: 'https://linktr.ee/rhythmzzdance.in',
    description: 'All official links, workshops, class bookings, and portals in one hub.',
    icon: 'linktree',
    badge: 'Official Hub',
  },
  {
    name: 'Instagram',
    handle: '@rhythmzzdance.live',
    href: 'https://www.instagram.com/rhythmzzdance.live',
    description: 'Daily studio reels, choreographies, student spotlights, and announcements.',
    icon: 'instagram',
    badge: 'Active Daily',
  },
  {
    name: 'Facebook',
    handle: 'Rhythmzz Academy of Dance',
    href: 'https://www.facebook.com/rhythmzzdance',
    description: 'Community photo albums, event galleries, and institutional achievements.',
    icon: 'facebook',
  },
  {
    name: 'WhatsApp Support',
    handle: '+91 9052980859',
    href: 'https://wa.me/919052980859?text=Hi%20Rhythmzz!%20I%20visited%20the%20Events%20%26%20Achievements%20page%20and%20would%20like%20to%20enquire.',
    description: 'Direct admissions desk for trials, schedules, fees, and rental bookings.',
    icon: 'whatsapp',
    badge: 'Quick Response',
  },
];
