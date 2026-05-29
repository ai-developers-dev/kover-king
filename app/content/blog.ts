// Blog content store.
//
// Posts live here as plain data — no CMS, no extra dependencies. To publish a
// new post, add an object to the `posts` array below. The /blog index and the
// /blog/$slug template render from this array automatically, and Article +
// Breadcrumb JSON-LD is generated from each post's metadata.
//
// `body` is an ordered list of blocks. Supported block types:
//   { type: "heading", text }      -> <h2>
//   { type: "paragraph", text }    -> <p>
//   { type: "list", items: [...] } -> <ul>

export type BlogBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, e.g. "2026-05-29". Used for sorting and Article schema. */
  datePublished: string;
  dateModified?: string;
  author?: string;
  /** Optional short label shown on the card and post (e.g. "Auto Insurance"). */
  category?: string;
  /** Estimated read time in minutes, shown on the card/post. */
  readMinutes?: number;
  body: BlogBlock[];
};

// Sample post so the index and template render out of the box. Replace or
// remove it as real content is written — every fact below is generic insurance
// education, not a Kover King business claim.
export const posts: BlogPost[] = [
  {
    slug: "how-to-lower-your-car-insurance-premium",
    title: "How to Lower Your Car Insurance Premium",
    description:
      "Practical, no-nonsense ways to reduce your auto insurance costs without sacrificing the coverage you actually need.",
    datePublished: "2026-05-29",
    author: "Kover King Insurance",
    category: "Auto Insurance",
    readMinutes: 4,
    body: [
      {
        type: "paragraph",
        text: "Car insurance is one of those bills most people set and forget. But premiums change every year, and a little attention at renewal time can put real money back in your pocket. Here are the levers that actually move your rate.",
      },
      { type: "heading", text: "Raise your deductible" },
      {
        type: "paragraph",
        text: "Your deductible is what you pay out of pocket before coverage kicks in. Moving from a $250 to a $500 or $1,000 deductible can noticeably lower your premium — just make sure you keep enough in savings to cover the higher amount if you need to file a claim.",
      },
      { type: "heading", text: "Bundle your policies" },
      {
        type: "paragraph",
        text: "Insuring your home (or renters) and auto with the same carrier often unlocks a multi-policy discount. As an independent agency, we can compare bundle pricing across carriers to find where the combined savings are largest.",
      },
      { type: "heading", text: "Ask about every discount you qualify for" },
      {
        type: "list",
        items: [
          "Safe-driver and accident-free discounts",
          "Good-student discounts for drivers under 25",
          "Low-mileage or usage-based (telematics) programs",
          "Paid-in-full and paperless billing discounts",
        ],
      },
      { type: "heading", text: "Review your coverage on older vehicles" },
      {
        type: "paragraph",
        text: "If your car is paid off and its value has dropped, carrying collision and comprehensive may no longer make financial sense. A quick policy review can tell you whether you are paying to insure more than the car is worth.",
      },
      { type: "heading", text: "Shop your rate, don't just renew" },
      {
        type: "paragraph",
        text: "The single biggest mistake drivers make is auto-renewing without comparison. Rates for the same driver can vary by hundreds of dollars between carriers. If you'd like a no-obligation comparison, give us a call — we'll do the shopping for you.",
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  // Newest first.
  return [...posts].sort((a, b) =>
    a.datePublished < b.datePublished ? 1 : a.datePublished > b.datePublished ? -1 : 0
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Format an ISO date as e.g. "May 29, 2026" for display. */
export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  if (!y || !m || !d) return iso;
  return `${months[m - 1]} ${d}, ${y}`;
}
