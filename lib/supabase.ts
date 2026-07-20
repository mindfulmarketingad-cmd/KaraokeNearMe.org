// Supabase config for the booking/inquiry lead form. The publishable key is
// safe to ship to the browser — it only permits the row-level-security
// policies you define. Values fall back to the project defaults but can be
// overridden with NEXT_PUBLIC_ env vars without touching code.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://tbqigevoksabizjogvtm.supabase.co";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_aHlx0Tdu2rhOTBUp3lhkQw_Lv6Awz7a";

// The `leads` table is shared across the site owner's other businesses (its
// enum columns like project_type/job_category are for a concrete contractor,
// and columns like chair_count/needs_tent are for an event-rental site). We
// only ever write the generic columns below — never the enum-typed or
// other-business-specific ones — so we can't violate a constraint we don't
// know the rules for, and our rows are distinguishable via `source`/
// `page_url`/`event_type`.
export const LEADS_TABLE = "leads";

export interface BookingLead {
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  event_type: string;
  event_date: string | null;
  guest_count: string | null;
  services: string[];
  message: string;
  source: string;
  page_url: string;
}

// Inserts a lead via Supabase's PostgREST endpoint. Requires the `leads`
// table to have an RLS policy allowing INSERT for the anon role. Throws on
// failure so the form can show an error.
export async function submitBookingLead(lead: BookingLead): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${LEADS_TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(lead),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Booking request failed (${res.status}). ${detail}`.trim()
    );
  }
}
