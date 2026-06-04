// Weekly SEO keyword-idea agent.
//
// Researches the web (Tavily) for what Central-Illinois insurance shoppers are
// actually searching, then asks OpenAI for the 5 best LONG-TAIL blog ideas
// (3-4 word phrases we can realistically rank for — never broad head terms
// like "home insurance"). Results are persisted to `keyword_ideas` and emailed
// via Resend. Reuses the same OpenAI/Tavily approach as generateBlogPost.

import { db, initDb } from "./db";

export type KeywordIdea = {
  keyword: string;
  title: string;
  rationale: string;
  intent: string;
};

/** Today's date (America/Chicago) as YYYY-MM-DD — used as the batch key. */
export function centralDateString(): string {
  // en-CA gives YYYY-MM-DD formatting.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Short weekday in America/Chicago, e.g. "Mon". */
export function centralWeekday(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
  }).format(new Date());
}

// One Tavily search; returns aggregated snippet text (best-effort).
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
        max_results: 5,
        include_answer: true,
      }),
    });
    if (!res.ok) return "";
    const json = (await res.json()) as {
      answer?: string;
      results?: { title?: string; content?: string }[];
    };
    const parts: string[] = [];
    if (json.answer) parts.push(json.answer);
    for (const r of json.results ?? []) {
      if (r.content) parts.push(r.content);
    }
    return parts.join("\n");
  } catch {
    return "";
  }
}

// Gather research context from a few targeted queries about what local
// insurance shoppers ask. Kept small to stay within time/token limits.
async function gatherResearch(): Promise<string> {
  const queries = [
    "common insurance questions homeowners and drivers ask in Illinois",
    "Springfield Illinois insurance long tail keywords low competition",
    "landlord and duplex insurance questions Illinois",
    "life and business insurance questions small business owners ask",
  ];
  const results = await Promise.all(queries.map((q) => tavilySearch(q)));
  return results.filter(Boolean).join("\n\n").slice(0, 7000);
}

/**
 * Generate the top 5 long-tail blog ideas. Returns ideas (possibly empty on
 * failure) plus a human-readable error for logging.
 */
export async function researchKeywordIdeas(): Promise<{
  ideas: KeywordIdea[];
  error?: string;
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { ideas: [], error: "OPENAI_API_KEY not configured" };

  const research = await gatherResearch();

  const systemPrompt = [
    "You are an SEO strategist for Kover King Insurance, an independent insurance agency in Springfield, IL (serving Central Illinois) that compares 30+ carriers.",
    "Propose blog post ideas that the agency can realistically RANK for and that will drive qualified organic traffic over time.",
    "HARD RULES for each idea's keyword:",
    "- It MUST be a long-tail phrase of 3 to 5 words (count the words).",
    '- NEVER propose broad head terms like "home insurance", "auto insurance", "life insurance" — we cannot rank for those.',
    "- Favor specific, intent-rich phrases, ideally with a local (Springfield/Illinois) or situational angle, e.g. \"duplex insurance for landlords\", \"teen driver insurance Illinois\", \"home insurance after roof claim\".",
    "- Each keyword must be distinct (different topic/theme).",
    "Return ONLY JSON of the form {\"ideas\":[{\"keyword\":string,\"title\":string,\"rationale\":string,\"intent\":string}]} with EXACTLY 5 ideas.",
    "title = a compelling blog post title built on the keyword. rationale = one sentence on why it can rank and the traffic/why-it-matters. intent = the searcher's intent (informational, commercial, etc.).",
  ].join("\n");

  const userPrompt = research
    ? `Here is fresh web research about what insurance shoppers in this market are searching and asking. Use it to ground your ideas:\n\n${research}`
    : "No external research is available; use accurate general knowledge of insurance search behavior in Central Illinois.";

  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      max_tokens: 1500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    let parsed: { ideas?: KeywordIdea[] };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ideas: [], error: "AI returned invalid JSON" };
    }
    const ideas = (parsed.ideas ?? [])
      .filter((i) => i && i.keyword && i.title)
      .slice(0, 5)
      .map((i) => ({
        keyword: String(i.keyword).trim(),
        title: String(i.title).trim(),
        rationale: String(i.rationale ?? "").trim(),
        intent: String(i.intent ?? "").trim(),
      }));
    if (ideas.length === 0) return { ideas: [], error: "AI returned no ideas" };
    return { ideas };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { ideas: [], error: `OpenAI call failed: ${msg}` };
  }
}

/** Save a batch of ideas to the DB under today's Central date. */
export async function persistIdeas(
  batchDate: string,
  ideas: KeywordIdea[]
): Promise<void> {
  await initDb();
  for (let i = 0; i < ideas.length; i++) {
    const idea = ideas[i];
    await db.execute({
      sql: "INSERT INTO keyword_ideas (batch_date, rank, keyword, title, rationale, intent) VALUES (?, ?, ?, ?, ?, ?)",
      args: [batchDate, i + 1, idea.keyword, idea.title, idea.rationale, idea.intent],
    });
  }
}

function ideasEmailHtml(batchDate: string, ideas: KeywordIdea[]): string {
  const rows = ideas
    .map(
      (idea, i) => `
      <tr>
        <td style="padding:16px;border-bottom:1px solid #eee;vertical-align:top;">
          <div style="font-size:13px;color:#E9560C;font-weight:700;">#${i + 1} · ${escapeHtml(
            idea.keyword
          )}</div>
          <div style="font-size:16px;font-weight:700;color:#171717;margin:4px 0;">${escapeHtml(
            idea.title
          )}</div>
          <div style="font-size:14px;color:#525252;line-height:1.5;">${escapeHtml(
            idea.rationale
          )}</div>
          <div style="font-size:12px;color:#737373;margin-top:4px;">Intent: ${escapeHtml(
            idea.intent || "—"
          )}</div>
        </td>
      </tr>`
    )
    .join("");
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;">
    <div style="background:#E9560C;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
      <div style="font-size:20px;font-weight:800;">Kover King · Weekly SEO Ideas</div>
      <div style="font-size:13px;opacity:.9;">Top 5 long-tail blog opportunities · ${escapeHtml(
        batchDate
      )}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;">
      ${rows}
    </table>
    <p style="font-size:12px;color:#737373;margin-top:16px;">
      Generated by your AI SEO agent. Open the admin → Keyword Ideas to turn any of these into a post in one click.
    </p>
  </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Email the ideas via Resend. Best-effort; returns a status for logging. */
export async function sendIdeasEmail(
  batchDate: string,
  ideas: KeywordIdea[]
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, error: "RESEND_API_KEY not configured" };
  const from = process.env.EMAIL_FROM || "Kover King SEO <seo@koverking.com>";
  const to = process.env.EMAIL_TO || "doug@aideveloper.dev";
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Top 5 SEO blog ideas — week of ${batchDate}`,
      html: ideasEmailHtml(batchDate, ideas),
    });
    if (error) return { sent: false, error: String((error as { message?: string }).message ?? error) };
    return { sent: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { sent: false, error: `Resend send failed: ${msg}` };
  }
}

/**
 * Full weekly run: research → persist → email. Returns a summary used by both
 * the cron endpoint and the admin "Generate now" button.
 */
export async function runWeeklyKeywordIdeas(): Promise<{
  success: boolean;
  batchDate: string;
  ideas: KeywordIdea[];
  emailed: boolean;
  error?: string;
}> {
  const batchDate = centralDateString();
  const { ideas, error } = await researchKeywordIdeas();
  if (ideas.length === 0) {
    return { success: false, batchDate, ideas: [], emailed: false, error };
  }
  await persistIdeas(batchDate, ideas);
  const { sent, error: emailError } = await sendIdeasEmail(batchDate, ideas);
  return {
    success: true,
    batchDate,
    ideas,
    emailed: sent,
    error: emailError,
  };
}
