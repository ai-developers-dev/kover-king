// Transactional emails for the customer portal (Resend).
// Reuses the same RESEND_API_KEY / EMAIL_FROM as the rest of the site.

const APP_URL = process.env.APP_URL || "https://koverking.com";

function shell(heading: string, bodyHtml: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
    <div style="background:#B33D08;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
      <div style="font-size:20px;font-weight:800;">Kover King Insurance</div>
      <div style="font-size:13px;opacity:.9;">${heading}</div>
    </div>
    <div style="background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
      ${bodyHtml}
    </div>
    <p style="font-size:11px;color:#737373;margin-top:16px;text-align:center;">
      Kover King Insurance Agency · 7612 Wentworth Dr., Springfield, IL 62711 · (217) 960-8997
    </p>
  </div>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#B33D08;color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:10px;">${label}</a>`;
}

async function send(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not configured");
  const from = process.env.EMAIL_FROM || "Kover King <info@koverking.com>";
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) throw new Error(String((error as { message?: string }).message ?? error));
}

export async function sendVerificationEmail({
  to,
  firstName,
  token,
}: {
  to: string;
  firstName: string;
  token: string;
}) {
  const link = `${APP_URL}/verify-email?token=${token}`;
  await send(
    to,
    "Confirm your email — Kover King Insurance",
    shell(
      "Confirm your email address",
      `<p style="font-size:15px;color:#171717;">Hi ${firstName},</p>
       <p style="font-size:14px;color:#525252;line-height:1.6;">
         Thanks for creating your Kover King account. Confirm your email address
         to activate it and access your policies, ID cards, and billing.
       </p>
       <p style="margin:24px 0;">${button(link, "Confirm My Email")}</p>
       <p style="font-size:12px;color:#737373;line-height:1.6;">
         This link expires in 24 hours. If the button doesn't work, paste this
         into your browser:<br>
         <span style="color:#B33D08;word-break:break-all;">${link}</span>
       </p>
       <p style="font-size:12px;color:#737373;">
         If you didn't create this account, you can safely ignore this email.
       </p>`
    )
  );
}

export async function sendPasswordResetEmail({
  to,
  firstName,
  token,
}: {
  to: string;
  firstName: string;
  token: string;
}) {
  const link = `${APP_URL}/reset-password?token=${token}`;
  await send(
    to,
    "Reset your password — Kover King Insurance",
    shell(
      "Reset your password",
      `<p style="font-size:15px;color:#171717;">Hi ${firstName},</p>
       <p style="font-size:14px;color:#525252;line-height:1.6;">
         We received a request to reset your Kover King account password.
       </p>
       <p style="margin:24px 0;">${button(link, "Reset My Password")}</p>
       <p style="font-size:12px;color:#737373;line-height:1.6;">
         This link expires in 1 hour and can only be used once.<br>
         <span style="color:#B33D08;word-break:break-all;">${link}</span>
       </p>
       <p style="font-size:12px;color:#737373;">
         If you didn't request this, ignore this email — your password won't change.
       </p>`
    )
  );
}
