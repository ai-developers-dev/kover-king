// Backlink outreach agent.
//
// For each site we cite as a "Source" in a blog post, try to discover a contact
// email (serverless-safe: plain fetch + regex — no headless browser), draft a
// relationship-first, CAN-SPAM-compliant link-request email, and send it via
// Resend. Sending is always user-approved per recipient (see admin Outreach
// tab); nothing here sends automatically.

import { NAP, ADDRESS_LINE, SITE_URL } from "./seo";

const UA =
  "Mozilla/5.0 (compatible; KoverKingOutreach/1.0; +https://koverking.com)";

// Junk local-parts / addresses we never want to contact.
const BAD_EMAIL = /(example|sentry|wix|squarespace|godaddy|\.png|\.jpg|\.gif|\.svg|@sentry|@example|noreply|no-reply|donotreply)/i;
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

async function fetchText(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html" },
      signal: controller.signal,
      redirect: "follow",
    });
    if (!res.ok) return "";
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html") && !ct.includes("text/plain")) return "";
    return await res.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

// Pull the best email from a blob of HTML, preferring the target domain.
function pickEmail(html: string, domain: string): string | null {
  if (!html) return null;
  const found = new Set<string>();
  // mailto: links first (most reliable).
  const mailtoRe = /mailto:([^"'?>\s]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = mailtoRe.exec(html)) !== null) {
    const e = decodeURIComponent(m[1]).toLowerCase().trim();
    if (e.includes("@") && !BAD_EMAIL.test(e)) found.add(e);
  }
  // Bare addresses in text.
  const bare = html.toLowerCase().match(EMAIL_RE) || [];
  for (const e of bare) if (!BAD_EMAIL.test(e)) found.add(e);

  if (found.size === 0) return null;
  const root = domain.replace(/^www\./, "");
  const list = [...found];
  // Prefer an address on the same root domain.
  const onDomain = list.find((e) => e.endsWith("@" + root) || e.endsWith("." + root));
  return onDomain || list[0];
}

// Find the first internal contact/about URL referenced in the HTML.
function findContactPath(html: string, base: string): string | null {
  const re = /href=["']([^"']*(?:contact|about)[^"']*)["']/i;
  const m = re.exec(html);
  if (!m) return null;
  try {
    return new URL(m[1], base).toString();
  } catch {
    return null;
  }
}

/** Best-effort contact-email discovery for a domain. Returns null if none. */
export async function discoverEmail(domain: string): Promise<string | null> {
  const clean = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  for (const base of [`https://${clean}`, `http://${clean}`]) {
    const html = await fetchText(base);
    if (!html) continue;
    const direct = pickEmail(html, clean);
    if (direct) return direct;
    const contactUrl = findContactPath(html, base);
    if (contactUrl) {
      const contactHtml = await fetchText(contactUrl);
      const fromContact = pickEmail(contactHtml, clean);
      if (fromContact) return fromContact;
    }
    return null; // got HTML but no email — don't retry http if https worked
  }
  return null;
}

export type OutreachDraft = { subject: string; body: string };

/**
 * Relationship-first link-request email. References the specific article of
 * ours that cites them, makes a soft ask, and includes the CAN-SPAM footer
 * (real postal address + opt-out). Plain text with a couple of links.
 */
export function buildOutreachDraft(opts: {
  siteTitle: string;
  sourceUrl: string;
  postSlug: string;
  postTitle: string;
}): OutreachDraft {
  const postUrl = `${SITE_URL}/blog/${opts.postSlug}`;
  const site = opts.siteTitle || "your site";
  const subject = `We linked to ${site} in a recent article`;
  const body = [
    `Hi there,`,
    ``,
    `I'm with Kover King Insurance, an independent agency in Springfield, IL. While researching a recent article on our blog — "${opts.postTitle}" — we found your page genuinely useful and cited it as a source, linking to it here:`,
    `${postUrl}`,
    ``,
    `Just wanted to give you a heads-up and say thanks for the helpful resource. If you think our article would be useful to your readers as well, a mention or link back would be very welcome — but no pressure at all either way.`,
    ``,
    `Either way, keep up the great work.`,
    ``,
    `Best,`,
    `The Kover King Team`,
    `${NAP.name}`,
    `${NAP.telephoneDisplay} · ${SITE_URL}`,
    ``,
    `—`,
    `${ADDRESS_LINE}`,
    `You're receiving this one-time note because we linked to your site. If you'd prefer not to hear from us, just reply "unsubscribe" and we won't contact you again.`,
  ].join("\n");
  return { subject, body };
}

function draftToHtml(body: string): string {
  const esc = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Linkify bare URLs and turn newlines into <br>.
  const linked = esc.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" style="color:#E9560C;">$1</a>'
  );
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#171717;">${linked.replace(
    /\n/g,
    "<br>"
  )}</div>`;
}

/**
 * Notify the agency of a new lead (quote/contact submission). Best-effort and
 * fire-and-forget — never blocks or fails the user's form submission. Sends to
 * EMAIL_TO (or LEAD_NOTIFY_TO override) and sets reply_to to the lead's email
 * so the team can reply straight from the notification.
 */
export async function sendLeadNotification(opts: {
  kind: string; // e.g. "Quote request" | "Contact message"
  fields: { label: string; value: string }[];
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const from = process.env.EMAIL_FROM || "Kover King SEO <seo@koverking.com>";
  const to = process.env.LEAD_NOTIFY_TO || process.env.EMAIL_TO || "doug@aideveloper.dev";
  const rows = opts.fields
    .filter((f) => f.value && f.value.trim())
    .map(
      (f) =>
        `<tr><td style="padding:6px 12px;color:#737373;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(
          f.label
        )}</td><td style="padding:6px 12px;color:#171717;font-size:14px;">${escapeHtml(
          f.value
        )}</td></tr>`
    )
    .join("");
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
      <div style="background:#E9560C;color:#fff;padding:16px 20px;border-radius:12px 12px 0 0;font-size:16px;font-weight:800;">
        New ${escapeHtml(opts.kind)} · Kover King
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;">
        ${rows}
      </table>
      <p style="font-size:12px;color:#737373;margin-top:12px;">Submitted via koverking.com. Reply to this email to respond directly to the customer.</p>
    </div>`;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: opts.replyTo || undefined,
      subject: `New ${opts.kind} — ${opts.fields[0]?.value || "Kover King"}`,
      html,
    });
  } catch {
    // Never let a notification failure affect the submission.
  }
}

/** Send one outreach email via Resend. Best-effort; returns a status. */
export async function sendOutreachEmail(opts: {
  to: string;
  subject: string;
  body: string;
}): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, error: "RESEND_API_KEY not configured" };
  const from = process.env.EMAIL_FROM || "Kover King SEO <seo@koverking.com>";
  // Replies/opt-outs should land in a monitored inbox.
  const replyTo = process.env.OUTREACH_REPLY_TO || NAP.email;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: opts.to,
      replyTo,
      subject: opts.subject,
      html: draftToHtml(opts.body),
      text: opts.body,
    });
    if (error)
      return { sent: false, error: String((error as { message?: string }).message ?? error) };
    return { sent: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { sent: false, error: `Resend send failed: ${msg}` };
  }
}
