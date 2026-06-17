/**
 * fetch-venue-attributes.mjs
 *
 * Fetches karaoke-audience-relevant attributes for all listings:
 *   servesBeer, servesWine, servesCocktails, servesCoffee,
 *   reservable, goodForGroups, goodForChildren, liveMusic,
 *   outdoorSeating, parkingOptions, paymentOptions, accessibilityOptions,
 *   allowsDogs, primaryTypeDisplayName
 *
 * Usage:
 *   PLACES_API_KEY=AIza... node scripts/fetch-venue-attributes.mjs
 *   PLACES_API_KEY=AIza... node scripts/fetch-venue-attributes.mjs --limit 50
 *   PLACES_API_KEY=AIza... node scripts/fetch-venue-attributes.mjs --dry-run
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const LISTINGS_PATH = join(__dir, "..", "lib", "listings.json");

const API_KEY = process.env.PLACES_API_KEY;
if (!API_KEY) { console.error("PLACES_API_KEY required"); process.exit(1); }

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT_IDX = args.indexOf("--limit");
const LIMIT = LIMIT_IDX !== -1 ? parseInt(args[LIMIT_IDX + 1], 10) : Infinity;

const FIELDS = [
  "servesBeer", "servesWine", "servesCocktails", "servesCoffee",
  "reservable", "goodForGroups", "goodForChildren", "liveMusic",
  "outdoorSeating", "parkingOptions", "paymentOptions",
  "accessibilityOptions", "allowsDogs", "primaryTypeDisplayName",
].join(",");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAttributes(placeId) {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}?fields=${FIELDS}`,
    { headers: { "X-Goog-Api-Key": API_KEY } }
  );
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json();
}

async function main() {
  const listings = JSON.parse(readFileSync(LISTINGS_PATH, "utf8"));
  const targets = listings.filter((l) => l.placeId && !l.attributes).slice(0, LIMIT);

  console.log(`\n${listings.length} total | ${targets.length} to enrich | dry-run: ${DRY_RUN}\n`);

  let done = 0, errors = 0;

  for (const l of targets) {
    try {
      const d = await fetchAttributes(l.placeId);

      l.attributes = {
        servesBeer:      d.servesBeer      ?? null,
        servesWine:      d.servesWine      ?? null,
        servesCocktails: d.servesCocktails ?? null,
        servesCoffee:    d.servesCoffee    ?? null,
        reservable:      d.reservable      ?? null,
        goodForGroups:   d.goodForGroups   ?? null,
        goodForChildren: d.goodForChildren ?? null,
        liveMusic:       d.liveMusic       ?? null,
        outdoorSeating:  d.outdoorSeating  ?? null,
        allowsDogs:      d.allowsDogs      ?? null,
        // Flatten nested objects
        acceptsCreditCards: d.paymentOptions?.acceptsCreditCards  ?? null,
        acceptsCashOnly:    d.paymentOptions?.acceptsCashOnly     ?? null,
        wheelchairAccessible: d.accessibilityOptions?.wheelchairAccessibleEntrance
                           ?? d.accessibilityOptions?.wheelchairAccessibleParking
                           ?? null,
        freeParking: d.parkingOptions?.freeStreetParking
                  || d.parkingOptions?.freeParkingLot
                  || null,
        paidParking: d.parkingOptions?.paidStreetParking
                  || d.parkingOptions?.paidParkingLot
                  || d.parkingOptions?.valetParking
                  || null,
        primaryTypeLabel: d.primaryTypeDisplayName?.text ?? null,
      };

      done++;
      if (done % 100 === 0 || done <= 3) {
        const a = l.attributes;
        console.log(`[${done}/${targets.length}] ${l.name} — groups:${a.goodForGroups} reservable:${a.reservable} beer:${a.servesBeer} cocktails:${a.servesCocktails}`);
      }

      await sleep(120);
    } catch (e) {
      console.error(`  ✗ ${l.name}: ${e.message}`);
      l.attributes = {};
      errors++;
      await sleep(500);
    }
  }

  console.log(`\n────────────────────────────────`);
  console.log(`Done: ${done} | Errors: ${errors}`);

  if (DRY_RUN) { console.log("[DRY RUN] Not saving."); return; }

  writeFileSync(LISTINGS_PATH, JSON.stringify(listings, null, 2));
  console.log(`✓ Saved ${listings.length} listings`);
}

main().catch((e) => { console.error("Fatal:", e.message); process.exit(1); });
