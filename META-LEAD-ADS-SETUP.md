# Meta Lead Ads Integration — Setup Guide

This guide walks you through connecting Meta (Facebook) Lead Ads to your Kover King website so that leads automatically flow into your database and users get a prefilled quote form.

---

## How It Works

1. User fills out a Meta Lead Ad (name, email, phone)
2. Meta sends a webhook to your server
3. Your server fetches the full lead data from Meta's API
4. Lead is stored in your Turso database with a secure token
5. User clicks the thank-you page button → lands on `/quote-continue?t=TOKEN`
6. Form is prefilled with their name, email, phone — they just add property details
7. On submit, the full quote is saved to your quotes table and visible in the admin dashboard

---

## Step 1: Create a Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/apps/)
2. Click **Create App**
3. Select **Business** type → click **Next**
4. Name it something like `Kover King Leads` → select your Business account → click **Create App**
5. On the app dashboard, find **Webhooks** in the left sidebar and click **Set Up**

### Get Your App Credentials

1. Go to **App Settings → Basic** in the left sidebar
2. Copy your **App Secret** — this is your `META_APP_SECRET`
3. Choose a random verify string (e.g., `koverking-webhook-verify-2026`) — this is your `META_VERIFY_TOKEN`

---

## Step 2: Get a Page Access Token

1. Go to [Meta Business Settings → Pages](https://business.facebook.com/settings/pages)
2. Select your Kover King Facebook Page
3. Go to your app at [Meta for Developers](https://developers.facebook.com/apps/)
4. In the left sidebar, go to **Messenger → Settings** or use the [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
5. Select your app, select your page, and request the `pages_manage_ads`, `leads_retrieval`, and `pages_read_engagement` permissions
6. Generate a **Page Access Token** — this is your `META_PAGE_ACCESS_TOKEN`

> **Important:** For a long-lived token, use the [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) to extend it, or set up a System User token in Business Settings which never expires.

---

## Step 3: Add Environment Variables to Vercel

1. Go to [Vercel Dashboard → Kover King Project → Settings → Environment Variables](https://vercel.com/ai-developers-projects-e4097837/kover-king/settings/environment-variables)
2. Add these three variables for **Production** environment:

| Variable | Value | Description |
|----------|-------|-------------|
| `META_VERIFY_TOKEN` | `koverking-webhook-verify-2026` | Any secret string you choose (must match what you enter in Meta) |
| `META_APP_SECRET` | *(from Meta App Settings → Basic)* | Used to verify webhook signatures |
| `META_PAGE_ACCESS_TOKEN` | *(from Step 2 above)* | Used to fetch lead data from Meta's API |

3. Click **Save** for each
4. **Redeploy** the project so the new env vars take effect:
   - Go to [Deployments](https://vercel.com/ai-developers-projects-e4097837/kover-king/deployments)
   - Click the three dots on the latest deployment → **Redeploy**

---

## Step 4: Configure the Meta Webhook

1. Go to your app at [Meta for Developers](https://developers.facebook.com/apps/)
2. In the left sidebar, click **Webhooks**
3. From the dropdown, select **Page**
4. Click **Subscribe to this topic**
5. Enter:
   - **Callback URL:** `https://koverking.com/api/webhooks/meta`
   - **Verify Token:** `koverking-webhook-verify-2026` (must match your `META_VERIFY_TOKEN` env var)
6. Click **Verify and Save**
7. After verification succeeds, find `leadgen` in the fields list and click **Subscribe**

> **Note:** If using the Vercel preview URL before connecting your domain, use `https://kover-king.vercel.app/api/webhooks/meta` instead.

### Test the Webhook Verification

You can test it manually in your browser:

```
https://koverking.com/api/webhooks/meta?hub.mode=subscribe&hub.verify_token=koverking-webhook-verify-2026&hub.challenge=test123
```

If configured correctly, the page should display `test123`.

---

## Step 5: Subscribe Your Page to the App

1. Go to [Meta for Developers → Your App → Webhooks](https://developers.facebook.com/apps/)
2. Click **Page** in the object dropdown
3. Make sure `leadgen` is subscribed
4. Then go to **Facebook Page Settings → Connected Apps** and make sure your app is connected to your Kover King page

Alternatively, subscribe via the Graph API:

```
POST https://graph.facebook.com/v19.0/{page-id}/subscribed_apps?subscribed_fields=leadgen&access_token={page-access-token}
```

---

## Step 6: Create a Lead Ad

1. Go to [Meta Ads Manager](https://www.facebook.com/adsmanager/)
2. Create a new campaign with the **Leads** objective
3. Create your ad set and ad
4. In the **Lead Form** section:
   - Add fields: **Full Name**, **Email**, **Phone Number**
   - Under **Thank You Screen**:
     - Set the button text to `See My Quote`
     - Set the button URL to: `https://koverking.com/quote-continue`
     
> **Note:** The thank-you button goes to the page without a token. The form will show editable name/email/phone fields. For the best prefilled experience, use a follow-up SMS or email (via GHL or your automation tool) that includes the tokenized URL: `https://koverking.com/quote-continue?t={TOKEN}`

---

## Step 7: Set Up Follow-Up (Optional but Recommended)

The tokenized URL (`?t=TOKEN`) provides the best user experience with prefilled fields. To send it:

### Option A: Go High Level (GHL)
1. Set up a GHL workflow triggered by the Meta lead webhook (or by new contacts)
2. In the workflow, send an SMS or email with the tokenized link
3. The token can be retrieved from your database via a custom API call

### Option B: Custom Automation
1. Extend the webhook handler to send an SMS via Twilio or email via SendGrid
2. Include the tokenized URL in the message
3. Example message: *"Thanks for your interest in home insurance! Complete your quote here: https://koverking.com/quote-continue?t={TOKEN}"*

---

## Testing the Full Flow

### Test with a Real Lead (Recommended)
1. Create a test lead ad (you can target yourself)
2. Fill out the lead form on Facebook/Instagram
3. Check your Turso database for the new lead:
   ```bash
   turso db shell kover-king "SELECT * FROM meta_leads ORDER BY id DESC LIMIT 1;"
   turso db shell kover-king "SELECT * FROM lead_tokens ORDER BY id DESC LIMIT 1;"
   ```
4. Copy the token and visit: `https://koverking.com/quote-continue?t={TOKEN}`
5. Verify your name/email/phone are prefilled

### Test with Meta's Test Tool
1. Go to your app at [Meta for Developers](https://developers.facebook.com/apps/)
2. Click **Webhooks** → **Page** → **leadgen**
3. Click **Test** to send a test webhook payload
4. Check your server logs and database

### Test Manually (No Meta Required)
Insert a test lead directly:
```bash
turso db shell kover-king "INSERT INTO meta_leads (leadgen_id, full_name, email, phone) VALUES ('manual-test', 'Test User', 'test@example.com', '2175551234');"
turso db shell kover-king "INSERT INTO lead_tokens (lead_id, token, expires_at) VALUES ((SELECT id FROM meta_leads WHERE leadgen_id='manual-test'), 'my-test-token-123', '2026-12-31T00:00:00Z');"
```
Then visit: `https://koverking.com/quote-continue?t=my-test-token-123`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook verification fails | Check that `META_VERIFY_TOKEN` env var matches what you entered in Meta |
| Leads not appearing in DB | Check Vercel function logs for `[meta-webhook]` errors. Verify `META_PAGE_ACCESS_TOKEN` is valid |
| "Token expired" on landing page | Tokens expire after 72 hours. Create a new test token or submit a new lead |
| "Token already used" | Each token can only load the prefill once. Insert a new token for testing |
| Signature verification fails | Verify `META_APP_SECRET` matches your app's secret in Meta App Settings |

### Useful Links

- [Meta for Developers — App Dashboard](https://developers.facebook.com/apps/)
- [Meta Business Settings](https://business.facebook.com/settings/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
- [Meta Lead Ads Documentation](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/)
- [Meta Webhooks Documentation](https://developers.facebook.com/docs/graph-api/webhooks/)
- [Vercel Dashboard — Kover King](https://vercel.com/ai-developers-projects-e4097837/kover-king)
- [Turso Dashboard](https://turso.tech/app)
- [Kover King Admin Dashboard](https://koverking.com/admin)

---

## Security Notes

- Webhook signatures are verified with HMAC-SHA256 (using `META_APP_SECRET`)
- Tokens are random 48-character hex strings (not guessable)
- Tokens expire after 72 hours
- Tokens are single-use (marked as used after the prefill page loads)
- No PII is ever passed in URLs — only opaque tokens
- The prefill API returns `Cache-Control: no-store` to prevent caching
- Landing pages are `noindex, nofollow` to stay out of search engines
