const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.diwaar.com/#organization",
      name: "diwaar.com",
      url: "https://www.diwaar.com",
      logo: "https://www.diwaar.com/favicon.svg",
      description:
        "Property portal for houses, flats, plots and commercial property for sale and rent in Pakistan.",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.diwaar.com/#website",
      name: "diwaar.com",
      url: "https://www.diwaar.com",
      publisher: { "@id": "https://www.diwaar.com/#organization" },
      inLanguage: ["en", "ur"],
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.diwaar.com/search?purpose=buy&q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export function SiteSchema() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
