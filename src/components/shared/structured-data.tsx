import { getProgrammes } from '@/data/programmes';
import { getFAQs } from '@/data/content';

const SITE = 'https://www.rhythmzzdance.com';

// Reference offer copy per programme slug (batch windows from the studio schedule).
const OFFER_DETAILS: Record<string, { name: string; description: string }> = {
  'kids-dance': {
    name: 'Kids Dance Programme',
    description:
      'Bollywood, Hip Hop, Contemporary and Performance Training for children aged 5 and above. Led by Deepak. Monday to Wednesday 5 to 7 PM.',
  },
  'adults-dance': {
    name: 'Adults Dance Programme',
    description:
      'Bollywood, Contemporary, Hip Hop and Choreography for adults aged 16 and above. Led by Nitish. Monday to Wednesday 7 to 9 PM.',
  },
  'mind-body-fitness': {
    name: 'Mind and Body Fitness',
    description:
      'Zumba, Yoga, Pilates, HIIT, Strength Training, Tabata, Core and Mobility. Led by Shailaja. Monday to Friday, 9:30 to 10:30 AM.',
  },
  kuchipudi: {
    name: 'Kuchipudi Classical Dance',
    description:
      'Level-based certified Kuchipudi programme taught by Srusti. Foundation through Advanced. Friday and Saturday 6:30 to 7:30 PM.',
  },
};

/** Homepage structured data — ported from the design reference, with offers and
 *  FAQs derived from the data layer so the schema tracks content changes. */
export async function StructuredData() {
  const [programmes, faqs] = await Promise.all([getProgrammes(), getFAQs()]);

  // FAQPage entities from the FAQ data (already the reference Q&As by default)
  let faqItems: { question: string; answer: string }[] = [];
  if (Array.isArray(faqs)) faqItems = faqs;
  else if (typeof faqs === 'string') {
    try { faqItems = JSON.parse(faqs); } catch {}
  }

  const danceSchoolSchema = {
    '@context': 'https://schema.org',
    '@type': 'DanceSchool',
    '@id': `${SITE}/#organization`,
    name: 'Rhythmzz Academy of Dance',
    alternateName: ['Rhythmzz Dance Academy', 'Rhythmzz Academy'],
    url: SITE,
    logo: `${SITE}/logo.png`,
    image: `${SITE}/og-image.jpg`,
    description:
      'Rhythmzz Academy of Dance is a dance and fitness studio at Neredmet X Road, Secunderabad — teaching since 2010 with 5,000+ students trained. Programmes: Kids Dance, Adults Dance, Mind and Body Fitness and Kuchipudi Classical, plus studio rental.',
    foundingDate: '2013',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot 597, 3rd Floor, Above ICICI ATM, Neredmet X Road Bus Stop',
      addressLocality: 'Secunderabad',
      addressRegion: 'Telangana',
      postalCode: '500094',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.4431,
      longitude: 78.5032,
    },
    hasMap: 'https://maps.google.com/?q=Rhythmzz+Academy+of+Dance+Neredmet+Secunderabad',
    telephone: '+919052980859',
    email: 'rhythmzzdance@gmail.com',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '06:00',
        closes: '21:00',
      },
    ],
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'UPI, Cash',
    sameAs: [
      'https://www.instagram.com/rhythmzzdance.live',
      'https://www.facebook.com/rhythmzzdance',
    ],
    areaServed: [
      { '@type': 'City', name: 'Secunderabad' },
      { '@type': 'City', name: 'Hyderabad' },
      { '@type': 'Neighborhood', name: 'Neredmet' },
      { '@type': 'Neighborhood', name: 'Sainikpuri' },
      { '@type': 'Neighborhood', name: 'AS Rao Nagar' },
      { '@type': 'Neighborhood', name: 'Yapral' },
      { '@type': 'Neighborhood', name: 'Malkajgiri' },
      { '@type': 'Neighborhood', name: 'Kapra' },
      { '@type': 'Neighborhood', name: 'Hastinapuri' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Dance and Fitness Programmes',
      itemListElement: programmes.map((p: any) => ({
        '@type': 'Offer',
        name: OFFER_DETAILS[p.slug]?.name ?? `${p.name} Programme`,
        description: OFFER_DETAILS[p.slug]?.description ?? p.description,
        price: String(p.fees_monthly),
        priceCurrency: 'INR',
      })),
    },
    founder: {
      '@type': 'Person',
      name: 'Nitish',
      jobTitle: 'Founder and Artistic Director',
      description:
        'ISPTD-certified dance instructor with over 15 years of teaching experience and 5,000+ students trained. Represented India at nATFEST International Contemporary Dance Festival, Sri Lanka, 2017.',
    },
    award: [
      'IAO International Accreditation Organization USA 2014',
      'Art Unites Award',
      'Indywood Film Carnival Recognition',
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Dance Classes Secunderabad',
        item: `${SITE}/programmes`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(danceSchoolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
