# Customer Portal + Billing — Implementation Report

Status: **planning document**. Nothing in here is built yet.
Prepared for koverking.com (TanStack Start · LibSQL/Turso · Vercel · Resend · Vercel Blob).

---

## 1. What you asked for

1. Change the footer "Admin Login" link to a single **"Log In"**.
2. One login page that figures out whether the person is an **admin**, an
   **agent/tenant**, or a **customer** — no separate URLs.
3. **Customers can self-register**, with an email confirmation step.
4. Customer portal contains **ID cards**, **policy documents**, and — most
   importantly — a **secure payment form**.
5. Admin can **create a bill** for a customer specifying:
   - carrier/company (e.g. Progressive, Safeco)
   - insurance type (auto, home, life, business, landlord, duplex)
   - term: **monthly / 6-month / 12-month**
   - premium amount
6. Customer pays by **e-check (ACH)** or **debit/credit card**.

---

## 2. Three things to decide before any code is written

These are blocking. Getting them wrong is expensive to undo.

### 2.1 🔴 Are you legally taking premium payments? (biggest one)

Collecting premium directly makes you a fiduciary holding **premium trust
funds**. In Illinois that generally implies a separate premium fund trust
account, no commingling with operating cash, and record-keeping obligations
under the Insurance Code. Carrier agency agreements often further restrict
whether you may collect premium at all, and how fast it must be remitted.

Three models — pick one:

| Model | What it means | Effort |
|---|---|---|
| **A. Direct-bill pass-through** *(recommended to start)* | Portal shows the bill and links to the **carrier's** payment portal. You never touch the money. | Low |
| **B. Agency-billed collection** | You collect via Stripe into a premium trust account and remit to carriers. Full regulatory weight. | High |
| **C. Fee-only** | You collect only agency/broker fees (not premium) by card/ACH. Much lighter. | Medium |

**I can build any of the three.** But the payment section below assumes B or C,
because A needs no payment form at all — just a link. Confirm with your carriers
and, ideally, an IL compliance contact before we commit.

### 2.2 What is a "tenant"?

You said the login should know if it's "a tenant log or an admin login or a
customer." This site has no tenant concept — it's a single agency site. Your
**CRM VOIP** app is the multi-tenant one. Options:

- (a) Roles are just **admin** and **customer** here → simplest, recommended.
- (b) Add an **agent** role (your producers get logins with limited access).
- (c) You actually want this portal to live inside the CRM app instead.

I'll assume **(b) admin + agent + customer** unless you say otherwise, since it
costs almost nothing to include the role now.

### 2.3 Where do ID cards and policy documents come from?

They're issued by carriers, not by us. Realistic options:

- **Admin uploads PDFs** per policy (Vercel Blob, already wired for blog images).
  Simple, works day one, but manual.
- Carrier download automation — brittle, out of scope for v1.

Assuming **manual admin upload** for v1.

---

## 3. Current state (verified in the codebase)

| Area | Today | Implication |
|---|---|---|
| Admin auth | **Hardcoded** `admin` / `KoverKing2026!` in `app/lib/actions.ts:189` | 🔴 Must be replaced. It's also in git history — rotate it. |
| Sessions | `admin_sessions` table, random UUID token in **sessionStorage** | Workable pattern; move to httpOnly cookie. |
| `admins` table | Exists with `password_hash` but is **never used** (0 references) | Dead code — the real login ignores it. |
| Database | LibSQL/Turso, raw SQL, idempotent `initDb()` | Extend the same way. |
| File storage | Vercel Blob (`uploadAuthorPhoto` pattern) | Reuse for policy docs. |
| Email | Resend | Reuse for verification + receipts. |
| Payments | **None** | Greenfield. |
| Auth/crypto libs | **None** | See note below. |

**Native-dependency note:** per `CLAUDE.md`, macOS-native binaries break on
Vercel's Linux runtime. So **no `bcrypt`**. Use `node:crypto`'s built-in
`scrypt` — zero dependencies, no native build, and it's the right primitive.

---

## 4. Proposed architecture

### 4.1 Authentication & roles

Replace the ad-hoc admin login with one unified system.

- Single **`users`** table with a `role` column (`admin` | `agent` | `customer`).
- Single **`sessions`** table (replaces `admin_sessions`).
- One `/login` page. On submit we look up the user, verify the password, and
  **redirect by role**: admin/agent → `/admin/dashboard`, customer → `/portal`.
  The user never picks a "type" — exactly what you asked for.
- Passwords hashed with **scrypt** (`node:crypto`), unique salt per user.
- Session token in an **httpOnly, Secure, SameSite=Lax cookie** — not
  sessionStorage. sessionStorage is readable by any XSS; a cookie isn't.
- Rate-limit login attempts (per-email + per-IP) to blunt credential stuffing.

**Self-registration:** only ever creates a `customer`. Admin/agent accounts are
created from the admin dashboard — never self-serve.

**Email verification:** on signup, insert a single-use token
(`email_verification_tokens`, ~24h expiry), send via Resend, and block portal
access until `email_verified_at` is set. Same pattern for password reset.

### 4.2 Data model (new tables)

```
users
  id, email UNIQUE, password_hash, role, first_name, last_name, phone,
  email_verified_at, created_at, last_login_at

sessions
  id, user_id, token UNIQUE, expires_at, created_at

email_verification_tokens   id, user_id, token UNIQUE, expires_at, used_at
password_reset_tokens       id, user_id, token UNIQUE, expires_at, used_at

policies
  id, customer_id → users.id, carrier, insurance_type, policy_number,
  term ('monthly'|'6_month'|'12_month'), premium_cents,
  effective_date, expiration_date, status, created_at

policy_documents
  id, policy_id, kind ('id_card'|'policy'|'declaration'|'other'),
  blob_url, filename, uploaded_at

invoices                       -- "the bill" the admin creates
  id, customer_id, policy_id, invoice_number UNIQUE,
  amount_cents, due_date, term, status
  ('draft'|'sent'|'paid'|'overdue'|'void'|'refunded'),
  stripe_payment_intent_id, paid_at, created_at, notes

payments
  id, invoice_id, amount_cents,
  method ('card'|'ach'), status, stripe_payment_intent_id,
  last4, created_at
```

**All money stored as integer cents.** Never floats — `0.1 + 0.2 != 0.3` and
rounding errors on premium are unacceptable.

### 4.3 Customer portal (`/portal`)

- **Dashboard** — active policies, next amount due, quick "Pay Now".
- **My Policies** — carrier, type, policy number, term, premium, effective/expiry.
- **ID Cards** — view/download per policy; mobile-friendly (people show these at
  traffic stops, so make it fast and legible on a phone).
- **Documents** — declaration pages, policy PDFs.
- **Billing** — invoice list, status, "Pay Now", payment history, receipts.
- **Profile** — contact info, password change.

Every query scoped by `customer_id` from the session — a customer must never be
able to read another customer's documents by guessing an ID.

### 4.4 Admin: create a bill

New **Billing** tab in the existing dashboard:

1. Pick customer (search existing, or invite a new one by email).
2. Pick/create policy: **carrier**, **insurance type**, policy number,
   **term** (monthly / 6-month / 12-month), **premium amount**.
3. Generate invoice: amount, due date, optional note.
4. **Send** → emails the customer a link to pay in the portal.
5. Track status; record offline payments (check/cash) manually.
6. Upload ID card / policy PDF against the policy.

### 4.5 Payments

**Recommendation: Stripe**, using **hosted Stripe Checkout** or **Payment
Elements** — the card fields live in a Stripe-hosted iframe, so raw card numbers
never touch your server or your database.

Support both rails you asked for:

- **Card (debit/credit)** — ~2.9% + 30¢.
- **ACH / e-check** (your "online check") — **0.8%, capped at $5**.

That cap matters a lot at insurance premium sizes. On a $1,800 12-month auto
premium: **card ≈ $52.50, ACH = $5.00.** Default the UI to ACH and make card the
secondary option; on ~200 such payments a year that's roughly **$9,500 saved**.
(ACH settles in ~3–5 business days and can fail after the fact, so mark invoices
`paid` only on the settled webhook, not at submit.)

**Flow:** customer clicks Pay → server creates a PaymentIntent for that invoice →
Stripe collects the details → **webhook** (`payment_intent.succeeded`,
`payment_failed`, `charge.refunded`) is what flips the invoice to `paid`. Never
trust the browser's "success" redirect as proof of payment — verify the webhook
signature and treat it as the source of truth. Make webhook handling
**idempotent** (Stripe retries).

**Saved payment methods / autopay** are a natural follow-on: store the Stripe
customer + payment-method ID (a token, never the card number).

---

## 5. Security & compliance checklist

| Item | Approach |
|---|---|
| Card data | **Never** touches our servers or DB. Stripe-hosted fields → PCI **SAQ A**, the lightest tier. Storing a raw PAN would be a catastrophe — we won't. |
| Passwords | scrypt (`node:crypto`), per-user salt. Never logged. |
| Sessions | httpOnly + Secure + SameSite cookie, server-side expiry, invalidate on logout & password change. |
| Hardcoded admin password | Delete it. Seed a real admin row. **Rotate `KoverKing2026!` — it's in git history.** |
| Document access | Signed, expiring URLs; every fetch re-checks ownership. |
| PII | Policy docs and ID cards are sensitive. TLS in transit (already), access-controlled at rest. |
| Enumeration | Login and reset return identical messaging whether or not the email exists. |
| Rate limiting | Login, registration, and reset endpoints. |
| Audit trail | Log who created/modified/voided an invoice and who viewed documents. |

---

## 6. Build plan

Sequenced so each phase is independently shippable and testable.

| Phase | Scope | Est. |
|---|---|---|
| **1. Auth foundation** | `users`/`sessions` tables, scrypt hashing, unified `/login` with role redirect, cookie sessions, migrate the existing admin off hardcoded creds, footer link → "Log In" | 1–1.5 days |
| **2. Registration + email** | Self-signup (customer only), Resend verification email, verify/resend, forgot & reset password | ~1 day |
| **3. Customer portal shell** | `/portal` layout + route guards, dashboard, profile | ~1 day |
| **4. Policies & documents** | Policy CRUD in admin, Blob upload, portal views for ID cards + documents | 1–1.5 days |
| **5. Admin billing** | Billing tab, create/send invoice (carrier, type, term, premium), status tracking, offline payments | 1–1.5 days |
| **6. Payments** | Stripe wiring, ACH + card, PaymentIntents, webhooks, receipts, payment history | 2–2.5 days |
| **7. Hardening** | Rate limiting, audit log, access-control tests, end-to-end test in Stripe test mode | ~1 day |

**Total ≈ 8–10 working days** for all seven. Phases 1–2 alone deliver the "one
login that knows who you are + customers can register" piece.

A reasonable v1 cut: **1 → 2 → 3 → 5**, with Phase 5 showing the bill and linking
to the carrier's payment page (Model A). Add Phase 6 once the trust-account
question in §2.1 is settled.

---

## 7. New environment variables

```
STRIPE_SECRET_KEY=            # server only
VITE_STRIPE_PUBLISHABLE_KEY=  # safe in client
STRIPE_WEBHOOK_SECRET=        # verify webhook signatures
APP_URL=https://koverking.com # for links in emails
```

Already present and reusable: `RESEND_API_KEY`, `EMAIL_FROM`,
`BLOB_READ_WRITE_TOKEN`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`.

---

## 8. Open questions

1. **§2.1 — which payment model (A/B/C)?** Blocks Phase 6.
2. **§2.2 — is there an `agent` role, or just admin + customer?**
3. **§2.3 — admin-uploaded documents confirmed?**
4. Should customers see **all historical** policies or only active ones?
5. Do you want **autopay / saved payment methods** in v1, or later?
6. Partial payments allowed, or pay-in-full only?
7. Late fees / past-due handling — automatic or manual?
8. Should registration **auto-link** to existing quote records by email so a new
   customer immediately sees their policies?
