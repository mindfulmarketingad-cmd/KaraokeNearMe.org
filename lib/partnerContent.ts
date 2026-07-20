import type { Listing } from "@/lib/listings";

// Builds unique, data-derived editorial content for each venue page so no
// listing is thin. Everything here is computed from the venue's own fields
// (type, services, amenities, rating, reviews, price, hours, location) — nothing
// is invented. Scores are transparent composites of the Google rating and the
// specific features a venue lists, and the page explains exactly how they are
// calculated.

export interface PartnerFaq {
  q: string;
  a: string;
}

export interface PartnerContent {
  specialty: string;
  knownFor: string[];
  bestFor: string;
  keepInMind: string;
  worthKnowing: string;
  atmosphereScore: number | null;
  foodScore: number | null;
  scoreBasis: string;
  faqs: PartnerFaq[];
}

const ATMOSPHERE_SIGNALS = [
  "Live performances",
  "Live music",
  "Dancing",
  "Karaoke",
  "DJ service",
  "Cozy",
  "Trendy",
  "Rooftop seating",
  "Outdoor seating",
  "Fireplace",
  "Great cocktails",
  "Happy hour drinks",
  "Nightlife",
];

const FOOD_SIGNALS = [
  "Dine-in",
  "Food",
  "Food at bar",
  "Happy hour food",
  "Great dessert",
  "Healthy options",
  "Small plates",
  "Comfort food",
  "Quick bite",
];

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function isRestaurantish(l: Listing): boolean {
  const subs = l.subtypes ?? [];
  if (l.type && /restaurant|grill|pub|eatery/i.test(l.type)) return true;
  return subs.some((s) => /restaurant|grill|pub|eatery|bistro|kitchen/i.test(s));
}

function countSignals(l: Listing, signals: string[]): number {
  const am = new Set(l.amenities ?? []);
  return signals.filter((s) => am.has(s)).length;
}

function specialtyFor(l: Listing): string {
  const s = new Set(l.serviceSlugs);
  if (s.has("private-karaoke-rooms")) {
    return "Private karaoke rooms (KTV) you can rent by the hour for your own group.";
  }
  if (s.has("karaoke-bar")) {
    return "Host-led, open-mic karaoke on a shared stage where anyone can sign up to sing.";
  }
  if (s.has("night-club")) {
    return "Late-night karaoke with a club-style, high-energy atmosphere.";
  }
  if (s.has("sports-bar")) {
    return "Casual sports-bar karaoke — screens, drinks, and a come-as-you-are crowd.";
  }
  if (isRestaurantish(l)) {
    return "Karaoke paired with a full food menu, so you can make a meal of the night.";
  }
  if (s.has("lounge") || s.has("cocktail-bar")) {
    return "A relaxed, drinks-forward setting for a lower-key karaoke night.";
  }
  return `Karaoke in ${l.city} in a ${(l.type ?? "casual venue").toLowerCase()} setting.`;
}

function knownForList(l: Listing): string[] {
  const out: string[] = [];
  const am = l.amenities ?? [];
  // Prefer the more distinctive amenities first.
  const priority = [
    "Karaoke",
    "Private rooms",
    "Live performances",
    "Live music",
    "Great cocktails",
    "Dancing",
    "Happy hour drinks",
    "Great beer selection",
    "Great wine list",
    "Rooftop seating",
    "Outdoor seating",
    "Sports",
    "LGBTQ+ friendly",
  ];
  for (const p of priority) {
    if (am.includes(p) && !out.includes(p)) out.push(p);
    if (out.length >= 4) break;
  }
  // Fall back to subtypes if amenity data is sparse (common for newer listings).
  if (out.length < 3) {
    for (const s of l.subtypes ?? []) {
      if (s.toLowerCase() === (l.type ?? "").toLowerCase()) continue;
      if (!out.includes(s)) out.push(s);
      if (out.length >= 3) break;
    }
  }
  if (out.length === 0) out.push(l.type ?? "Karaoke");
  return out;
}

function bestForText(l: Listing): string {
  const s = new Set(l.serviceSlugs);
  if (s.has("private-karaoke-rooms")) {
    return "Groups, birthdays, and celebrations — anyone who would rather sing in a private room than in front of a whole bar.";
  }
  if (s.has("sports-bar")) {
    return "Game-day crowds and casual group nights that mix sports, drinks, and singing.";
  }
  if (isRestaurantish(l)) {
    return "Dinner-and-karaoke outings and mixed-age groups who want food and a mic in one place.";
  }
  if (s.has("night-club")) {
    return "Late-night singers who want a high-energy, club-style crowd.";
  }
  if (s.has("lounge") || s.has("cocktail-bar")) {
    return "A relaxed, drinks-forward night out with a smaller group.";
  }
  return "A casual night out singing with friends without a lot of fuss.";
}

function keepInMindText(l: Listing): string {
  const bits: string[] = [];
  if (l.priceRange === "$$$" || l.priceRange === "$$$$") {
    bits.push(`it sits toward the higher end (${l.priceRange}) on price`);
  }
  if (l.serviceSlugs.includes("private-karaoke-rooms")) {
    bits.push("private rooms are booked by the hour and can fill up on weekends, so reserve ahead");
  }
  if ((l.hours ?? []).length === 0) {
    bits.push("we don't list its karaoke schedule yet, so call ahead to confirm the night before you go");
  }
  if (bits.length === 0) {
    return "Karaoke nights and hosts can change from season to season, so it's worth confirming the schedule with the venue before you head out.";
  }
  const joined = bits.length === 1 ? bits[0] : bits.slice(0, -1).join(", ") + ", and " + bits[bits.length - 1];
  return `A couple of things to plan around: ${joined}.`;
}

function worthKnowingText(l: Listing): string {
  const bits: string[] = [];
  if (l.verified) bits.push("the business is verified on Google");
  if (l.rating != null && l.reviews != null) {
    bits.push(`it holds a ${l.rating.toFixed(1)}-star rating from ${l.reviews.toLocaleString()} Google reviews`);
  }
  if (l.serviceSlugs.includes("karaoke-bar") && l.serviceSlugs.includes("private-karaoke-rooms")) {
    bits.push("it offers both open-mic karaoke and private rooms");
  }
  if (l.website) bits.push("it has its own website where you can check current hours and events");
  if (bits.length === 0) {
    return `It's listed as a ${(l.type ?? "karaoke venue").toLowerCase()} in ${l.city}, ${l.stateCode ?? l.state}. We're still gathering details like hours and reviews for this spot.`;
  }
  const joined = bits.length === 1 ? bits[0] : bits.slice(0, -1).join("; ") + "; and " + bits[bits.length - 1];
  return `${joined[0].toUpperCase()}${joined.slice(1)}.`;
}

function scores(l: Listing): { atmosphere: number | null; food: number | null } {
  if (l.rating == null) return { atmosphere: null, food: null };
  const atmoSignals = countSignals(l, ATMOSPHERE_SIGNALS);
  const atmosphere = round1(clamp(0.6 * l.rating + 0.4 * (Math.min(atmoSignals, 5) / 5) * 5, 1, 5));

  const foodSignals = countSignals(l, FOOD_SIGNALS);
  const hasFood = foodSignals > 0 || isRestaurantish(l);
  const food = hasFood
    ? round1(clamp(0.7 * l.rating + 0.3 * (Math.min(foodSignals, 4) / 4) * 5, 1, 5))
    : null;
  return { atmosphere, food };
}

function buildFaqs(l: Listing): PartnerFaq[] {
  const faqs: PartnerFaq[] = [];
  const type = (l.type ?? "karaoke venue").toLowerCase();

  faqs.push({
    q: `Does ${l.name} have karaoke?`,
    a: `Yes. ${l.name} is a ${type} in ${l.city}, ${l.stateCode ?? l.state} that offers karaoke. Karaoke nights can vary, so confirm the current schedule with the venue before visiting.`,
  });

  faqs.push({
    q: `Where is ${l.name} located?`,
    a: l.address
      ? `${l.name} is at ${l.address}. You'll find directions and a map on this page.`
      : `${l.name} is in ${l.city}, ${l.stateCode ?? l.state}. Use the map on this page for directions.`,
  });

  faqs.push({
    q: `Does ${l.name} have private karaoke rooms?`,
    a: l.serviceSlugs.includes("private-karaoke-rooms")
      ? `Yes — ${l.name} offers private karaoke rooms you can rent for your group. These are usually booked by the hour, so it's best to reserve ahead.`
      : `Our directory lists ${l.name} as offering ${l.serviceSlugs.includes("karaoke-bar") ? "open-mic, shared-stage karaoke" : "karaoke"} rather than private rooms. If you specifically want a private room, call to confirm.`,
  });

  const hasFood = countSignals(l, FOOD_SIGNALS) > 0 || isRestaurantish(l);
  faqs.push({
    q: `Can you get food at ${l.name}?`,
    a: hasFood
      ? `${l.name} lists food or dining options alongside karaoke, so you can eat while you're there. Menus change, so check with the venue for current offerings.`
      : `${l.name} is listed primarily as a ${type} rather than a food-focused spot. If a meal matters for your night, call ahead to see what's available.`,
  });

  if (l.rating != null && l.reviews != null) {
    faqs.push({
      q: `How is ${l.name} rated?`,
      a: `${l.name} holds a ${l.rating.toFixed(1)}-star rating from ${l.reviews.toLocaleString()} Google reviews, which we factor into the scores above.`,
    });
  }

  return faqs;
}

export function buildPartnerContent(l: Listing): PartnerContent {
  const { atmosphere, food } = scores(l);
  return {
    specialty: specialtyFor(l),
    knownFor: knownForList(l),
    bestFor: bestForText(l),
    keepInMind: keepInMindText(l),
    worthKnowing: worthKnowingText(l),
    atmosphereScore: atmosphere,
    foodScore: food,
    scoreBasis:
      "Our scores blend this venue's Google rating with the specific features it lists — things like live music, cocktails, and dancing for atmosphere, or dine-in and menu options for food — on a 5-point scale. They're a directory estimate to help you compare spots at a glance, not an independent, in-person review.",
    faqs: buildFaqs(l),
  };
}
