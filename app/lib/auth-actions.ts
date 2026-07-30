// Server functions for the unified login (admin + customer).
//
// Design notes:
//  - One `users` table; `role` decides where /login redirects.
//  - Self-registration ALWAYS creates role='customer'. Admin accounts are
//    seeded from env or created by an existing admin — never self-serve.
//  - Login and password-reset responses are deliberately identical whether or
//    not the email exists, so the endpoints can't be used to enumerate users.

import { createServerFn } from "@tanstack/react-start";
import { db, initDb } from "./db";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  expiryFromNow,
  normalizeEmail,
  isValidEmail,
  passwordProblem,
  SESSION_DAYS,
  VERIFY_TOKEN_HOURS,
  RESET_TOKEN_HOURS,
} from "./auth";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

export type PublicUser = {
  id: number;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  email_verified: boolean;
};

// ─── Rate limiting ───────────────────────────────────────────────────────────
// In-memory per-instance limiter. Enough to blunt online password guessing;
// it resets on cold start, which is an accepted tradeoff on serverless. A
// durable limiter (DB or Upstash) is the follow-up if abuse shows up.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now > rec.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

function clearRateLimit(key: string) {
  attempts.delete(key);
}

async function findUserByEmail(email: string) {
  const res = await db.execute({
    sql: "SELECT * FROM users WHERE email = ? LIMIT 1",
    args: [normalizeEmail(email)],
  });
  return res.rows[0];
}

async function createSession(userId: number): Promise<string> {
  const token = generateToken();
  await db.execute({
    sql: "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
    args: [userId, token, expiryFromNow(SESSION_DAYS * DAY_MS)],
  });
  return token;
}

function toPublicUser(row: Record<string, unknown>): PublicUser {
  return {
    id: Number(row.id),
    email: String(row.email),
    role: String(row.role),
    first_name: row.first_name ? String(row.first_name) : null,
    last_name: row.last_name ? String(row.last_name) : null,
    email_verified: Boolean(row.email_verified_at),
  };
}

// ─── Registration (customers only) ───────────────────────────────────────────

export const registerCustomer = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    await initDb();
    const email = normalizeEmail(data.email);

    if (!isValidEmail(email)) {
      return { success: false as const, error: "Enter a valid email address." };
    }
    const pwProblem = passwordProblem(data.password);
    if (pwProblem) return { success: false as const, error: pwProblem };
    if (!data.first_name.trim() || !data.last_name.trim()) {
      return { success: false as const, error: "Enter your first and last name." };
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      // Don't confirm the address is registered. Nudge to login/reset instead.
      return {
        success: false as const,
        error:
          "That email can't be registered. If you already have an account, try logging in or resetting your password.",
      };
    }

    const password_hash = await hashPassword(data.password);
    const result = await db.execute({
      sql: "INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES (?, ?, 'customer', ?, ?, ?)",
      args: [
        email,
        password_hash,
        data.first_name.trim(),
        data.last_name.trim(),
        data.phone?.trim() || null,
      ],
    });
    const userId = Number(result.lastInsertRowid);

    const token = generateToken();
    await db.execute({
      sql: "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      args: [userId, token, expiryFromNow(VERIFY_TOKEN_HOURS * HOUR_MS)],
    });

    try {
      const { sendVerificationEmail } = await import("./portal-email");
      await sendVerificationEmail({
        to: email,
        firstName: data.first_name.trim(),
        token,
      });
    } catch {
      /* best-effort; user can request a resend */
    }

    return { success: true as const };
  });

// ─── Email verification ──────────────────────────────────────────────────────

export const verifyEmailToken = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    await initDb();
    const res = await db.execute({
      sql: "SELECT * FROM email_verification_tokens WHERE token = ? LIMIT 1",
      args: [data.token],
    });
    const row = res.rows[0];
    if (!row || row.used_at || new Date(String(row.expires_at)) < new Date()) {
      return { success: false as const, error: "This link is invalid or has expired." };
    }
    await db.execute({
      sql: "UPDATE users SET email_verified_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [row.user_id],
    });
    await db.execute({
      sql: "UPDATE email_verification_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [row.id],
    });
    return { success: true as const };
  });

export const resendVerification = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    await initDb();
    const user = await findUserByEmail(data.email);
    // Always report success — never reveal whether the address exists.
    if (!user || user.email_verified_at) return { success: true as const };

    const token = generateToken();
    await db.execute({
      sql: "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      args: [user.id, token, expiryFromNow(VERIFY_TOKEN_HOURS * HOUR_MS)],
    });
    try {
      const { sendVerificationEmail } = await import("./portal-email");
      await sendVerificationEmail({
        to: String(user.email),
        firstName: user.first_name ? String(user.first_name) : "there",
        token,
      });
    } catch {
      /* best-effort */
    }
    return { success: true as const };
  });

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginUser = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    await initDb();
    const email = normalizeEmail(data.email);
    const key = `login:${email}`;

    if (rateLimited(key)) {
      return {
        success: false as const,
        error: "Too many attempts. Please wait 15 minutes and try again.",
      };
    }

    const user = await findUserByEmail(email);
    // Identical error for "no such user" and "wrong password".
    const generic = { success: false as const, error: "Invalid email or password." };
    if (!user) return generic;

    const ok = await verifyPassword(data.password, String(user.password_hash));
    if (!ok) return generic;

    if (String(user.role) === "customer" && !user.email_verified_at) {
      return {
        success: false as const,
        error: "Please confirm your email first. Check your inbox for the link.",
        needsVerification: true as const,
      };
    }

    clearRateLimit(key);
    const token = await createSession(Number(user.id));
    // Staff also get an admin_sessions row so the existing admin server
    // functions (which check that table) accept this token.
    if (String(user.role) !== "customer") {
      await db.execute({
        sql: "INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)",
        args: [token, expiryFromNow(SESSION_DAYS * DAY_MS)],
      });
    }
    await db.execute({
      sql: "UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [user.id],
    });

    return {
      success: true as const,
      token,
      user: toPublicUser(user as Record<string, unknown>),
      // The client uses this to route: admins to the dashboard, customers to
      // the portal. The user never has to pick an account type.
      redirect: String(user.role) === "customer" ? "/portal" : "/admin/dashboard",
    };
  });

// ─── Session ─────────────────────────────────────────────────────────────────

export const getSessionUser = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    if (!data.token) return { user: null };
    await initDb();
    const res = await db.execute({
      sql: `SELECT u.* FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token = ? AND s.expires_at > ? LIMIT 1`,
      args: [data.token, new Date().toISOString()],
    });
    const row = res.rows[0];
    if (!row) return { user: null };
    return { user: toPublicUser(row as Record<string, unknown>) };
  });

export const logoutUser = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    await initDb();
    await db.execute({
      sql: "DELETE FROM sessions WHERE token = ?",
      args: [data.token],
    });
    return { success: true as const };
  });

// ─── Password reset ──────────────────────────────────────────────────────────

export const requestPasswordReset = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    await initDb();
    const user = await findUserByEmail(data.email);
    // Always success — no enumeration.
    if (!user) return { success: true as const };

    const token = generateToken();
    await db.execute({
      sql: "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      args: [user.id, token, expiryFromNow(RESET_TOKEN_HOURS * HOUR_MS)],
    });
    try {
      const { sendPasswordResetEmail } = await import("./portal-email");
      await sendPasswordResetEmail({
        to: String(user.email),
        firstName: user.first_name ? String(user.first_name) : "there",
        token,
      });
    } catch {
      /* best-effort */
    }
    return { success: true as const };
  });

export const resetPassword = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; password: string }) => data)
  .handler(async ({ data }) => {
    await initDb();
    const pwProblem = passwordProblem(data.password);
    if (pwProblem) return { success: false as const, error: pwProblem };

    const res = await db.execute({
      sql: "SELECT * FROM password_reset_tokens WHERE token = ? LIMIT 1",
      args: [data.token],
    });
    const row = res.rows[0];
    if (!row || row.used_at || new Date(String(row.expires_at)) < new Date()) {
      return { success: false as const, error: "This reset link is invalid or has expired." };
    }

    const password_hash = await hashPassword(data.password);
    await db.execute({
      sql: "UPDATE users SET password_hash = ? WHERE id = ?",
      args: [password_hash, row.user_id],
    });
    await db.execute({
      sql: "UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [row.id],
    });
    // Changing a password invalidates every existing session for that user.
    await db.execute({
      sql: "DELETE FROM sessions WHERE user_id = ?",
      args: [row.user_id],
    });
    return { success: true as const };
  });
