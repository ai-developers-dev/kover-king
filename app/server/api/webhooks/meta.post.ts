import { defineEventHandler, readRawBody, getHeader, createError } from "nitro/h3";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { db, initDb } from "../../utils/db";
import { fetchMetaLead } from "../../utils/meta";

export default defineEventHandler(async (event) => {
  const rawBody = (await readRawBody(event)) ?? "";
  const appSecret = process.env.META_APP_SECRET ?? "";

  // Verify HMAC-SHA256 signature
  const signature = getHeader(event, "x-hub-signature-256") ?? "";
  if (appSecret && signature) {
    const expected =
      "sha256=" + createHmac("sha256", appSecret).update(rawBody).digest("hex");
    try {
      if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        throw new Error("mismatch");
      }
    } catch {
      throw createError({ statusCode: 403, message: "Invalid signature" });
    }
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    throw createError({ statusCode: 400, message: "Invalid JSON" });
  }

  const entries: Array<{
    leadgen_id: string;
    page_id: string;
    form_id: string;
    ad_id?: string;
  }> = [];

  for (const entry of payload?.entry ?? []) {
    for (const change of entry?.changes ?? []) {
      if (change?.field === "leadgen" && change?.value?.leadgen_id) {
        entries.push(change.value);
      }
    }
  }

  if (entries.length === 0) {
    return { received: true };
  }

  await initDb();

  for (const { leadgen_id, page_id, form_id, ad_id } of entries) {
    try {
      const leadData = await fetchMetaLead(leadgen_id);

      await db.execute({
        sql: `INSERT OR IGNORE INTO meta_leads
              (leadgen_id, page_id, form_id, ad_id, full_name, email, phone, raw_payload)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          leadgen_id,
          page_id ?? null,
          form_id ?? null,
          ad_id ?? null,
          leadData.full_name,
          leadData.email,
          leadData.phone,
          rawBody,
        ],
      });

      const row = await db.execute({
        sql: "SELECT id FROM meta_leads WHERE leadgen_id = ?",
        args: [leadgen_id],
      });
      const leadId = row.rows[0]?.id as number;

      const token = randomBytes(24).toString("hex");
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

      await db.execute({
        sql: "INSERT INTO lead_tokens (lead_id, token, expires_at) VALUES (?, ?, ?)",
        args: [leadId, token, expiresAt],
      });

      console.log(`[meta-webhook] Stored lead ${leadgen_id}, token: ${token.slice(0, 8)}...`);
    } catch (err) {
      console.error(`[meta-webhook] Error processing leadgen_id ${leadgen_id}:`, err);
    }
  }

  return { received: true };
});
