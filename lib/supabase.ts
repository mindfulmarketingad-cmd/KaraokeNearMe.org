// Supabase config for the booking/inquiry lead form. The publishable key is
// safe to ship to the browser — it only permits the row-level-security
// policies you define. Values fall back to the project defaults but can be
// overridden with NEXT_PUBLIC_ env vars without touching code.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://tbqigevoksabizjogvtm.supabase.co";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_aHlx0Tdu2rhOTBUp3lhkQw_Lv6Awz7a";

// The table booking inquiries are written to.
export const LEADS_TABLE = "leads";

export interface BookingLead {
  venue_slug: string;
  venue_name: string;
  venue_city: string;
  venue_state: string;
  name: string;
  email: string;
  phone: string | null;
  guests: number | null;
  room_type: string;
  arrival_date: string | null;
  arrival_time: string | null;
  duration_hours: number | null;
  notes: string | null;
  source: string;
}

// Inserts a lead via Supabase's PostgREST endpoint. Requires a `leads` table
// with an RLS policy allowing INSERT for the anon role. Throws on failure so
// the form can show an error.
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
