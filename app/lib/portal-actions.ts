// Customer-portal server functions.
//
// SECURITY: every query here derives customer_id from the SESSION, never from
// a client-supplied id. A customer must not be able to read another
// customer's policies, documents, or invoices by guessing an id.

import { createServerFn } from "@tanstack/react-start";
import { db, initDb } from "./db";
import { hashPassword, verifyPassword, passwordProblem } from "./auth";

async function requireCustomer(token: unknown): Promise<number> {
  await initDb();
  if (!token || typeof token !== "string") throw new Error("Unauthorized");
  const res = await db.execute({
    sql: `SELECT u.id, u.role FROM sessions s
          JOIN users u ON u.id = s.user_id
          WHERE s.token = ? AND s.expires_at > ? LIMIT 1`,
    args: [token, new Date().toISOString()],
  });
  const row = res.rows[0];
  if (!row) throw new Error("Unauthorized");
  return Number(row.id);
}

export const getMyOverview = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    const customerId = await requireCustomer(data.token);

    const [policies, invoices, docs] = await Promise.all([
      db.execute({
        sql: "SELECT * FROM policies WHERE customer_id = ? ORDER BY status ASC, created_at DESC",
        args: [customerId],
      }),
      db.execute({
        sql: "SELECT * FROM invoices WHERE customer_id = ? AND status != 'draft' ORDER BY due_date DESC, created_at DESC",
        args: [customerId],
      }),
      db.execute({
        sql: `SELECT d.*, p.carrier, p.insurance_type
              FROM policy_documents d
              JOIN policies p ON p.id = d.policy_id
              WHERE p.customer_id = ?
              ORDER BY d.uploaded_at DESC`,
        args: [customerId],
      }),
    ]);

    const outstanding = invoices.rows
      .filter((i) => i.status === "sent" || i.status === "overdue")
      .reduce((sum, i) => sum + Number(i.amount_cents), 0);

    return {
      policies: policies.rows,
      invoices: invoices.rows,
      documents: docs.rows,
      outstanding_cents: outstanding,
    };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      token: string;
      first_name: string;
      last_name: string;
      phone?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    const customerId = await requireCustomer(data.token);
    if (!data.first_name.trim() || !data.last_name.trim()) {
      return { success: false as const, error: "Name cannot be empty." };
    }
    await db.execute({
      sql: "UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?",
      args: [
        data.first_name.trim(),
        data.last_name.trim(),
        data.phone?.trim() || null,
        customerId,
      ],
    });
    return { success: true as const };
  });

export const changeMyPassword = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { token: string; current_password: string; new_password: string }) =>
      data
  )
  .handler(async ({ data }) => {
    const customerId = await requireCustomer(data.token);
    const problem = passwordProblem(data.new_password);
    if (problem) return { success: false as const, error: problem };

    const res = await db.execute({
      sql: "SELECT password_hash FROM users WHERE id = ? LIMIT 1",
      args: [customerId],
    });
    const row = res.rows[0];
    if (!row) return { success: false as const, error: "Account not found." };

    const ok = await verifyPassword(
      data.current_password,
      String(row.password_hash)
    );
    if (!ok) {
      return { success: false as const, error: "Your current password is incorrect." };
    }

    const password_hash = await hashPassword(data.new_password);
    await db.execute({
      sql: "UPDATE users SET password_hash = ? WHERE id = ?",
      args: [password_hash, customerId],
    });
    // Keep the current session alive but drop all the others.
    await db.execute({
      sql: "DELETE FROM sessions WHERE user_id = ? AND token != ?",
      args: [customerId, data.token],
    });
    return { success: true as const };
  });
