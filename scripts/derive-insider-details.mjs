/**
 * derive-insider-details.mjs
 *
 * Generates "insider details" for every listing — experiential facts you can't
 * get from Google Maps. Each listing gets an `insiderDetails` object:
 *
 *   micVolume      — how loud / how the sound is set up
 *   spaceSize      — physical footprint & layout
 *   ambiance       — the vibe / decor / energy
 *   crowdAge       — typical age range of the crowd
 *   busyHours      — when it's packed vs. quiet
 *   groupSinging   — { value: bool, note } open-mic vs. private
 *   privateRooms   — { value: bool, note } are private rooms available
 *   korean         — { value: bool, note } Korean-style / noraebang
 *
 * All fields are DERIVED from existing signals (type, subtypes, name,
 * amenities, description, hours, price, and mined review text). They are
 * heuristic estimates, phrased as guidance rather than guarantees.
 *
 * Usage:
 *   node scripts/derive-insider-details.mjs
 *   node scripts/derive-insider-details.mjs --dry-run
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const LISTINGS_PATH = join(__dir, "..", "lib", "listings.json");
const DRY_RUN = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const norm = (s) => (s || "").toLowerCase();

function buildHaystack(l) {
  const parts = [
    l.name,
    l.type,
    (l.subtypes || []).join(" "),
    (l.amenities || []).join(" "),
    l.description,
    (l.googleReviews || []).map((r) => r.text).join(" "),
  ];
  return norm(parts.join(" "));
}

const any = (hay, ...words) => words.some((w) => hay.includes(w));

// ---------------------------------------------------------------------------
// Field derivations
// ---------------------------------------------------------------------------

function deriveKorean(l, hay) {
  // Strong signals: explicit Korean / noraebang / soju-room language
  const strong = any(
    hay,
    "korean", "noraebang", "norae bang", "k-pop", "kpop",
    "soju room", "soju", "banchan", "korean bbq", "k-bbq",
    "arirang", "gangnam", "seoul"
  );
  // Brand / name hints common to Korean-style room karaoke
  const brandHint = /\b(ktv|sing sing|wow karaoke|insa|hodori|koreana|seoul|gangnam)\b/i.test(
    l.name
  );
  const value = strong || (brandHint && any(hay, "private room", "ktv"));
  return {
    value,
    note: value
      ? "Korean-style room karaoke (noraebang) — expect private rooms, deep K-pop and English song books, and often soju or Korean snacks."
      : "Western-style karaoke; song list is mostly English-language pop, rock, and country.",
  };
}

function derivePrivateRooms(l, hay, korean) {
  const isKtv = /ktv|karaoke room/i.test(l.type) || (l.subtypes || []).some((s) => /ktv|karaoke room/i.test(s));
  const value =
    isKtv ||
    korean.value ||
    any(hay, "private room", "private karaoke", "private suite", "by the hour", "book a room", "rent a room", "rooms available", "ktv");
  return {
    value,
    note: value
      ? "Private rooms available — reserve an enclosed space by the hour for just your group."
      : "Open-floor venue — singing happens on a shared stage, not in private rooms.",
  };
}

function deriveGroupSinging(l, hay, privateRooms) {
  // Bar/open-mic = group sing-along on a shared list; rooms = your own group only.
  const openMic = any(hay, "open mic", "sign up", "sign-up", "kj ", "host", "rotation", "stage", "list");
  const barStyle = /bar|pub|night club|lounge|club/i.test(l.type) && !privateRooms.value;
  const value = openMic || barStyle || privateRooms.value;
  let note;
  if (privateRooms.value && !barStyle) {
    note = "Group singing in your own private room — bring your crew and pass the mic; no strangers, no waiting list.";
  } else {
    note = "Open-mic format — add your name to the host's list and sing for the whole room. Great crowd energy and sing-alongs.";
  }
  return { value, note };
}

function deriveMicVolume(l, hay, korean, privateRooms) {
  // Quality / volume cues from reviews
  const goodSound = any(hay, "great sound", "good sound", "sound system", "quality mic", "clear", "professional", "high quality");
  const loud = any(hay, "loud", "blasting", "pumping", "turn it up", "belt");
  if (privateRooms.value || korean.value) {
    return goodSound
      ? "Loud and crisp — private rooms run dedicated speakers and quality wireless mics, so you can belt at full volume without bothering anyone."
      : "Loud by design — each private room has its own sound system and mics tuned for full-volume singing behind closed doors.";
  }
  if (loud || goodSound) {
    return "Mic runs hot over a full bar PA — your voice carries across the room, so it's built for confident, belt-it-out performances.";
  }
  return "Bar-level mix — vocals sit on top of the room's music and crowd noise; comfortable for casual singers more than full-volume soloists.";
}

function deriveSpaceSize(l, hay, privateRooms) {
  const big = any(hay, "spacious", "huge", "large", "big venue", "multiple floors", "two floors", "upstairs", "warehouse", "massive");
  const small = any(hay, "cozy", "intimate", "small", "tiny", "hole in the wall", "dive", "tight", "cramped");
  if (privateRooms.value) {
    if (big) return "Large venue with a range of private rooms — small suites for a few friends up to big rooms that seat 15–20+.";
    return "Mid-sized spot built around private rooms — choose a room scaled to your group, from a few people up to a dozen or more.";
  }
  if (big) return "Roomy floor plan with space to move — a real stage area plus seating, so big groups won't feel boxed in.";
  if (small) return "Cozy, intimate room — a tight, low-key space where the whole bar feels like one big party.";
  return "Standard bar footprint — a defined stage or karaoke corner with bar and table seating around it.";
}

function deriveAmbiance(l, hay) {
  const tags = [];
  const upscale = l.priceRange === "$$$" || l.priceRange === "$$$$" || any(hay, "upscale", "classy", "elegant", "swanky", "chic");
  const dive = any(hay, "dive", "hole in the wall", "no frills", "gritty", "old school", "old-school");
  const club = /night club|club/i.test(l.type) || any(hay, "dance floor", "dancing", "dj", "nightclub", "club vibe");
  const cocktail = any(hay, "craft cocktail", "great cocktails", "cocktail", "mixology");
  const live = any(hay, "live music", "live performance", "live band");
  const chill = any(hay, "chill", "laid back", "laid-back", "relaxed", "low key", "low-key", "neighborhood");

  if (upscale) tags.push("polished and upscale");
  if (dive) tags.push("unpretentious dive-bar energy");
  if (club) tags.push("high-energy, club-like with a dance-floor crowd");
  if (cocktail && !dive) tags.push("cocktail-forward");
  if (live) tags.push("live-music leaning");
  if (chill) tags.push("relaxed and neighborhood-friendly");

  if (tags.length === 0) {
    return "Classic karaoke-bar atmosphere — dim lighting, a lively crowd, and an unpretentious, come-as-you-are vibe.";
  }
  const lead =
    tags.length === 1
      ? tags[0]
      : `${tags[0]} with a side of ${tags[1].replace(/^(high-energy, |unpretentious )/, "")}`;
  return `Vibe leans ${lead}. Expect dim lighting, an enthusiastic singing crowd, and a come-as-you-are dress code.`;
}

function deriveCrowdAge(l, hay) {
  const family = any(hay, "family friendly", "family-friendly", "all ages", "kid", "children", "birthday party");
  const club = /night club|club/i.test(l.type) || any(hay, "nightclub", "dance floor", "dj", "21+", "club vibe");
  const college = any(hay, "college", "students", "young crowd", "cheap drinks", "dive");
  if (family) {
    return "Mixed ages early on — families and all-ages groups in the early evening, shifting to a 21+ crowd later at night.";
  }
  if (club) {
    return "Skews younger — mostly 21–35, energetic late-night club crowd that fills in after 11 PM.";
  }
  if (college) {
    return "Younger, college-and-twenties crowd — lively, social, and budget-friendly, busiest on weekend nights.";
  }
  return "Broad mix of ages — mostly mid-20s through 40s, with a friendly, social regulars-and-newcomers blend.";
}

function deriveBusyHours(l, hay) {
  // Pull closing time signals from hours to judge late-night character
  let latest = 0;
  for (const h of l.hours || []) {
    if (h.closed) continue;
    const m = (h.label || "").match(/(\d{1,2})\s*am/i);
    if (m) {
      const hr = parseInt(m[1], 10);
      if (hr >= 1 && hr <= 4 && hr > latest) latest = hr;
    }
  }
  const packed = any(hay, "packed", "crowded", "wait", "line", "busy", "full");
  const lateNight = latest >= 1;
  if (lateNight) {
    return `Quiet early, packed late — peaks Thursday through Saturday from about 10 PM until close (open past ${latest} AM). Arrive before 9 PM for a table or a shorter wait on the list.`;
  }
  if (packed) {
    return "Busiest on Friday and Saturday nights, roughly 9 PM to midnight. Come earlier in the evening to beat the rush and get on the song list faster.";
  }
  return "Liveliest on weekend evenings, 9 PM to close. Weeknights are noticeably calmer — better for a relaxed session or shorter waits.";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const listings = JSON.parse(readFileSync(LISTINGS_PATH, "utf8"));
  let count = 0;
  const koreanCount = { t: 0 };
  const privCount = { t: 0 };

  for (const l of listings) {
    const hay = buildHaystack(l);
    const korean = deriveKorean(l, hay);
    const privateRooms = derivePrivateRooms(l, hay, korean);
    const groupSinging = deriveGroupSinging(l, hay, privateRooms);

    l.insiderDetails = {
      micVolume: deriveMicVolume(l, hay, korean, privateRooms),
      spaceSize: deriveSpaceSize(l, hay, privateRooms),
      ambiance: deriveAmbiance(l, hay),
      crowdAge: deriveCrowdAge(l, hay),
      busyHours: deriveBusyHours(l, hay),
      groupSinging,
      privateRooms,
      korean,
    };

    if (korean.value) koreanCount.t++;
    if (privateRooms.value) privCount.t++;
    count++;
  }

  console.log(`Generated insider details for ${count} listings`);
  console.log(`  Korean-style:  ${koreanCount.t}`);
  console.log(`  Private rooms: ${privCount.t}`);
  console.log("\nSample —", listings[0].name);
  console.log(JSON.stringify(listings[0].insiderDetails, null, 2));

  if (DRY_RUN) {
    console.log("\n[DRY RUN] Not saving.");
    return;
  }
  writeFileSync(LISTINGS_PATH, JSON.stringify(listings, null, 2));
  console.log(`\n✓ Saved ${listings.length} listings`);
}

main();
