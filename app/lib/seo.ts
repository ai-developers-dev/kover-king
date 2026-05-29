// Centralized SEO helpers: canonical URLs, business NAP, and structured-data
// builders. Keeping NAP in one place keeps the Name/Address/Phone identical
// across the footer, the contact page, and every JSON-LD block — which is what
// Google's local-SEO matching against the Google Business Profile expects.

export const SITE_URL = "https://koverking.com";

/** Absolute, self-referencing canonical URL for a route path. */
export function canonical(path: string): string {
  if (path === "/" || path === "") return `${SITE_URL}/`;
  return `${SITE_URL}${path}`;
}

// Name / Address / Phone. The street address is a placeholder — fill in the
// real street from the Google Business Profile. ZIP and city already match
// what the site displays; do NOT invent a different address.
export const NAP = {
  name: "Kover King Insurance",
  streetAddress: "7612 Wentworth Dr.",
  addressLocality: "Springfield",
  addressRegion: "IL",
  postalCode: "62711",
  telephone: "+1-217-960-8997",
  telephoneDisplay: "(217) 960-8997",
  email: "info@koverking.com",
} as const;

/** One-line, human-readable address for visible UI (footer, contact page). */
export const ADDRESS_LINE = `${NAP.streetAddress}, ${NAP.addressLocality}, ${NAP.addressRegion} ${NAP.postalCode}`;

const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: NAP.streetAddress,
  addressLocality: NAP.addressLocality,
  addressRegion: NAP.addressRegion,
  postalCode: NAP.postalCode,
  addressCountry: "US",
};

// The agency, reused as the `provider` of every Service.
const PROVIDER = {
  "@type": "InsuranceAgency",
  name: NAP.name,
  url: SITE_URL,
  telephone: NAP.telephone,
  address: POSTAL_ADDRESS,
};

/** Service schema with the agency as provider. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  serviceType: string;
  path: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    areaServed: { "@type": "Place", name: opts.areaServed ?? "Springfield, IL" },
    provider: PROVIDER,
    url: canonical(opts.path),
  };
}

/** FAQPage schema built from on-page FAQ content (text must match the page). */
export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

/** BreadcrumbList schema. crumbs are ordered from Home to the current page. */
export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: canonical(c.path),
    })),
  };
}

/** Serialize one or more schema objects for a JSON-LD <script> tag. */
export function jsonLd(...schemas: object[]): string {
  return JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
}
