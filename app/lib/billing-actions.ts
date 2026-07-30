// Admin billing: customers, policies, documents, invoices, offline payments.
//
// Every function requires an admin/agent session. Customers never reach these.

import { createServerFn } from "@tanstack/react-start";
import { db, initDb } from "./db";
import { hashPassword, generateToken, expiryFromNow, normalizeEmail } from "./auth";

const HOUR_MS = 60 * 60 * 1000;

async function requireAdmin(token: unknown): Promise<string> {
  await initDb();
  if (!token || typeof token !== "string") throw new Error("Unauthorized");
  const res = await db.execute({
    sql: `SELECT u.email, u.role FROM sessions s
          JOIN users u ON u.id = s.user_id
          WHERE s.token = ? AND s.expires_at > ? LIMIT 1`,
    args: [token, new Date().toISOString()],
  });
  const row = res.rows[0];
  if (row && String(row.role) !== "customer") return String(row.email);
  // Legacy admin token (admin_sessions only).
  const legacy = await db.execute({
    sql: "SELECT id FROM admin_sessions WHERE token = ? AND expires_at > ?",
    args: [token, new Date().toISOString()],
  });
  if (legacy.rows.length > 0) return "admin";
  throw new Error("Unauthorized");
}

// ─── Customers ───────────────────────────────────────────────────────────────

export const getCustomers = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const res = await db.execute(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone,
             u.email_verified_at, u.created_at,
             (SELECT COUNT(*) FROM policies p WHERE p.customer_id = u.id) AS policy_count,
             (SELECT COALESCE(SUM(i.amount_cents),0) FROM invoices i
                WHERE i.customer_id = u.id AND i.status IN ('sent','overdue')) AS due_cents
      FROM users u WHERE u.role = 'customer'
      ORDER BY u.created_at DESC
    `);
    return res.rows;
  });

/**
 * Create a customer account from the admin side and email them a link to set
 * their own password. Avoids the admin ever choosing a customer's password.
 */
export const inviteCustomer = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      token: string;
      email: string;
      first_name: string;
      last_name: string;
      phone?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const email = normalizeEmail(data.email);
    if (!email.includes("@")) {
      return { success: false as const, error: "Enter a valid email." };
    }
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE email = ? LIMIT 1",
      args: [email],
    });
    if (existing.rows.length > 0) {
      return { success: false as const, error: "A user with that email already exists." };
    }
    // Random unusable password; the invite link is how they get in.
    const placeholder = await hashPassword(generateToken());
    const res = await db.execute({
      sql: "INSERT INTO users (email, password_hash, role, first_name, last_name, phone, email_verified_at) VALUES (?, ?, 'customer', ?, ?, ?, CURRENT_TIMESTAMP)",
      args: [
        email,
        placeholder,
        data.first_name.trim(),
        data.last_name.trim(),
        data.phone?.trim() || null,
      ],
    });
    const userId = Number(res.lastInsertRowid);

    const resetToken = generateToken();
    await db.execute({
      sql: "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      args: [userId, resetToken, expiryFromNow(72 * HOUR_MS)],
    });
    try {
      const { sendPasswordResetEmail } = await import("./portal-email");
      await sendPasswordResetEmail({
        to: email,
        firstName: data.first_name.trim(),
        token: resetToken,
      });
    } catch {
      /* best-effort */
    }
    return { success: true as const, id: userId };
  });

// ─── Policies ────────────────────────────────────────────────────────────────

export const getPoliciesAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const res = await db.execute(`
      SELECT p.*, u.email AS customer_email, u.first_name, u.last_name,
             (SELECT COUNT(*) FROM policy_documents d WHERE d.policy_id = p.id) AS doc_count
      FROM policies p
      LEFT JOIN users u ON u.id = p.customer_id
      ORDER BY p.created_at DESC
    `);
    return res.rows;
  });

export const savePolicy = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      token: string;
      id?: number;
      customer_id: number;
      carrier: string;
      insurance_type: string;
      policy_number?: string;
      term: string;
      premium_cents: number;
      effective_date?: string;
      expiration_date?: string;
      status?: string;
      notes?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    if (!data.carrier.trim() || !data.insurance_type) {
      return { success: false as const, error: "Carrier and insurance type are required." };
    }
    if (data.id) {
      await db.execute({
        sql: `UPDATE policies SET carrier=?, insurance_type=?, policy_number=?, term=?,
              premium_cents=?, effective_date=?, expiration_date=?, status=?, notes=?,
              updated_at=CURRENT_TIMESTAMP WHERE id=?`,
        args: [
          data.carrier.trim(),
          data.insurance_type,
          data.policy_number || null,
          data.term,
          Math.round(data.premium_cents),
          data.effective_date || null,
          data.expiration_date || null,
          data.status || "active",
          data.notes || null,
          data.id,
        ],
      });
      return { success: true as const, id: data.id };
    }
    const res = await db.execute({
      sql: `INSERT INTO policies (customer_id, carrier, insurance_type, policy_number, term,
            premium_cents, effective_date, expiration_date, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        data.customer_id,
        data.carrier.trim(),
        data.insurance_type,
        data.policy_number || null,
        data.term,
        Math.round(data.premium_cents),
        data.effective_date || null,
        data.expiration_date || null,
        data.status || "active",
        data.notes || null,
      ],
    });
    return { success: true as const, id: Number(res.lastInsertRowid) };
  });

export const deletePolicy = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    await db.execute({ sql: "DELETE FROM policy_documents WHERE policy_id = ?", args: [data.id] });
    await db.execute({ sql: "DELETE FROM policies WHERE id = ?", args: [data.id] });
    return { success: true as const };
  });

// ─── Documents (ID cards / policy PDFs) ──────────────────────────────────────

export const uploadPolicyDocument = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      token: string;
      policy_id: number;
      kind: string;
      filename: string;
      contentType: string;
      base64: string;
    }) => data
  )
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return {
        success: false as const,
        error: "File storage isn't configured (BLOB_READ_WRITE_TOKEN).",
      };
    }
    try {
      const buffer = Buffer.from(data.base64, "base64");
      const { put } = await import("@vercel/blob");
      const safeName = (data.filename || "document").replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await put(`policies/${data.policy_id}/${Date.now()}-${safeName}`, buffer, {
        access: "public",
        contentType: data.contentType || "application/pdf",
      });
      await db.execute({
        sql: "INSERT INTO policy_documents (policy_id, kind, blob_url, filename, size_bytes) VALUES (?, ?, ?, ?, ?)",
        args: [data.policy_id, data.kind, blob.url, safeName, buffer.length],
      });
      return { success: true as const, url: blob.url };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return { success: false as const, error: `Upload failed: ${msg}` };
    }
  });

export const getPolicyDocuments = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; policy_id: number }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const res = await db.execute({
      sql: "SELECT * FROM policy_documents WHERE policy_id = ? ORDER BY uploaded_at DESC",
      args: [data.policy_id],
    });
    return res.rows;
  });

export const deletePolicyDocument = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    await db.execute({ sql: "DELETE FROM policy_documents WHERE id = ?", args: [data.id] });
    return { success: true as const };
  });

// ─── Invoices ────────────────────────────────────────────────────────────────

export const getInvoicesAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const res = await db.execute(`
      SELECT i.*, u.email AS customer_email, u.first_name, u.last_name,
             p.carrier, p.insurance_type
      FROM invoices i
      LEFT JOIN users u ON u.id = i.customer_id
      LEFT JOIN policies p ON p.id = i.policy_id
      ORDER BY i.created_at DESC
    `);
    return res.rows;
  });

export const createInvoice = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      token: string;
      customer_id: number;
      policy_id?: number;
      amount_cents: number;
      due_date?: string;
      term?: string;
      notes?: string;
      send: boolean;
    }) => data
  )
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    if (!data.amount_cents || data.amount_cents <= 0) {
      return { success: false as const, error: "Enter an amount greater than zero." };
    }
    const invoiceNumber = `KK-${Date.now().toString(36).toUpperCase()}`;
    const res = await db.execute({
      sql: `INSERT INTO invoices (customer_id, policy_id, invoice_number, amount_cents,
            due_date, term, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        data.customer_id,
        data.policy_id ?? null,
        invoiceNumber,
        Math.round(data.amount_cents),
        data.due_date || null,
        data.term || null,
        data.send ? "sent" : "draft",
        data.notes || null,
      ],
    });

    if (data.send) {
      try {
        const u = await db.execute({
          sql: "SELECT email, first_name FROM users WHERE id = ? LIMIT 1",
          args: [data.customer_id],
        });
        const cust = u.rows[0];
        if (cust) {
          const { sendInvoiceEmail } = await import("./portal-email");
          await sendInvoiceEmail({
            to: String(cust.email),
            firstName: cust.first_name ? String(cust.first_name) : "there",
            invoiceNumber,
            amountCents: Math.round(data.amount_cents),
            dueDate: data.due_date || null,
          });
        }
      } catch {
        /* best-effort */
      }
    }
    return { success: true as const, id: Number(res.lastInsertRowid), invoiceNumber };
  });

export const updateInvoiceStatus = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { token: string; id: number; status: string }) => data
  )
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    const paidAt = data.status === "paid" ? new Date().toISOString() : null;
    await db.execute({
      sql: "UPDATE invoices SET status = ?, paid_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [data.status, paidAt, data.id],
    });
    return { success: true as const };
  });

/** Record a payment taken outside the portal (check, cash, phone). */
export const recordOfflinePayment = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      token: string;
      invoice_id: number;
      amount_cents: number;
      method: string;
    }) => data
  )
  .handler(async ({ data }) => {
    const actor = await requireAdmin(data.token);
    await db.execute({
      sql: "INSERT INTO payments (invoice_id, amount_cents, method, status, recorded_by) VALUES (?, ?, ?, 'succeeded', ?)",
      args: [data.invoice_id, Math.round(data.amount_cents), data.method, actor],
    });
    await db.execute({
      sql: "UPDATE invoices SET status = 'paid', paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [data.invoice_id],
    });
    return { success: true as const };
  });

export const deleteInvoice = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await requireAdmin(data.token);
    await db.execute({ sql: "DELETE FROM invoices WHERE id = ?", args: [data.id] });
    return { success: true as const };
  });
