import type { Listing } from "@/lib/listings";

// Shared venue "facets" — the concrete, data-backed attributes a visitor can
// filter by on the /find/ maps and the /partners/ hub. Each facet has a test
// over a listing's real fields (services, amenities, subtypes), so we never
// claim an attribute we don't have data for. The order here is the priority
// order used when a card shows only its top few chips.

type FacetInput = Pick<Listing, "serviceSlugs" | "amenities" | "subtypes">;

function svc(l: FacetInput, slug: string): boolean {
  return l.serviceSlugs.includes(slug);
}
function amen(l: FacetInput, name: string): boolean {
  return (l.amenities ?? []).includes(name);
}
function sub(l: FacetInput, name: string): boolean {
  return (l.subtypes ?? []).includes(name);
}

export interface VenueFacet {
  id: string;
  label: string;
  test: (l: FacetInput) => boolean;
}

export const FACETS: VenueFacet[] = [
  { id: "private-rooms", label: "Private Rooms", test: (l) => svc(l, "private-karaoke-rooms") },
  { id: "restaurant", label: "Restaurant", test: (l) => svc(l, "restaurant") },
  { id: "bar", label: "Bar", test: (l) => svc(l, "bar") || svc(l, "karaoke-bar") },
  {
    id: "groups",
    label: "Good for Groups",
    test: (l) =>
      amen(l, "Groups") || svc(l, "event-venue") || svc(l, "private-karaoke-rooms"),
  },
  {
    id: "live-music",
    label: "Live Music",
    test: (l) =>
      amen(l, "Live music") || amen(l, "Live performances") || svc(l, "live-music-venue"),
  },
  { id: "sports-bar", label: "Sports Bar", test: (l) => svc(l, "sports-bar") || amen(l, "Sports") },
  { id: "night-club", label: "Night Club", test: (l) => svc(l, "night-club") },
  { id: "lounge", label: "Lounge", test: (l) => svc(l, "lounge") },
  { id: "dine-in", label: "Dine-In", test: (l) => amen(l, "Dine-in") },
  { id: "dancing", label: "Dancing", test: (l) => amen(l, "Dancing") },
  {
    id: "happy-hour",
    label: "Happy Hour",
    test: (l) => amen(l, "Happy hour drinks") || amen(l, "Happy hour food"),
  },
  {
    id: "outdoor",
    label: "Outdoor Seating",
    test: (l) => amen(l, "Outdoor seating") || amen(l, "Rooftop seating"),
  },
  { id: "trivia", label: "Trivia Night", test: (l) => amen(l, "Trivia night") },
  {
    id: "bar-games",
    label: "Bar Games",
    test: (l) => amen(l, "Bar games") || amen(l, "Arcade games"),
  },
  {
    id: "lgbtq",
    label: "LGBTQ+ Friendly",
    test: (l) =>
      amen(l, "LGBTQ+ friendly") ||
      amen(l, "Transgender safespace") ||
      amen(l, "Gay bar") ||
      sub(l, "Gay bar"),
  },
];

export const FACET_LABEL: Record<string, string> = Object.fromEntries(
  FACETS.map((f) => [f.id, f.label])
);

// The facet ids a listing matches, in FACETS priority order. Precomputed on
// the server so client components only do cheap membership tests.
export function venueFacetIds(l: FacetInput): string[] {
  return FACETS.filter((f) => f.test(l)).map((f) => f.id);
}

// Star-rating filter options, shared by both filter UIs.
export interface RatingOption {
  id: string;
  label: string;
  test: (rating: number | null) => boolean;
}

export const RATING_OPTIONS: RatingOption[] = [
  { id: "", label: "Any rating", test: () => true },
  { id: "4", label: "4★ & up", test: (r) => r != null && r >= 4 },
  { id: "45", label: "4.5★ & up", test: (r) => r != null && r >= 4.5 },
  { id: "5", label: "5★ only", test: (r) => r === 5 },
];

export function ratingTest(id: string, rating: number | null): boolean {
  const opt = RATING_OPTIONS.find((o) => o.id === id);
  return opt ? opt.test(rating) : true;
}
