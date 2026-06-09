// Local-SEO link-opportunity finder.
//
// Surfaces every kind of local backlink/citation opportunity for Kover King,
// not just directories: business directories, niche (insurance) directories,
// chambers / local orgs, sponsorship targets, complementary-business
// partnerships, local news/PR, and resource-page/guest-post targets.
// Combines a hand-picked SEED list (always present) with live AI research
// (Tavily + GPT). No new API keys.

export type Directory = {
  name: string;
  url: string;
  category: string;
  notes: string;
};

// Canonical categories (UI groups + colors key off these).
export const LINK_CATEGORIES = [
  "Directory", // general business directories (Google, Yelp, BBB...)
  "Insurance", // niche / industry directories
  "Local IL", // chambers, local orgs, city/county directories
  "Sponsorship", // sponsor a team/event/charity -> link from sponsors page
  "Partnership", // complementary local businesses to swap/earn links
  "News/PR", // local news + press opportunities
  "Resource", // resource pages / guest-post / community blogs
] as const;

// High-value opportunities that always apply to a local US insurance agency.
export const SEED_DIRECTORIES: Directory[] = [
  // ── Core directories ──
  { name: "Google Business Profile", url: "https://www.google.com/business/", category: "Directory", notes: "The single most important local listing. Free." },
  { name: "Bing Places", url: "https://www.bingplaces.com/", category: "Directory", notes: "Microsoft/Bing equivalent of Google Business." },
  { name: "Apple Business Connect", url: "https://businessconnect.apple.com/", category: "Directory", notes: "Listing for Apple Maps." },
  { name: "Yelp for Business", url: "https://business.yelp.com/", category: "Directory", notes: "Major review + directory site." },
  { name: "Better Business Bureau", url: "https://www.bbb.org/get-accredited", category: "Directory", notes: "Trust signal; listing valuable even without accreditation." },
  { name: "Facebook Page", url: "https://www.facebook.com/business/pages", category: "Directory", notes: "Business Page doubles as a directory listing." },
  { name: "YellowPages", url: "https://www.yellowpages.com/", category: "Directory", notes: "Long-standing general directory." },
  { name: "Manta", url: "https://www.manta.com/", category: "Directory", notes: "Small-business directory." },
  { name: "Foursquare", url: "https://business.foursquare.com/", category: "Directory", notes: "Feeds many map/app data providers." },
  // ── Insurance / niche ──
  { name: "TrustedChoice.com", url: "https://www.trustedchoice.com/", category: "Insurance", notes: "Independent insurance agent directory (Big I / IIABA)." },
  { name: "Insurance.com agent finder", url: "https://www.insurance.com/agents", category: "Insurance", notes: "Insurance-specific agent listings." },
  // ── Local Illinois orgs ──
  { name: "Greater Springfield Chamber of Commerce", url: "https://www.gscc.org/", category: "Local IL", notes: "Member directory listing for Springfield, IL." },
  { name: "Illinois Chamber of Commerce", url: "https://ilchamber.org/", category: "Local IL", notes: "Statewide chamber member directory." },
  // ── Sponsorship / partnership prompts (the AI fills in specific local ones) ──
  { name: "Local sports teams / Little League (sponsor a team)", url: "https://www.littleleague.org/", category: "Sponsorship", notes: "Sponsoring a Springfield team usually earns a sponsors-page link." },
  { name: "Local charity 5K / event sponsorships", url: "https://www.google.com/search?q=springfield+il+charity+5k+sponsors", category: "Sponsorship", notes: "Event/charity sites list + link sponsors. Strong local signal." },
  { name: "Real estate agents & mortgage brokers (referral partners)", url: "https://illinoismortgage.co/", category: "Partnership", notes: "Complementary local businesses — swap referrals + links (e.g. our mortgage site)." },
  // ── Local news ──
  { name: "The State Journal-Register (Springfield news)", url: "https://www.sj-r.com/", category: "News/PR", notes: "Local paper — expert quotes / community stories earn high-authority links." },
];

async function tavilySearch(query: string): Promise<string> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return "";
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query,
        search_depth: "basic",
        max_results: 6,
        include_answer: true,
      }),
    });
    if (!res.ok) return "";
    const json = (await res.json()) as {
      answer?: string;
      results?: { title?: string; url?: string; content?: string }[];
    };
    const parts: string[] = [];
    if (json.answer) parts.push(json.answer);
    for (const r of json.results ?? []) {
      if (r.title || r.url) parts.push(`${r.title ?? ""} ${r.url ?? ""} ${r.content ?? ""}`);
    }
    return parts.join("\n");
  } catch {
    return "";
  }
}

/** AI-research local link opportunities across all categories. */
export async function researchDirectories(): Promise<Directory[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return [];

  const queries = [
    "best business directories for local SEO citations United States",
    "Springfield Illinois Sangamon County chamber of commerce business directory",
    "insurance agency directories submit your agency listing",
    "Springfield Illinois charity events 5k sponsorship local business sponsors",
    "Springfield Illinois community organizations sponsorship opportunities",
    "Springfield Illinois local news submit press release business",
    "complementary businesses to partner with insurance agency referrals real estate mortgage",
  ];
  const research = (await Promise.all(queries.map(tavilySearch)))
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 9000);

  const system = [
    "You build a LOCAL-SEO link-opportunity list for Kover King Insurance, an independent insurance agency in Springfield, IL (Sangamon County). It also has a sister mortgage site (illinoismortgage.co) that is a natural referral/link partner.",
    "From the research, extract REAL, specific opportunities where the agency could earn a backlink or citation that links to its site.",
    "Each item is one of these categories:",
    "- Directory: general business directory/listing site.",
    "- Insurance: insurance/independent-agent niche directory.",
    "- Local IL: Springfield/Illinois chamber, civic org, or local business directory.",
    "- Sponsorship: a local team/event/charity that lists & links its sponsors.",
    "- Partnership: a complementary local business type (real estate, mortgage, auto dealer, contractor) to swap referrals/links with.",
    "- News/PR: a local news/media outlet that covers community business stories.",
    "- Resource: a local blog, 'community resources' page, or guest-post target.",
    "EXCLUDE: competitor insurance agencies, generic listicles/'best of' articles that aren't submittable, and anything not tied to a real link opportunity.",
    'Return ONLY JSON: {"items":[{"name":string,"url":string,"category":string,"notes":string}]} with up to 18 entries, a mix across categories (not all directories).',
    "notes is a short (<=110 char) reason / how to get the link. url must be a real site (or a sensible search URL for sponsorship/partnership prospecting).",
  ].join("\n");

  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      max_tokens: 2000,
      messages: [
        { role: "system", content: system },
        { role: "user", content: research || "No research available; use well-known opportunities." },
      ],
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    // Accept either {items:[...]} (new) or {directories:[...]} (back-compat).
    const list = Array.isArray(parsed.items)
      ? parsed.items
      : Array.isArray(parsed.directories)
        ? parsed.directories
        : [];
    const allowed = new Set<string>(LINK_CATEGORIES as readonly string[]);
    return list
      .filter((d: Directory) => d && d.name && d.url && /^https?:\/\//i.test(d.url))
      .map((d: Directory) => ({
        name: String(d.name).trim(),
        url: String(d.url).trim(),
        category: allowed.has(String(d.category).trim())
          ? String(d.category).trim()
          : "Directory",
        notes: String(d.notes || "").trim(),
      }));
  } catch {
    return [];
  }
}
