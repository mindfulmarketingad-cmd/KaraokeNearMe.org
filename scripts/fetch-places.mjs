/**
 * fetch-places.mjs
 *
 * Fetches karaoke venues from Google Places API (v1) and merges them into lib/listings.json.
 *
 * Usage:
 *   PLACES_API_KEY=AIza... node scripts/fetch-places.mjs
 *   PLACES_API_KEY=AIza... node scripts/fetch-places.mjs --states california,texas
 *   PLACES_API_KEY=AIza... node scripts/fetch-places.mjs --cities "Los Angeles,CA" "Houston,TX"
 *   PLACES_API_KEY=AIza... node scripts/fetch-places.mjs --limit 10   # results per city
 *   PLACES_API_KEY=AIza... node scripts/fetch-places.mjs --dry-run    # print without saving
 *
 * Cost estimate (Google Places API):
 *   Text Search:   ~$32 per 1000 calls  (1 call per city)
 *   Place Details: ~$17 per 1000 calls  (1 call per result)
 *   50 cities × 10 results = 50 + 500 = 550 calls ≈ $9
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { argv } from "process";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const LISTINGS_PATH = join(ROOT, "lib", "listings.json");

const API_KEY = process.env.PLACES_API_KEY;
if (!API_KEY) {
  console.error("Error: PLACES_API_KEY environment variable is required.");
  process.exit(1);
}

// ---------- CLI args ----------
const args = argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT = parseInt(args[args.indexOf("--limit") + 1] ?? "10", 10) || 10;

// --states flag: comma-separated state slugs
const statesArg = args.includes("--states")
  ? args[args.indexOf("--states") + 1].split(",").map((s) => s.trim())
  : null;

// --cities flag: "City,ST" pairs after the flag until next --flag
const citiesArg = (() => {
  const idx = args.indexOf("--cities");
  if (idx === -1) return null;
  const pairs = [];
  for (let i = idx + 1; i < args.length && !args[i].startsWith("--"); i++) {
    pairs.push(args[i]);
  }
  return pairs;
})();

// ---------- Target cities ----------
// Default: major karaoke markets across all 50 states
const DEFAULT_CITIES = [
  // Northeast
  { city: "New York", state: "New York", stateSlug: "new-york", stateCode: "NY" },
  { city: "Buffalo", state: "New York", stateSlug: "new-york", stateCode: "NY" },
  { city: "Philadelphia", state: "Pennsylvania", stateSlug: "pennsylvania", stateCode: "PA" },
  { city: "Pittsburgh", state: "Pennsylvania", stateSlug: "pennsylvania", stateCode: "PA" },
  { city: "Boston", state: "Massachusetts", stateSlug: "massachusetts", stateCode: "MA" },
  { city: "Providence", state: "Rhode Island", stateSlug: "rhode-island", stateCode: "RI" },
  { city: "Hartford", state: "Connecticut", stateSlug: "connecticut", stateCode: "CT" },
  { city: "Newark", state: "New Jersey", stateSlug: "new-jersey", stateCode: "NJ" },
  // Southeast
  { city: "Atlanta", state: "Georgia", stateSlug: "georgia", stateCode: "GA" },
  { city: "Charlotte", state: "North Carolina", stateSlug: "north-carolina", stateCode: "NC" },
  { city: "Raleigh", state: "North Carolina", stateSlug: "north-carolina", stateCode: "NC" },
  { city: "Nashville", state: "Tennessee", stateSlug: "tennessee", stateCode: "TN" },
  { city: "Memphis", state: "Tennessee", stateSlug: "tennessee", stateCode: "TN" },
  { city: "Miami", state: "Florida", stateSlug: "florida", stateCode: "FL" },
  { city: "Orlando", state: "Florida", stateSlug: "florida", stateCode: "FL" },
  { city: "Tampa", state: "Florida", stateSlug: "florida", stateCode: "FL" },
  { city: "Jacksonville", state: "Florida", stateSlug: "florida", stateCode: "FL" },
  { city: "Richmond", state: "Virginia", stateSlug: "virginia", stateCode: "VA" },
  { city: "Virginia Beach", state: "Virginia", stateSlug: "virginia", stateCode: "VA" },
  { city: "Baltimore", state: "Maryland", stateSlug: "maryland", stateCode: "MD" },
  { city: "Columbia", state: "South Carolina", stateSlug: "south-carolina", stateCode: "SC" },
  { city: "Charleston", state: "South Carolina", stateSlug: "south-carolina", stateCode: "SC" },
  { city: "New Orleans", state: "Louisiana", stateSlug: "louisiana", stateCode: "LA" },
  { city: "Baton Rouge", state: "Louisiana", stateSlug: "louisiana", stateCode: "LA" },
  { city: "Birmingham", state: "Alabama", stateSlug: "alabama", stateCode: "AL" },
  { city: "Huntsville", state: "Alabama", stateSlug: "alabama", stateCode: "AL" },
  { city: "Jackson", state: "Mississippi", stateSlug: "mississippi", stateCode: "MS" },
  { city: "Louisville", state: "Kentucky", stateSlug: "kentucky", stateCode: "KY" },
  { city: "Lexington", state: "Kentucky", stateSlug: "kentucky", stateCode: "KY" },
  { city: "Charleston", state: "West Virginia", stateSlug: "west-virginia", stateCode: "WV" },
  // Midwest
  { city: "Chicago", state: "Illinois", stateSlug: "illinois", stateCode: "IL" },
  { city: "Naperville", state: "Illinois", stateSlug: "illinois", stateCode: "IL" },
  { city: "Detroit", state: "Michigan", stateSlug: "michigan", stateCode: "MI" },
  { city: "Grand Rapids", state: "Michigan", stateSlug: "michigan", stateCode: "MI" },
  { city: "Columbus", state: "Ohio", stateSlug: "ohio", stateCode: "OH" },
  { city: "Cleveland", state: "Ohio", stateSlug: "ohio", stateCode: "OH" },
  { city: "Cincinnati", state: "Ohio", stateSlug: "ohio", stateCode: "OH" },
  { city: "Indianapolis", state: "Indiana", stateSlug: "indiana", stateCode: "IN" },
  { city: "Milwaukee", state: "Wisconsin", stateSlug: "wisconsin", stateCode: "WI" },
  { city: "Madison", state: "Wisconsin", stateSlug: "wisconsin", stateCode: "WI" },
  { city: "Minneapolis", state: "Minnesota", stateSlug: "minnesota", stateCode: "MN" },
  { city: "Saint Paul", state: "Minnesota", stateSlug: "minnesota", stateCode: "MN" },
  { city: "Kansas City", state: "Missouri", stateSlug: "missouri", stateCode: "MO" },
  { city: "St. Louis", state: "Missouri", stateSlug: "missouri", stateCode: "MO" },
  { city: "Omaha", state: "Nebraska", stateSlug: "nebraska", stateCode: "NE" },
  { city: "Des Moines", state: "Iowa", stateSlug: "iowa", stateCode: "IA" },
  { city: "Fargo", state: "North Dakota", stateSlug: "north-dakota", stateCode: "ND" },
  { city: "Sioux Falls", state: "South Dakota", stateSlug: "south-dakota", stateCode: "SD" },
  // South / Central
  { city: "Houston", state: "Texas", stateSlug: "texas", stateCode: "TX" },
  { city: "Dallas", state: "Texas", stateSlug: "texas", stateCode: "TX" },
  { city: "San Antonio", state: "Texas", stateSlug: "texas", stateCode: "TX" },
  { city: "Austin", state: "Texas", stateSlug: "texas", stateCode: "TX" },
  { city: "Fort Worth", state: "Texas", stateSlug: "texas", stateCode: "TX" },
  { city: "El Paso", state: "Texas", stateSlug: "texas", stateCode: "TX" },
  { city: "Oklahoma City", state: "Oklahoma", stateSlug: "oklahoma", stateCode: "OK" },
  { city: "Tulsa", state: "Oklahoma", stateSlug: "oklahoma", stateCode: "OK" },
  { city: "Little Rock", state: "Arkansas", stateSlug: "arkansas", stateCode: "AR" },
  { city: "Albuquerque", state: "New Mexico", stateSlug: "new-mexico", stateCode: "NM" },
  { city: "Denver", state: "Colorado", stateSlug: "colorado", stateCode: "CO" },
  { city: "Colorado Springs", state: "Colorado", stateSlug: "colorado", stateCode: "CO" },
  { city: "Phoenix", state: "Arizona", stateSlug: "arizona", stateCode: "AZ" },
  { city: "Tucson", state: "Arizona", stateSlug: "arizona", stateCode: "AZ" },
  { city: "Las Vegas", state: "Nevada", stateSlug: "nevada", stateCode: "NV" },
  { city: "Reno", state: "Nevada", stateSlug: "nevada", stateCode: "NV" },
  // West
  { city: "Los Angeles", state: "California", stateSlug: "california", stateCode: "CA" },
  { city: "San Francisco", state: "California", stateSlug: "california", stateCode: "CA" },
  { city: "San Diego", state: "California", stateSlug: "california", stateCode: "CA" },
  { city: "San Jose", state: "California", stateSlug: "california", stateCode: "CA" },
  { city: "Sacramento", state: "California", stateSlug: "california", stateCode: "CA" },
  { city: "Fresno", state: "California", stateSlug: "california", stateCode: "CA" },
  { city: "Irvine", state: "California", stateSlug: "california", stateCode: "CA" },
  { city: "Seattle", state: "Washington", stateSlug: "washington", stateCode: "WA" },
  { city: "Spokane", state: "Washington", stateSlug: "washington", stateCode: "WA" },
  { city: "Portland", state: "Oregon", stateSlug: "oregon", stateCode: "OR" },
  { city: "Eugene", state: "Oregon", stateSlug: "oregon", stateCode: "OR" },
  { city: "Boise", state: "Idaho", stateSlug: "idaho", stateCode: "ID" },
  { city: "Salt Lake City", state: "Utah", stateSlug: "utah", stateCode: "UT" },
  { city: "Provo", state: "Utah", stateSlug: "utah", stateCode: "UT" },
  { city: "Billings", state: "Montana", stateSlug: "montana", stateCode: "MT" },
  { city: "Cheyenne", state: "Wyoming", stateSlug: "wyoming", stateCode: "WY" },
  { city: "Anchorage", state: "Alaska", stateSlug: "alaska", stateCode: "AK" },
  { city: "Honolulu", state: "Hawaii", stateSlug: "hawaii", stateCode: "HI" },
  // Washington DC area
  { city: "Washington", state: "District of Columbia", stateSlug: "district-of-columbia", stateCode: "DC" },
  { city: "Arlington", state: "Virginia", stateSlug: "virginia", stateCode: "VA" },
  { city: "Annandale", state: "Virginia", stateSlug: "virginia", stateCode: "VA" },
  // Korean karaoke hotspots
  { city: "Flushing", state: "New York", stateSlug: "new-york", stateCode: "NY" },
  { city: "Fort Lee", state: "New Jersey", stateSlug: "new-jersey", stateCode: "NJ" },
  { city: "Duluth", state: "Georgia", stateSlug: "georgia", stateCode: "GA" },
  { city: "Doraville", state: "Georgia", stateSlug: "georgia", stateCode: "GA" },
  { city: "Lynnwood", state: "Washington", stateSlug: "washington", stateCode: "WA" },
  { city: "Niles", state: "Illinois", stateSlug: "illinois", stateCode: "IL" },
];

// Build target list from flags
function buildTargets() {
  if (citiesArg) {
    return citiesArg.map((pair) => {
      const [city, code] = pair.split(",").map((s) => s.trim());
      const found = DEFAULT_CITIES.find(
        (c) => c.stateCode === code || c.stateSlug === code?.toLowerCase()
      );
      return {
        city,
        state: found?.state ?? code,
        stateSlug: found?.stateSlug ?? code?.toLowerCase().replace(/\s+/g, "-"),
        stateCode: found?.stateCode ?? code,
      };
    });
  }
  if (statesArg) {
    return DEFAULT_CITIES.filter((c) => statesArg.includes(c.stateSlug));
  }
  return DEFAULT_CITIES;
}

// ---------- Slug helpers ----------
function cityToSlug(city) {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function nameToSlug(name, existing) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!existing.has(base)) return base;
  let n = 2;
  while (existing.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

// ---------- Type mapping from Google place types ----------
const TYPE_MAP = {
  karaoke: { type: "Karaoke bar", serviceSlug: "karaoke-bar", serviceLabel: "Karaoke Bars" },
  night_club: { type: "Night club", serviceSlug: "night-club", serviceLabel: "Night Clubs" },
  bar: { type: "Bar", serviceSlug: "bar", serviceLabel: "Bars" },
  restaurant: { type: "Restaurant", serviceSlug: "restaurant", serviceLabel: "Restaurants" },
  food: { type: "Restaurant", serviceSlug: "restaurant", serviceLabel: "Restaurants" },
};

const PRICE_MAP = {
  PRICE_LEVEL_FREE: null,
  PRICE_LEVEL_INEXPENSIVE: "$",
  PRICE_LEVEL_MODERATE: "$$",
  PRICE_LEVEL_EXPENSIVE: "$$$",
  PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
};

// ---------- Google Places API helpers ----------
const BASE = "https://places.googleapis.com/v1";

async function textSearch(query, maxResults = LIMIT) {
  const res = await fetch(`${BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.types",
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: Math.min(maxResults, 20) }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Text search failed (${res.status}): ${err}`);
  }
  const data = await res.json();
  return (data.places ?? []).filter((p) =>
    p.types?.some((t) => ["karaoke", "night_club", "bar", "restaurant", "entertainment", "lodging"].includes(t))
  );
}

async function placeDetails(placeId) {
  const fields = [
    "id", "displayName", "formattedAddress", "location",
    "rating", "userRatingCount", "nationalPhoneNumber", "internationalPhoneNumber",
    "websiteUri", "regularOpeningHours", "types", "priceLevel",
    "editorialSummary", "addressComponents", "businessStatus", "shortFormattedAddress",
  ].join(",");
  const res = await fetch(`${BASE}/places/${placeId}?fields=${fields}`, {
    headers: { "X-Goog-Api-Key": API_KEY },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Place details failed for ${placeId} (${res.status}): ${err}`);
  }
  return res.json();
}

// ---------- Convert Place Details → Listing ----------
function placeToListing(place, cityHint, existingSlugs) {
  const name = place.displayName?.text ?? "Unknown";
  const slug = nameToSlug(name, existingSlugs);
  existingSlugs.add(slug);

  // Address components
  let city = cityHint.city;
  let stateCode = cityHint.stateCode;
  let postalCode = null;
  for (const comp of place.addressComponents ?? []) {
    if (comp.types.includes("locality")) city = comp.longText;
    if (comp.types.includes("administrative_area_level_1")) stateCode = comp.shortText;
    if (comp.types.includes("postal_code")) postalCode = comp.longText;
  }
  const citySlug = cityToSlug(city);

  // Types → services
  const placeTypes = place.types ?? [];
  const services = [];
  const serviceLabels = {};
  let primaryType = "Karaoke venue";

  // Always add karaoke-bar if karaoke-related search
  const hasKaraoke = placeTypes.some((t) => t === "karaoke" || name.toLowerCase().includes("karaoke") || name.toLowerCase().includes("ktv") || name.toLowerCase().includes("norebang"));
  if (hasKaraoke) {
    services.push("karaoke-bar");
    serviceLabels["karaoke-bar"] = "Karaoke Bars";
    primaryType = "Karaoke bar";
  }

  // KTV / private rooms
  if (name.toLowerCase().includes("ktv") || name.toLowerCase().includes("norebang") || name.toLowerCase().includes("private")) {
    if (!services.includes("private-karaoke-rooms")) {
      services.push("private-karaoke-rooms");
      serviceLabels["private-karaoke-rooms"] = "Private Karaoke Rooms";
    }
    primaryType = "KTV lounge";
  }

  for (const t of placeTypes) {
    const mapped = TYPE_MAP[t];
    if (mapped && !services.includes(mapped.serviceSlug)) {
      services.push(mapped.serviceSlug);
      serviceLabels[mapped.serviceSlug] = mapped.serviceLabel;
      if (t === "bar" && !hasKaraoke) primaryType = "Bar";
      if (t === "night_club" && !hasKaraoke) primaryType = "Night club";
      if (t === "restaurant" && services.length === 1) primaryType = "Restaurant";
    }
  }

  if (services.length === 0) {
    services.push("karaoke-bar");
    serviceLabels["karaoke-bar"] = "Karaoke Bars";
  }

  const servicesOffered = services.map((slug) => ({
    label: serviceLabels[slug]?.replace(/s$/, "") ?? slug,
    slug,
  }));

  // Subtypes from Google types (human-readable)
  const subtypes = placeTypes
    .map((t) => t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
    .filter((t) => !["Establishment", "Point Of Interest", "Food", "Premise"].includes(t))
    .slice(0, 5);

  // Hours
  const hours = [];
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  if (place.regularOpeningHours?.periods) {
    const periodsByDay = {};
    for (const period of place.regularOpeningHours.periods) {
      const day = period.open?.day ?? 0;
      periodsByDay[day] = period;
    }
    for (let i = 0; i < 7; i++) {
      const period = periodsByDay[i];
      if (!period) {
        hours.push({ day: weekdays[i], label: "Closed", closed: true });
      } else {
        const fmt = (t) => {
          if (!t) return "";
          const h = t.hour ?? 0, m = t.minute ?? 0;
          const suffix = h < 12 ? "AM" : "PM";
          const hour12 = h % 12 || 12;
          return m ? `${hour12}:${String(m).padStart(2, "0")}${suffix}` : `${hour12}${suffix}`;
        };
        const open = fmt(period.open);
        const close = fmt(period.close);
        hours.push({
          day: weekdays[i],
          label: open && close ? `${open}–${close}` : open || "Open",
          closed: false,
        });
      }
    }
  }

  // Rating
  const rating = place.rating ? Math.round(place.rating * 10) / 10 : null;
  const reviews = place.userRatingCount ?? null;

  // About text
  const description = place.editorialSummary?.text ?? null;
  const ratingLine = rating ? `${rating}-star rating from ${reviews?.toLocaleString() ?? "multiple"} Google reviews` : "";
  const about = [
    `${name} is a ${primaryType.toLowerCase()} in ${city}, ${cityHint.state}.`,
    ratingLine ? `It holds a ${ratingLine}.` : "",
    description ?? "",
    `Find current hours, directions, and more on KaraokeNearMe.org.`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    slug,
    name,
    city,
    citySlug,
    state: cityHint.state,
    stateCode,
    stateSlug: cityHint.stateSlug,
    postalCode,
    address: place.formattedAddress ?? null,
    lat: place.location?.latitude ?? null,
    lng: place.location?.longitude ?? null,
    rating,
    reviews,
    verified: true,
    priceRange: PRICE_MAP[place.priceLevel] ?? null,
    type: primaryType,
    subtypes,
    serviceSlugs: services,
    serviceLabels,
    servicesOffered,
    amenities: [],
    description,
    phone: place.nationalPhoneNumber ?? place.internationalPhoneNumber ?? null,
    website: place.websiteUri ?? null,
    hours,
    cid: null,
    placeId: place.id ?? null,
    about,
  };
}

// ---------- Rate limit helper ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Main ----------
async function main() {
  const targets = buildTargets();
  console.log(`\nTargeting ${targets.length} cities | limit ${LIMIT} results each | dry-run: ${DRY_RUN}\n`);

  const existing = JSON.parse(readFileSync(LISTINGS_PATH, "utf8"));
  const existingPlaceIds = new Set(existing.map((l) => l.placeId).filter(Boolean));
  const existingSlugs = new Set(existing.map((l) => l.slug));

  const newListings = [];
  let searchCalls = 0, detailCalls = 0, skipped = 0;

  for (const target of targets) {
    const query = `karaoke near ${target.city}, ${target.stateCode}`;
    console.log(`Searching: "${query}"`);

    let places;
    try {
      places = await textSearch(query);
      searchCalls++;
    } catch (e) {
      console.error(`  ✗ Search failed: ${e.message}`);
      await sleep(2000);
      continue;
    }

    console.log(`  Found ${places.length} results`);

    for (const place of places) {
      if (existingPlaceIds.has(place.id)) {
        skipped++;
        continue;
      }

      let details;
      try {
        details = await placeDetails(place.id);
        detailCalls++;
        await sleep(120); // ~8 req/s, well within quota
      } catch (e) {
        console.error(`  ✗ Details failed for ${place.id}: ${e.message}`);
        continue;
      }

      if (details.businessStatus === "CLOSED_PERMANENTLY") continue;

      const listing = placeToListing(details, target, existingSlugs);
      newListings.push(listing);
      existingPlaceIds.add(place.id);
      console.log(`  + ${listing.name} (${listing.city}, ${listing.stateCode}) [${listing.placeId}]`);
    }

    await sleep(300); // between cities
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`API calls — search: ${searchCalls}, details: ${detailCalls}`);
  console.log(`Skipped (already in DB): ${skipped}`);
  console.log(`New listings: ${newListings.length}`);
  console.log(`Total after merge: ${existing.length + newListings.length}`);

  if (newListings.length === 0) {
    console.log("Nothing new to save.");
    return;
  }

  if (DRY_RUN) {
    console.log("\n[DRY RUN] Sample of new listings:");
    newListings.slice(0, 3).forEach((l) =>
      console.log(`  ${l.name} | ${l.city}, ${l.stateCode} | ⭐ ${l.rating ?? "—"} (${l.reviews ?? 0}) | ${l.placeId}`)
    );
    return;
  }

  const merged = [...existing, ...newListings];
  writeFileSync(LISTINGS_PATH, JSON.stringify(merged, null, 2));
  console.log(`\n✓ Saved ${merged.length} listings to lib/listings.json`);
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
