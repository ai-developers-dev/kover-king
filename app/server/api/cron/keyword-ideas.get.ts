import {
  defineEventHandler,
  getHeader,
  getQuery,
  setResponseHeader,
  setResponseStatus,
} from "nitro/h3";
import { runWeeklyKeywordIdeas, centralWeekday } from "../../../lib/seo-agent";

// Weekly SEO keyword-idea job.
//
// Scheduled DAILY in vercel.json but self-gates to Mondays (America/Chicago),
// which keeps it compatible with Vercel Hobby (daily-only cron) and is
// DST-safe. Vercel Cron calls this with `Authorization: Bearer <CRON_SECRET>`.
// A `?key=` query fallback is allowed for manual testing.
export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Content-Type", "application/json");

  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = getHeader(event, "authorization") || "";
    const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const keyParam = String((getQuery(event).key as string) || "");
    if (bearer !== secret && keyParam !== secret) {
      setResponseStatus(event, 401);
      return JSON.stringify({ ok: false, error: "Unauthorized" });
    }
  }

  // Only run on Mondays (Central). `?force=1` overrides for manual testing.
  const force = String((getQuery(event).force as string) || "") === "1";
  if (!force && centralWeekday() !== "Mon") {
    return JSON.stringify({ ok: true, skipped: true, reason: "not Monday (Central)" });
  }

  try {
    const result = await runWeeklyKeywordIdeas();
    return JSON.stringify({
      ok: result.success,
      batchDate: result.batchDate,
      count: result.ideas.length,
      emailed: result.emailed,
      keywords: result.ideas.map((i) => i.keyword),
      error: result.error,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    setResponseStatus(event, 500);
    return JSON.stringify({ ok: false, error: msg });
  }
});
