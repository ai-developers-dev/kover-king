// GoHighLevel (LeadConnector) push — API v2 via Private Integration token.
//
// Env (no-op until both are set):
//   GHL_PIT_TOKEN   – Private Integration token (Settings → Private Integrations;
//                     needs the "View Contacts" + "Edit Contacts" scopes)
//   GHL_LOCATION_ID – Sub-account Location ID (Settings → Business Profile)
//
// Uses /contacts/upsert so repeat entrants update the same contact (deduped
// by email/phone) instead of creating duplicates. Tags are additive in GHL.

export type GhlContact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  tags: string[];
  source?: string;
};

export async function upsertGhlContact(
  contact: GhlContact
): Promise<{ pushed: boolean; error?: string }> {
  const token = process.env.GHL_PIT_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    return { pushed: false, error: "GHL not configured (GHL_PIT_TOKEN / GHL_LOCATION_ID)" };
  }

  try {
    const res = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        locationId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        address1: contact.address1 || undefined,
        city: contact.city || undefined,
        state: contact.state || undefined,
        postalCode: contact.postalCode || undefined,
        dateOfBirth: contact.dateOfBirth || undefined,
        tags: contact.tags,
        source: contact.source || undefined,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      // Surface in Vercel function logs for debugging.
      console.error(`GHL upsert failed: HTTP ${res.status} ${body.slice(0, 300)}`);
      return { pushed: false, error: `GHL HTTP ${res.status}` };
    }
    return { pushed: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error(`GHL upsert error: ${msg}`);
    return { pushed: false, error: msg };
  }
}
