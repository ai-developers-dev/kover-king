import { createServerFn } from "@tanstack/react-start";
import { db, initDb } from "~/lib/db";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      name: string;
      email: string;
      phone?: string;
      message: string;
    }) => data
  )
  .handler(async ({ data }) => {
    await initDb();
    await db.execute({
      sql: "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)",
      args: [data.name, data.email, data.phone || null, data.message],
    });
    return { success: true };
  });

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      insurance_type: string;
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
      details?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    await initDb();
    await db.execute({
      sql: "INSERT INTO quotes (first_name, last_name, email, phone, insurance_type, address, city, state, zip, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.insurance_type,
        data.address || null,
        data.city || null,
        data.state || "IL",
        data.zip || null,
        data.details || null,
      ],
    });
    return { success: true };
  });

export const getQuotes = createServerFn({ method: "POST" })
  .inputValidator((data: { _?: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    void data;
    await initDb();
    const result = await db.execute(
      "SELECT * FROM quotes ORDER BY created_at DESC"
    );
    return result.rows;
  });

export const getContacts = createServerFn({ method: "POST" })
  .inputValidator((data: { _?: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    void data;
    await initDb();
    const result = await db.execute(
      "SELECT * FROM contacts ORDER BY created_at DESC"
    );
    return result.rows;
  });

export const deleteQuote = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await initDb();
    await db.execute({ sql: "DELETE FROM quotes WHERE id = ?", args: [data.id] });
    return { success: true };
  });

export const deleteContact = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await initDb();
    await db.execute({ sql: "DELETE FROM contacts WHERE id = ?", args: [data.id] });
    return { success: true };
  });

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { username: string; password: string }) => data
  )
  .handler(async ({ data }) => {
    // Hardcoded admin credentials — move to DB + bcrypt before production
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "KoverKing2026!";
    if (data.username === ADMIN_USER && data.password === ADMIN_PASS) {
      return { success: true as const };
    }
    return { success: false as const, error: "Invalid credentials" };
  });
