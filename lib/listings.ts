import listingsData from "./listings.json";
import servicesData from "./services.json";

export interface Hour {
  day: string;
  label: string;
  closed: boolean;
}

export interface Listing {
  slug: string;
  name: string;
  city: string;
  citySlug: string;
  state: string;
  stateCode: string | null;
  stateSlug: string;
  postalCode: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  rating: number | null;
  reviews: number | null;
  verified: boolean;
  priceRange: string | null;
  type: string | null;
  subtypes: string[];
  serviceSlugs: string[];
  serviceLabels: Record<string, string>;
  servicesOffered: { label: string; slug: string | null }[];
  amenities: string[];
  description: string | null;
  phone: string | null;
  website: string | null;
  hours: Hour[];
  cid: string | null;
  placeId: string | null;
  about: string;
}

export interface Service {
  slug: string;
  label: string;
  count: number;
}

export const listings = listingsData as unknown as Listing[];
export const services = servicesData as unknown as Service[];

export function getListing(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function listingsByState(stateSlug: string): Listing[] {
  return listings.filter((l) => l.stateSlug === stateSlug);
}

export function listingsByService(serviceSlug: string): Listing[] {
  return listings
    .filter((l) => l.serviceSlugs.includes(serviceSlug))
    .sort(sortByProminence);
}

// Same-city venues first, then same-state, excluding the listing itself.
export function similarListings(listing: Listing, limit = 6): Listing[] {
  const sameCity = listings.filter(
    (l) => l.slug !== listing.slug && l.citySlug === listing.citySlug
  );
  const sameState = listings.filter(
    (l) =>
      l.slug !== listing.slug &&
      l.citySlug !== listing.citySlug &&
      l.stateSlug === listing.stateSlug
  );
  return [...sameCity, ...sameState].sort(sortByProminence).slice(0, limit);
}

// Rank by review volume then rating, so well-established venues surface first.
export function sortByProminence(a: Listing, b: Listing): number {
  return (b.reviews ?? 0) - (a.reviews ?? 0) || (b.rating ?? 0) - (a.rating ?? 0);
}

export function statesWithListings(): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const l of listings) {
    const e = map.get(l.stateSlug) ?? { slug: l.stateSlug, name: l.state, count: 0 };
    e.count += 1;
    map.set(l.stateSlug, e);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export interface CityGroup {
  citySlug: string;
  city: string;
  stateSlug: string;
  state: string;
  stateCode: string | null;
  count: number;
  findSlug: string;
}

function buildCityGroups(
  filter: (l: Listing) => boolean,
  slugPrefix: string
): CityGroup[] {
  const map = new Map<string, CityGroup>();
  for (const l of listings) {
    if (!filter(l)) continue;
    const key = `${l.citySlug}|${l.stateSlug}`;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      continue;
    }
    const stateAbbr = (l.stateCode ?? l.stateSlug.slice(0, 2)).toLowerCase();
    map.set(key, {
      citySlug: l.citySlug,
      city: l.city,
      stateSlug: l.stateSlug,
      state: l.state,
      stateCode: l.stateCode,
      count: 1,
      findSlug: `${slugPrefix}${l.citySlug}-${stateAbbr}`,
    });
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
}

export type FindPageKind =
  | "city"
  | "private-rooms"
  | "family"
  | "queer-friendly"
  | "daytime"
  | "dine-in"
  | "hispanic"
  | "bowling";

function isRestaurantStyle(l: Listing): boolean {
  const subs = l.subtypes ?? [];
  if (l.type != null && /restaurant/i.test(l.type)) return true;
  if (subs.some((s) => /restaurant/i.test(s))) return true;
  return subs.includes("Bar & grill");
}

function isQueerFriendly(l: Listing): boolean {
  const am = l.amenities ?? [];
  const subs = l.subtypes ?? [];
  return (
    am.includes("LGBTQ+ friendly") ||
    am.includes("Gay bar") ||
    am.includes("Transgender safespace") ||
    subs.includes("Gay bar")
  );
}

// Minutes-past-midnight for an hours label's opening time, or null if it
// can't be parsed (e.g. no AM/PM on the start token). Conservative: venues
// with an ambiguous label are simply excluded rather than guessed at.
function parseOpenMinutes(label: string): number | null {
  if (/24\s*hours/i.test(label)) return 0;
  const start = label.split(/[–—-]/)[0]?.trim();
  if (!start) return null;
  const m = start.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (/PM/i.test(m[3])) h += 12;
  return h * 60 + (m[2] ? parseInt(m[2], 10) : 0);
}

// Venues that open by mid-afternoon on at least one day, so there's a
// realistic window to sing karaoke before evening.
function hasDaytimeHours(l: Listing): boolean {
  return (l.hours ?? []).some((h) => {
    if (h.closed) return false;
    const open = parseOpenMinutes(h.label);
    return open != null && open <= 15 * 60;
  });
}

function isDineIn(l: Listing): boolean {
  return (l.amenities ?? []).includes("Dine-in");
}

const HISPANIC_RE = /latin|mexic|spanish|hispanic|salsa|reggaeton|dominican|puerto ric/i;
function isHispanic(l: Listing): boolean {
  const subs = l.subtypes ?? [];
  return (
    HISPANIC_RE.test(l.type ?? "") ||
    subs.some((s) => HISPANIC_RE.test(s)) ||
    HISPANIC_RE.test(l.description ?? "") ||
    HISPANIC_RE.test(l.about ?? "") ||
    HISPANIC_RE.test(l.name ?? "")
  );
}

const BOWLING_RE = /bowl/i;
function isBowling(l: Listing): boolean {
  const subs = l.subtypes ?? [];
  const am = l.amenities ?? [];
  return (
    BOWLING_RE.test(l.type ?? "") ||
    subs.some((s) => BOWLING_RE.test(s)) ||
    am.some((s) => BOWLING_RE.test(s)) ||
    BOWLING_RE.test(l.description ?? "") ||
    BOWLING_RE.test(l.about ?? "") ||
    BOWLING_RE.test(l.name ?? "")
  );
}

interface FindTemplate {
  kind: FindPageKind;
  slugPrefix: string;
  filter: (l: Listing) => boolean;
}

// Each template defines a pSEO variant under /find/: which venues qualify
// and the slug prefix used to build its per-city URLs. Cities with zero
// matching venues never get a page for that template.
const FIND_TEMPLATES: FindTemplate[] = [
  { kind: "city", slugPrefix: "karaoke-", filter: () => true },
  {
    kind: "private-rooms",
    slugPrefix: "private-karaoke-",
    filter: (l) => l.serviceSlugs.includes("private-karaoke-rooms"),
  },
  { kind: "family", slugPrefix: "family-karaoke-", filter: isRestaurantStyle },
  {
    kind: "queer-friendly",
    slugPrefix: "queer-friendly-karaoke-",
    filter: isQueerFriendly,
  },
  { kind: "daytime", slugPrefix: "daytime-karaoke-", filter: hasDaytimeHours },
  { kind: "dine-in", slugPrefix: "dine-in-karaoke-", filter: isDineIn },
  { kind: "hispanic", slugPrefix: "hispanic-karaoke-", filter: isHispanic },
  { kind: "bowling", slugPrefix: "bowling-and-karaoke-", filter: isBowling },
];

// Cities with at least one listing, keyed for the /find/ search-map pages.
// findSlug follows the "karaoke-{city}-{state abbr}" pattern, e.g.
// "karaoke-new-york-ny".
export function findableCities(): CityGroup[] {
  return buildCityGroups(() => true, "karaoke-");
}

export interface FindPage extends CityGroup {
  kind: FindPageKind;
}

export function findPages(): FindPage[] {
  return FIND_TEMPLATES.flatMap((t) =>
    buildCityGroups(t.filter, t.slugPrefix).map((c) => ({ ...c, kind: t.kind }))
  );
}

export function findPagesOfKind(kind: FindPageKind): FindPage[] {
  return findPages().filter((p) => p.kind === kind);
}

export function getFindPage(findSlug: string): FindPage | undefined {
  return findPages().find((p) => p.findSlug === findSlug);
}

// The actual venues for a given /find/ page, applying that page's template
// filter within its city.
export function findPageListings(page: FindPage): Listing[] {
  const template = FIND_TEMPLATES.find((t) => t.kind === page.kind);
  return listings
    .filter(
      (l) =>
        l.citySlug === page.citySlug &&
        l.stateSlug === page.stateSlug &&
        (template ? template.filter(l) : true)
    )
    .sort(sortByProminence);
}

export function citiesForState(stateSlug: string): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const l of listings.filter((l) => l.stateSlug === stateSlug)) {
    const e = map.get(l.citySlug) ?? { slug: l.citySlug, name: l.city, count: 0 };
    e.count += 1;
    map.set(l.citySlug, e);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

// --- formatting / link helpers ---

export function telHref(phone: string): string {
  return "tel:" + phone.replace(/[^\d+]/g, "");
}

export function mapsEmbedUrl(listing: Listing): string {
  const q = listing.lat && listing.lng ? `${listing.lat},${listing.lng}` : listing.address ?? "";
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
}

export function mapsPlaceUrl(listing: Listing): string {
  if (listing.cid) return `https://www.google.com/maps?cid=${listing.cid}`;
  if (listing.lat && listing.lng)
    return `https://www.google.com/maps/search/?api=1&query=${listing.lat},${listing.lng}`;
  return `https://www.google.com/maps/search/${encodeURIComponent(
    `${listing.name} ${listing.city} ${listing.state}`
  )}`;
}

export function priceLabel(range: string | null): string | null {
  if (!range) return null;
  return (
    {
      $: "Budget-friendly",
      $$: "Moderate",
      $$$: "Upscale",
      $$$$: "High-end",
    }[range] ?? range
  );
}
