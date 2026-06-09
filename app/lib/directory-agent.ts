// Local-SEO directory finder.
//
// Surfaces business-directory sites (Yelp, BBB, Google, IL/Springfield
// chambers, insurance directories) where Kover King should list its NAP to
// earn backlinks + local-ranking signals. Combines a hand-picked SEED list
// (always present) with live AI research (Tavily + GPT). No new API keys.

export type Directory = {
  name: string;
  url: string;
  category: string;
  notes: string;
};

// High-value directories that always apply to a local US insurance agency.
export const SEED_DIRECTORIES: Directory[] = [
  { name: "Google Business Profile", url: "https://www.google.com/business/", category: "Core", notes: "The single most important local listing. Free." },
  { name: "Bing Places", url: "https://www.bingplaces.com/", category: "Core", notes: "Microsoft/Bing equivalent of Google Business." },
  { name: "Apple Business Connect", url: "https://businessconnect.apple.com/", category: "Core", notes: "Listing for Apple Maps." },
  { name: "Yelp for Business", url: "https://business.yelp.com/", category: "Core", notes: "Major review + directory site." },
  { name: "Better Business Bureau", url: "https://www.bbb.org/get-accredited", category: "Core", notes: "Trust signal; accreditation optional, listing valuable." },
  { name: "Facebook Page", url: "https://www.facebook.com/business/pages", category: "Core", notes: "Business Page doubles as a directory listing." },
  { name: "YellowPages", url: "https://www.yellowpages.com/", category: "General", notes: "Long-standing general directory." },
  { name: "Yellowbook / Manta", url: "https://www.manta.com/", category: "General", notes: "Small-business directory." },
  { name: "Foursquare", url: "https://business.foursquare.com/", category: "General", notes: "Feeds many map/app data providers." },
  { name: "TrustedChoice.com", url: "https://www.trustedchoice.com/", category: "Insurance", notes: "Independent insurance agent directory (IIABA)." },
  { name: "Insurance Agents (Insurance.com / agency finders)", url: "https://www.insurance.com/agents", category: "Insurance", notes: "Insurance-specific agent listings." },
  { name: "Greater Springfield Chamber of Commerce", url: "https://www.gscc.org/", category: "Local IL", notes: "Springfield, IL chamber member directory." },
  { name: "Illinois Chamber of Commerce", url: "https://ilchamber.org/", category: "Local IL", notes: "Statewide chamber directory." },
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

/** AI-research additional IL / insurance / Springfield directories. */
export async function researchDirectories(): Promise<Directory[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return [];

  const queries = [
    "best business directories for local SEO citations United States",
    "Illinois business directory submit listing",
    "Springfield Illinois Sangamon County business directory chamber of commerce",
    "insurance agency directories submit your agency listing",
  ];
  const research = (await Promise.all(queries.map(tavilySearch)))
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 7000);

  const system = [
    "You build a local-SEO citation list for Kover King Insurance, an independent insurance agency in Springfield, IL (Sangamon County).",
    "From the research, extract REAL business-directory / listing sites where the agency could create a NAP listing that links back to its site.",
    "INCLUDE: general directories, Illinois/Springfield local directories and chambers, and insurance-specific agent directories.",
    "EXCLUDE: blog posts, articles, news, 'best of' listicles, competitor agency sites, and anything that is not a place to submit a business listing.",
    'Return ONLY JSON: {"directories":[{"name":string,"url":string,"category":string,"notes":string}]} with up to 12 entries.',
    "category is one of: Core, General, Local IL, Insurance. notes is a short (<=100 char) reason it is worth a listing. url must be a real submittable directory site.",
  ].join("\n");

  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      max_tokens: 1500,
      messages: [
        { role: "system", content: system },
        { role: "user", content: research || "No research available; use well-known directories." },
      ],
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    const list = Array.isArray(parsed.directories) ? parsed.directories : [];
    return list
      .filter((d: Directory) => d && d.name && d.url && /^https?:\/\//i.test(d.url))
      .map((d: Directory) => ({
        name: String(d.name).trim(),
        url: String(d.url).trim(),
        category: String(d.category || "General").trim(),
        notes: String(d.notes || "").trim(),
      }));
  } catch {
    return [];
  }
}
