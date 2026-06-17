import listingsData from "./listings.json";
import servicesData from "./services.json";

export interface Hour {
  day: string;
  label: string;
  closed: boolean;
}

export interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  time: string;
  avatarUrl: string | null;
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
  googleReviews: GoogleReview[];
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

export function citiesForState(stateSlug: string): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const l of listings.filter((l) => l.stateSlug === stateSlug)) {
    const e = map.get(l.citySlug) ?? { slug: l.citySlug, name: l.city, count: 0 };
    e.count += 1;
    map.set(l.citySlug, e);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export interface CityInfo {
  slug: string;
  name: string;
  state: string;
  stateSlug: string;
  stateCode: string | null;
  count: number;
}

export function allCities(): CityInfo[] {
  const map = new Map<string, CityInfo>();
  for (const l of listings) {
    const existing = map.get(l.citySlug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(l.citySlug, {
        slug: l.citySlug,
        name: l.city,
        state: l.state,
        stateSlug: l.stateSlug,
        stateCode: l.stateCode,
        count: 1,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getCityInfo(citySlug: string): CityInfo | undefined {
  return allCities().find((c) => c.slug === citySlug);
}

export function listingsByCity(citySlug: string): Listing[] {
  return listings.filter((l) => l.citySlug === citySlug).sort(sortByProminence);
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

export function listingUrl(l: Listing): string {
  return `/${l.stateSlug}/${l.citySlug}/${l.slug}/`;
}
