export function StructuredData() {
  const danceSchoolSchema = {
    "@context": "https://schema.org",
    "@type": "DanceSchool",
    "@id": "https://www.rhythmzzdance.com/#organization",
    "name": "Rhythmzz Academy of Dance",
    "alternateName": ["Rhythmzz Dance Academy","Rhythmzz Academy"],
    "url": "https://www.rhythmzzdance.com",
    "logo": "https://www.rhythmzzdance.com/logo.png",
    "image": "https://www.rhythmzzdance.com/og-image.jpg",
    "description": "Rhythmzz Academy of Dance is Secunderabad's premier dance and fitness studio...",
    // Full schema based on HTML reference
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      // FAQs based on HTML reference
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Home","item":"https://www.rhythmzzdance.com/"},
      {"@type":"ListItem","position":2,"name":"Dance Classes Secunderabad","item":"https://www.rhythmzzdance.com/#programs"}
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(danceSchoolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
