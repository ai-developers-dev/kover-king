// Payment-vault server functions.
//
// Flow: customer submits card/bank details -> encrypted at rest -> an
// authorized agent reveals them in the admin dashboard, keys them into the
// carrier portal, marks the record processed -> sensitive payload is purged.
//
// Every reveal is written to payment_access_log. Nothing sensitive is ever
// returned to a non-admin, and nothing sensitive is ever console.logged.

import { createServerFn } from "@tanstack/react-start";
import { db, initDb } from "./db";
import {
  encryptJson,
  decryptJson,
  isVaultConfigured,
  last4,
  cardBrand,
  luhnValid,
  routingValid,
} from "./crypto-vault";

/** Days a submitted payment record is retained before auto-purge. */
const RETENTION_DAYS = 14;

async function sessionUser(token: unknown) {
  await initDb();
  if (!token || typeof token !== "string") return null;
  const res = await db.execute({
    sql: `SELECT u.id, u.email, u.role FROM sessions s
          JOIN users u ON u.id = s.user_id
          WHERE s.token = ? AND s.expires_at > ? LIMIT 1`,
    args: [token, new Date().toISOString()],
  });
  return res.rows[0] || null;
}

async function requireAdmin(token: unknown) {
  const user = await sessionUser(token);
  // Legacy admin tokens live only in admin_sessions.
  if (!user) {
    if (typeof token === "string") {
      const legacy = await db.execute({
        sql: "SELECT id FROM admin_sessions WHERE token = ? AND expires_at > ?",
        args: [token, new Date().toISOString()],
      });
      if (legacy.rows.length > 0) return { email: "admin" };
    }
    throw new Error("Unauthorized");
  }
  if (String(user.role) === "customer") throw new Error("Unauthorized");
  return { email: String(user.email) };
}

async function requireCustomer(token: unknown): Promise<number> {
  const user = await sessionUser(token);
  if (!user) throw new Error("Unauthorized");
  return Number(user.id);
}

async function logAccess(paymentMethodId: number, actor: string, action: string) {
  await db.execute({
    sql: "INSERT INTO payment_access_log (payment_method_id, actor, action) VALUES (?, ?, ?)",
    args: [paymentMethodId, actor, action],
  });
}

// ─── Customer: submit payment details ────────────────────────────────────────

export const submitPaymentMethod = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      token: string;
      invoice_id?: number;
      method: "card" | "ach";
      // card
      card_number?: string;
      exp_month?: string;
      exp_year?: string;
      cvv?: string;
      billing_zip?: string;
      // ach
      routing_number?: string;
      account_number?: string;
      account_type?: string;
      bank_name?: string;
      // both
      name_on_account: string;
    }) => data
  )
  .handler(async ({ data }) => {
    const customerId = await requireCustomer(data.token);

    if (!isVaultConfigured()) {
      return {
        success: false as const,
        error:
          "Secure payment collection isn't configured yet. Please call (217) 960-8997.",
      };
    }
    if (!data.name_on_account?.trim()) {
      return { success: false as const, error: "Enter the name on the account." };
    }

    let payload: Record<string, string>;
    let brand: string;
    let tail: string;

    if (data.method === "card") {
      const num = (data.card_number || "").replace(/\D/g, "");
      if (!luhnValid(num)) {
        return { success: false as const, error: "That card number doesn't look valid." };
      }
      if (!data.exp_month || !data.exp_year) {
        return { success: false as const, error: "Enter the card expiration date." };
      }
      if (!/^\d{3,4}$/.test(data.cvv || "")) {
        return { success: false as const, error: "Enter the 3- or 4-digit security code." };
      }
      payload = {
        card_number: num,
        exp_month: data.exp_month,
        exp_year: data.exp_year,
        cvv: data.cvv!,
        billing_zip: data.billing_zip || "",
        name_on_account: data.name_on_account.trim(),
      };
      brand = cardBrand(num);
      tail = last4(num);
    } else {
      const routing = (data.routing_number || "").replace(/\D/g, "");
      const account = (data.account_number || "").replace(/\D/g, "");
      if (!routingValid(routing)) {
        return { success: false as const, error: "That routing number doesn't look valid." };
      }
      if (account.length < 4 || account.length > 17) {
        return { success: false as const, error: "Enter a valid account number." };
      }
      payload = {
        routing_number: routing,
        account_number: account,
        account_type: data.account_type || "checking",
        bank_name: data.bank_name || "",
        name_on_account: data.name_on_account.trim(),
      };
      brand = data.bank_name?.trim() || "Bank Account";
      tail = last4(account);
    }

    const purgeAfter = new Date(
      Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    const res = await db.execute({
      sql: `INSERT INTO payment_methods
            (customer_id, invoice_id, method, enc_payload, brand, last4, name_on_account, status, purge_after)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      args: [
        customerId,
        data.invoice_id ?? null,
        data.method,
        encryptJson(payload),
        brand,
        tail,
        data.name_on_account.trim(),
        purgeAfter,
      ],
    });

    await logAccess(Number(res.lastInsertRowid), "customer", "submitted");

    try {
      const { sendLeadNotification } = await import("./outreach-agent");
      await sendLeadNotification({
        kind: "Payment details submitted",
        fields: [
          { label: "Method", value: data.method === "card" ? "Card" : "e-Check (ACH)" },
          { label: "Name", value: data.name_on_account },
          { label: "Ending in", value: tail },
          // Never put full digits in an email.
          { label: "Action", value: "Reveal in Admin → Payments to process in the carrier portal." },
        ],
      });
    } catch {
      /* best-effort */
    }

    return { success: true as const };
  });

// ─── Admin: list, reveal, process, purge ─────────────────────────────────────

export const getPaymentMethods = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    // Sweep anything past its retention window before listing.
    await db.execute({
      sql: `UPDATE payment_methods
            SET enc_payload = NULL, status = 'purged', purged_at = CURRENT_TIMESTAMP
            WHERE status != 'purged' AND purge_after IS NOT NULL AND purge_after < ?`,
      args: [new Date().toISOString()],
    });
    const res = await db.execute(`
      SELECT pm.id, pm.customer_id, pm.invoice_id, pm.method, pm.brand, pm.last4,
             pm.name_on_account, pm.status, pm.purge_after, pm.processed_at,
             pm.processed_by, pm.created_at,
             u.email AS customer_email, u.first_name, u.last_name
      FROM payment_methods pm
      LEFT JOIN users u ON u.id = pm.customer_id
      ORDER BY pm.created_at DESC
    `);
    // Note: enc_payload is deliberately NOT selected here.
    return res.rows;
  });

/** Decrypts and returns the full details. Every call is audit-logged. */
export const revealPaymentMethod = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    const actor = await requireAdmin(data.token);
    const res = await db.execute({
      sql: "SELECT * FROM payment_methods WHERE id = ? LIMIT 1",
      args: [data.id],
    });
    const row = res.rows[0];
    if (!row) return { success: false as const, error: "Not found." };
    if (!row.enc_payload) {
      return {
        success: false as const,
        error: "These details have been purged and are no longer available.",
      };
    }
    await logAccess(data.id, actor.email, "revealed");
    try {
      const details = decryptJson<Record<string, string>>(String(row.enc_payload));
      return { success: true as const, method: String(row.method), details };
    } catch {
      return { success: false as const, error: "Could not decrypt (key may have changed)." };
    }
  });

/** Mark as keyed into the carrier portal and immediately destroy the payload. */
export const markPaymentProcessed = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number; purge: boolean }) => data)
  .handler(async ({ data }) => {
    const actor = await requireAdmin(data.token);
    if (data.purge) {
      await db.execute({
        sql: `UPDATE payment_methods
              SET status = 'processed', enc_payload = NULL,
                  processed_at = CURRENT_TIMESTAMP, processed_by = ?,
                  purged_at = CURRENT_TIMESTAMP
              WHERE id = ?`,
        args: [actor.email, data.id],
      });
      await logAccess(data.id, actor.email, "processed+purged");
    } else {
      await db.execute({
        sql: `UPDATE payment_methods
              SET status = 'processed', processed_at = CURRENT_TIMESTAMP, processed_by = ?
              WHERE id = ?`,
        args: [actor.email, data.id],
      });
      await logAccess(data.id, actor.email, "processed");
    }
    return { success: true as const };
  });

export const purgePaymentMethod = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    const actor = await requireAdmin(data.token);
    await db.execute({
      sql: `UPDATE payment_methods
            SET enc_payload = NULL, status = 'purged', purged_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [data.id],
    });
    await logAccess(data.id, actor.email, "purged");
    return { success: true as const };
  });

export const getPaymentAccessLog = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const res = await db.execute({
      sql: "SELECT * FROM payment_access_log WHERE payment_method_id = ? ORDER BY created_at DESC",
      args: [data.id],
    });
    return res.rows;
  });
