// AES-256-GCM encryption for payment data at rest.
//
// Context: Kover King collects card / bank details from customers and an
// authorized, bonded agent keys them into the CARRIER's portal. We never
// authorize a charge ourselves, so this data is pre-authorization.
//
// Rules this module exists to enforce:
//   1. Nothing sensitive is ever written to the DB in plaintext.
//   2. Nothing sensitive is ever written to logs.
//   3. Decryption is explicit, audited, and purgeable.
//
// Key: PAYMENT_ENCRYPTION_KEY, a 64-char hex string (32 bytes). Rotating it
// makes existing records undecryptable — purge before rotating.

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_BYTES = 12;

function getKey(): Buffer {
  const hex = process.env.PAYMENT_ENCRYPTION_KEY;
  if (!hex) {
    throw new Error(
      "PAYMENT_ENCRYPTION_KEY is not configured — refusing to handle payment data."
    );
  }
  const key = Buffer.from(hex, "hex");
  if (key.length !== 32) {
    throw new Error("PAYMENT_ENCRYPTION_KEY must be 64 hex characters (32 bytes).");
  }
  return key;
}

/** Encrypt a JS object. Returns "iv:authTag:ciphertext", all hex. */
export function encryptJson(value: unknown): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, getKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

/** Decrypt back to the original object. Throws if tampered with. */
export function decryptJson<T = Record<string, string>>(payload: string): T {
  const [ivHex, tagHex, dataHex] = payload.split(":");
  if (!ivHex || !tagHex || !dataHex) throw new Error("Malformed encrypted payload");
  const decipher = createDecipheriv(ALGO, getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString("utf8")) as T;
}

export function isVaultConfigured(): boolean {
  const hex = process.env.PAYMENT_ENCRYPTION_KEY;
  return Boolean(hex && Buffer.from(hex, "hex").length === 32);
}

/** Last 4 digits — the only part of an account number safe to store in clear. */
export function last4(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.slice(-4);
}

/** Best-effort card brand from the IIN. Display metadata only. */
export function cardBrand(number: string): string {
  const n = number.replace(/\D/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6(?:011|5)/.test(n)) return "Discover";
  return "Card";
}

/** Luhn check — catches typos before an agent wastes time in a portal. */
export function luhnValid(number: string): boolean {
  const n = number.replace(/\D/g, "");
  if (n.length < 13 || n.length > 19) return false;
  let sum = 0;
  let dbl = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = Number(n[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

/** US ABA routing number checksum. */
export function routingValid(routing: string): boolean {
  const r = routing.replace(/\D/g, "");
  if (r.length !== 9) return false;
  const d = r.split("").map(Number);
  const sum =
    3 * (d[0] + d[3] + d[6]) + 7 * (d[1] + d[4] + d[7]) + (d[2] + d[5] + d[8]);
  return sum % 10 === 0;
}
