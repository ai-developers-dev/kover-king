import { defineEventHandler, getQuery, createError, setResponseHeader } from "nitro/h3";
import { db, initDb } from "../utils/db";

export default defineEventHandler(async (event) => {
  const { t } = getQuery(event);

  if (!t || typeof t !== "string") {
    throw createError({ statusCode: 400, message: "Missing token" });
  }

  await initDb();

  const result = await db.execute({
    sql: `SELECT lt.id AS token_id, lt.expires_at, lt.used_at,
                 ml.full_name, ml.email, ml.phone
          FROM lead_tokens lt
          JOIN meta_leads ml ON ml.id = lt.lead_id
          WHERE lt.token = ?`,
    args: [t],
  });

  const row = result.rows[0];
  if (!row) {
    throw createError({ statusCode: 404, message: "Token not found" });
  }

  if (row.used_at) {
    throw createError({ statusCode: 410, message: "Token already used" });
  }

  if (new Date(row.expires_at as string) < new Date()) {
    throw createError({ statusCode: 410, message: "Token expired" });
  }

  await db.execute({
    sql: "UPDATE lead_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?",
    args: [row.token_id],
  });

  setResponseHeader(event, "Cache-Control", "no-store");

  return {
    full_name: row.full_name as string | null,
    email: row.email as string | null,
    phone: row.phone as string | null,
  };
});
