/**
 * fetch-photos-reviews.mjs
 *
 * For every listing in lib/listings.json that has a placeId:
 *  - Fetches 1 photo reference + up to 5 Google reviews via Place Details
 *  - Resolves the photo reference to a real CDN image URL
 *  - Writes photoUrl and googleReviews back to the listing
 *
 * Usage:
 *   PLACES_API_KEY=AIza... node scripts/fetch-photos-reviews.mjs
 *   PLACES_API_KEY=AIza... node scripts/fetch-photos-reviews.mjs --limit 50   # first N listings
 *   PLACES_API_KEY=AIza... node scripts/fetch-photos-reviews.mjs --dry-run
 *
 * Cost (approx):
 *   Place Details (photos + reviews fields) = $17/1000 → 910 listings ≈ $15
 *   Photo media resolve                     = $7/1000  → 910 listings ≈ $6
 *   Total ≈ $21
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

const BASE = "https://places.googleapis.com/v1";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchDetailsWithMedia(placeId) {
  const fields = "photos,reviews";
  const res = await fetch(`${BASE}/places/${placeId}?fields=${fields}`, {
    headers: { "X-Goog-Api-Key": API_KEY },
  });
  if (!res.ok) throw new Error(`Details ${placeId} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function resolvePhotoUrl(photoName) {
  const url = `${BASE}/${photoName}/media?maxWidthPx=900&skipHttpRedirect=true`;
  const res = await fetch(url, { headers: { "X-Goog-Api-Key": API_KEY } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.photoUri ?? null;
}

async function main() {
  const listings = JSON.parse(readFileSync(LISTINGS_PATH, "utf8"));
  const targets = listings
    .filter((l) => l.placeId && !l.photoUrl)
    .slice(0, LIMIT);

  console.log(`\n${listings.length} total listings | ${targets.length} to process | dry-run: ${DRY_RUN}\n`);

  let done = 0, photoCount = 0, reviewCount = 0, errors = 0;

  for (const listing of targets) {
    try {
      const data = await fetchDetailsWithMedia(listing.placeId);

      // ── Photo ──────────────────────────────────────────────────────────────
      const photos = data.photos ?? [];
      if (photos.length > 0) {
        const photoUrl = await resolvePhotoUrl(photos[0].name);
        if (photoUrl) {
          listing.photoUrl = photoUrl;
          photoCount++;
        } else {
          listing.photoUrl = null;
        }
        await sleep(80);
      } else {
        listing.photoUrl = null;
      }

      // ── Reviews ────────────────────────────────────────────────────────────
      const rawReviews = data.reviews ?? [];
      listing.googleReviews = rawReviews
        .filter((r) => r.text?.text && r.rating)
        .map((r) => ({
          author: r.authorAttribution?.displayName ?? "Google user",
          rating: r.rating,
          text: r.text.text,
          time: r.relativePublishTimeDescription ?? "",
          avatarUrl: r.authorAttribution?.photoUri ?? null,
        }));
      reviewCount += listing.googleReviews.length;

      done++;
      if (done % 50 === 0 || done <= 3) {
        console.log(
          `[${done}/${targets.length}] ${listing.name} — photo: ${listing.photoUrl ? "✓" : "✗"}, reviews: ${listing.googleReviews.length}`
        );
      }

      await sleep(150); // ~6 req/s
    } catch (e) {
      console.error(`  ✗ ${listing.name}: ${e.message}`);
      listing.photoUrl = null;
      listing.googleReviews = [];
      errors++;
      await sleep(500);
    }
  }

  console.log(`\n────────────────────────────────`);
  console.log(`Processed: ${done} | Photos: ${photoCount} | Reviews: ${reviewCount} | Errors: ${errors}`);

  if (DRY_RUN) { console.log("[DRY RUN] Not saving."); return; }

  writeFileSync(LISTINGS_PATH, JSON.stringify(listings, null, 2));
  console.log(`\n✓ Saved to lib/listings.json`);
}

main().catch((e) => { console.error("Fatal:", e.message); process.exit(1); });
