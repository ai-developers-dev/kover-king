// Authentication primitives for the unified login (admin + customer).
//
// Passwords use scrypt from node:crypto — deliberately NOT bcrypt/argon2,
// which ship native binaries that break on Vercel's Linux runtime when built
// on this Mac (see CLAUDE.md). scrypt is memory-hard, built in, and correct.

import { randomBytes, scrypt, timingSafeEqual, randomUUID } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

const KEYLEN = 64;
const SALT_BYTES = 16;

/** Hash a password. Returns "salt_hex:hash_hex" — a unique salt per user. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derived = await scryptAsync(password, salt, KEYLEN);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

/**
 * Verify a password against a stored hash. Uses timingSafeEqual so an attacker
 * can't learn the hash byte-by-byte from response timing.
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  try {
    const [saltHex, hashHex] = stored.split(":");
    if (!saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const derived = await scryptAsync(password, salt, expected.length);
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** Opaque, unguessable token for sessions and email links. */
export function generateToken(): string {
  return `${randomUUID()}${randomUUID()}`.replace(/-/g, "");
}

export const SESSION_DAYS = 30;
export const VERIFY_TOKEN_HOURS = 24;
export const RESET_TOKEN_HOURS = 1;

export function expiryFromNow(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

export const SESSION_COOKIE = "kk_session";

/** httpOnly so XSS can't read it; SameSite=Lax survives the email-link flow. */
export function sessionCookieHeader(token: string, maxAgeDays = SESSION_DAYS) {
  const maxAge = maxAgeDays * 24 * 60 * 60;
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookieHeader() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function readSessionCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === SESSION_COOKIE) return rest.join("=") || null;
  }
  return null;
}

/** Normalize for storage/lookup so casing/whitespace can't create duplicates. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Minimum viable password policy. Length beats character-class rules. */
export function passwordProblem(password: string): string | null {
  if (password.length < 10) return "Password must be at least 10 characters.";
  if (password.length > 200) return "Password is too long.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}
