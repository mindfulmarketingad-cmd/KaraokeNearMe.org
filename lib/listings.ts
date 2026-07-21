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
  photoUrl: string | null;
  streetViewUrl: string | null;
  logoUrl: string | null;
  photosCount: number | null;
  bookingUrl: string | null;
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

// Rank by star rating (highest first), using review volume as the tiebreaker
// so a 5.0 with one review doesn't outrank a 4.9 with hundreds. Unrated
// venues fall to the bottom.
export function sortByRating(a: Listing, b: Listing): number {
  return (b.rating ?? -1) - (a.rating ?? -1) || (b.reviews ?? 0) - (a.reviews ?? 0);
}

// The /find/ city page for a venue's own city, e.g. /find/karaoke-new-york-ny/.
// Used to hyperlink the "City, State" text on listing cards.
export function cityFindHref(
  citySlug: string,
  stateSlug: string,
  stateCode: string | null
): string {
  const stateAbbr = (stateCode ?? stateSlug.slice(0, 2)).toLowerCase();
  return `/find/karaoke-${citySlug}-${stateAbbr}/`;
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
  | "bowling"
  | "korean"
  | "live-band"
  | "best"
  | "top-rated"
  | "ktv"
  | "lounge"
  | "spots"
  | "24-hour"
  | "competitions"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"
  | "open-now"
  | "open-weekends"
  | "best-bars"
  | "best-restaurants";

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

function is24Hour(l: Listing): boolean {
  return (l.hours ?? []).some((h) => !h.closed && /24\s*hours/i.test(h.label));
}

// True when the venue's published hours show it open on the given weekday.
// Only venues with real hours data qualify, so day-of-week pages are limited
// to the listings we actually have schedules for.
function opensOnDay(l: Listing, day: string): boolean {
  return (l.hours ?? []).some((h) => h.day === day && !h.closed);
}

function opensWeekends(l: Listing): boolean {
  return opensOnDay(l, "Saturday") || opensOnDay(l, "Sunday");
}

// "Open now" can't be computed at build time on a static page, so this stands
// in for "we have this venue's hours, so you can see live open/closed status
// on the map and its listing." Venues with no schedule are excluded.
function hasKnownHours(l: Listing): boolean {
  return (l.hours ?? []).some((h) => !h.closed);
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

const KOREAN_RE = /korean|노래방/i;
function isKorean(l: Listing): boolean {
  const subs = l.subtypes ?? [];
  return (
    KOREAN_RE.test(l.type ?? "") ||
    subs.some((s) => KOREAN_RE.test(s)) ||
    KOREAN_RE.test(l.name ?? "")
  );
}

function isLiveBand(l: Listing): boolean {
  return l.serviceSlugs.includes("live-music-venue");
}

function isBestKaraoke(l: Listing): boolean {
  return l.reviews != null && l.reviews >= 50;
}

function isTopRatedKaraoke(l: Listing): boolean {
  return l.rating != null && l.rating >= 4.5;
}

function isPrivateRoom(l: Listing): boolean {
  return l.serviceSlugs.includes("private-karaoke-rooms");
}

function isLounge(l: Listing): boolean {
  return l.serviceSlugs.includes("lounge");
}

function isKaraokeBarVenue(l: Listing): boolean {
  return l.serviceSlugs.includes("karaoke-bar") || l.serviceSlugs.includes("bar");
}

function isKaraokeRestaurant(l: Listing): boolean {
  return l.serviceSlugs.includes("restaurant");
}

interface FindTemplate {
  kind: FindPageKind;
  slugPrefix: string;
  filter: (l: Listing) => boolean;
  // Whether this kind also shows up as a filter chip on the map/Partners
  // hub. Pure ranking/framing variants (best, top-rated, spots) reuse
  // criteria already exposed elsewhere in the UI, so they're /find/ pages
  // only, not additional chips.
  chip?: boolean;
  // How the venue list is ordered on the page. Defaults to "prominence"
  // (review volume first); "rating" leads with the highest-starred venues,
  // which fits the "best" ranking pages.
  sort?: "prominence" | "rating";
}

// Each template defines a pSEO variant under /find/: which venues qualify
// and the slug prefix used to build its per-city URLs. Cities with zero
// matching venues never get a page for that template.
const FIND_TEMPLATES: FindTemplate[] = [
  { kind: "city", slugPrefix: "karaoke-", filter: () => true },
  {
    kind: "private-rooms",
    slugPrefix: "private-karaoke-",
    filter: isPrivateRoom,
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
  { kind: "korean", slugPrefix: "korean-karaoke-", filter: isKorean },
  { kind: "live-band", slugPrefix: "live-band-karaoke-", filter: isLiveBand },
  { kind: "best", slugPrefix: "best-karaoke-", filter: isBestKaraoke, chip: false },
  {
    kind: "top-rated",
    slugPrefix: "top-rated-karaoke-",
    filter: isTopRatedKaraoke,
    chip: false,
  },
  { kind: "ktv", slugPrefix: "ktv-", filter: isPrivateRoom },
  { kind: "lounge", slugPrefix: "karaoke-lounge-", filter: isLounge },
  { kind: "spots", slugPrefix: "karaoke-spots-", filter: () => true, chip: false },
  { kind: "24-hour", slugPrefix: "24-hour-karaoke-", filter: is24Hour },
  {
    kind: "competitions",
    slugPrefix: "karaoke-competitions-",
    filter: () => true,
    chip: false,
  },
  { kind: "monday", slugPrefix: "karaoke-monday-", filter: (l) => opensOnDay(l, "Monday"), chip: false },
  { kind: "tuesday", slugPrefix: "karaoke-tuesday-", filter: (l) => opensOnDay(l, "Tuesday"), chip: false },
  { kind: "wednesday", slugPrefix: "karaoke-wednesday-", filter: (l) => opensOnDay(l, "Wednesday"), chip: false },
  { kind: "thursday", slugPrefix: "karaoke-thursday-", filter: (l) => opensOnDay(l, "Thursday"), chip: false },
  { kind: "friday", slugPrefix: "karaoke-friday-", filter: (l) => opensOnDay(l, "Friday"), chip: false },
  { kind: "saturday", slugPrefix: "karaoke-saturday-", filter: (l) => opensOnDay(l, "Saturday"), chip: false },
  { kind: "sunday", slugPrefix: "karaoke-sunday-", filter: (l) => opensOnDay(l, "Sunday"), chip: false },
  { kind: "open-now", slugPrefix: "karaoke-open-now-", filter: hasKnownHours, chip: false },
  { kind: "open-weekends", slugPrefix: "karaoke-open-on-weekends-", filter: opensWeekends, chip: false },
  {
    kind: "best-bars",
    slugPrefix: "best-karaoke-bars-",
    filter: isKaraokeBarVenue,
    chip: false,
    sort: "rating",
  },
  {
    kind: "best-restaurants",
    slugPrefix: "best-karaoke-restaurants-",
    filter: isKaraokeRestaurant,
    chip: false,
    sort: "rating",
  },
];

// Cities with at least one listing, keyed for the /find/ search-map pages.
// findSlug follows the "karaoke-{city}-{state abbr}" pattern, e.g.
// "karaoke-new-york-ny".
export function findableCities(): CityGroup[] {
  return buildCityGroups(() => true, "karaoke-");
}

// Human-readable label for each karaoke "type" filter, used on map search
// bars. "city" is excluded since it just means "any venue".
export const FIND_TYPE_LABELS: Record<Exclude<FindPageKind, "city">, string> = {
  "private-rooms": "Private Karaoke",
  family: "Family Friendly",
  "queer-friendly": "Queer Friendly",
  daytime: "Daytime",
  "dine-in": "Dine-In",
  hispanic: "Hispanic",
  bowling: "Bowling",
  korean: "Korean Karaoke",
  "live-band": "Live Band Karaoke",
  best: "Best Karaoke",
  "top-rated": "Top Rated",
  ktv: "KTV",
  lounge: "Karaoke Lounge",
  spots: "Karaoke Spots",
  "24-hour": "24 Hour Karaoke",
  competitions: "Karaoke Competitions",
  monday: "Karaoke Monday",
  tuesday: "Karaoke Tuesday",
  wednesday: "Karaoke Wednesday",
  thursday: "Karaoke Thursday",
  friday: "Karaoke Friday",
  saturday: "Karaoke Saturday",
  sunday: "Karaoke Sunday",
  "open-now": "Open Now",
  "open-weekends": "Open On Weekends",
  "best-bars": "Best Karaoke Bars",
  "best-restaurants": "Best Karaoke Restaurants",
};

export const FIND_TYPE_FILTERS: { slug: FindPageKind; label: string }[] = FIND_TEMPLATES.filter(
  (t) => t.kind !== "city" && t.chip !== false
).map((t) => ({
  slug: t.kind,
  label: FIND_TYPE_LABELS[t.kind as Exclude<FindPageKind, "city">],
}));

// Which karaoke "type" tags a venue qualifies for, e.g. for map filter chips
// and business-card labels. Excludes the "city" catch-all and framing-only
// variants (best/top-rated/spots/competitions), which aren't real attributes
// of a venue — every venue would match those and they'd just be noise.
export function venueTagSlugs(l: Listing): FindPageKind[] {
  return FIND_TEMPLATES.filter(
    (t) => t.kind !== "city" && t.chip !== false && t.filter(l)
  ).map((t) => t.kind);
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

// Statewide /find/ pages ("Karaoke in [State]") at /find/karaoke-{stateSlug}.
// Distinct from city pages, whose slugs always end in a two-letter state code.
export interface StateFindPage {
  stateSlug: string;
  state: string;
  stateCode: string | null;
  count: number;
  findSlug: string;
}

export function stateFindPages(): StateFindPage[] {
  const map = new Map<string, StateFindPage>();
  for (const l of listings) {
    const e =
      map.get(l.stateSlug) ??
      {
        stateSlug: l.stateSlug,
        state: l.state,
        stateCode: l.stateCode,
        count: 0,
        findSlug: `karaoke-${l.stateSlug}`,
      };
    e.count += 1;
    map.set(l.stateSlug, e);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.state.localeCompare(b.state));
}

export function getStateFindPage(findSlug: string): StateFindPage | undefined {
  return stateFindPages().find((p) => p.findSlug === findSlug);
}

// The actual venues for a given /find/ page, applying that page's template
// filter within its city.
export function findPageListings(page: FindPage): Listing[] {
  const template = FIND_TEMPLATES.find((t) => t.kind === page.kind);
  const sorter = template?.sort === "rating" ? sortByRating : sortByProminence;
  return listings
    .filter(
      (l) =>
        l.citySlug === page.citySlug &&
        l.stateSlug === page.stateSlug &&
        (template ? template.filter(l) : true)
    )
    .sort(sorter);
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
