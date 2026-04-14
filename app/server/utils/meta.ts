export interface MetaLeadData {
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

export async function fetchMetaLead(leadgenId: string): Promise<MetaLeadData> {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token) throw new Error("META_PAGE_ACCESS_TOKEN not set");

  const url = `https://graph.facebook.com/v19.0/${leadgenId}?fields=field_data&access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Meta Graph API error ${res.status}: ${body}`);
  }

  const json = (await res.json()) as {
    field_data: Array<{ name: string; values: string[] }>;
  };
  const fields = json.field_data ?? [];

  const get = (key: string) =>
    fields.find((f) => f.name === key)?.values?.[0] ?? null;

  return {
    full_name: get("full_name") || get("first_name"),
    email: get("email"),
    phone: get("phone_number"),
  };
}
