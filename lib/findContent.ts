import type { FindPage, FindPageKind, Listing } from "@/lib/listings";
import { sortByProminence } from "@/lib/listings";

// Builds the unique, per-page SEO content for a /find/ search-map page:
// a "what to expect" blurb tailored to the template kind, a data-driven
// highlights section computed from that city's actual venues, and an FAQ
// whose answers change with the real numbers on the page. Every value here
// is derived from page/cityListings, so no two /find/ pages render the same
// paragraph even when two cities share a template.

const KIND_INTRO: Record<FindPageKind, (city: string) => string> = {
  city: (city) =>
    `Whether you want a mic in a packed bar or a private room for your group, ${city} has karaoke options for most kinds of nights out. Below is every venue in our directory that offers karaoke here, plotted on the map so you can see what's closest to you.`,
  "private-rooms": (city) =>
    `Private-room karaoke (sometimes called KTV) lets your group rent an enclosed space by the hour instead of sharing a stage with the rest of the bar. In ${city}, that makes it a solid pick for birthdays, work outings, and anyone who'd rather not sing in front of strangers.`,
  family: (city) =>
    `These ${city} spots pair karaoke with a full restaurant menu, which tends to make for an easier night with a mixed-age group. Expect table service and a kitchen alongside the song list, rather than a strictly bar-only scene.`,
  "queer-friendly": (city) =>
    `The venues below are known as queer-friendly spaces in ${city} — bars and lounges where LGBTQ+ singers and audiences are an established part of the regular crowd, not just an occasional theme night.`,
  daytime: (city) =>
    `Not every karaoke night starts at 9pm. These ${city} venues open by mid-afternoon on at least one day of the week, so there's a real window to grab the mic before the evening rush.`,
  "dine-in": (city) =>
    `Each of these ${city} venues offers dine-in service, so you can order food at the table between songs instead of treating karaoke as a stop before or after dinner elsewhere.`,
  hispanic: (city) =>
    `${city}'s Latin karaoke scene pairs Spanish and English song catalogs with a restaurant or bar built around Latin American food and drink.`,
  bowling: (city) =>
    `These ${city} spots combine bowling and karaoke under one roof, so a group with mixed interests for the night doesn't have to choose one or the other.`,
};

const KIND_FAQ_LABEL: Record<FindPageKind, string> = {
  city: "karaoke",
  "private-rooms": "private-room karaoke",
  family: "family-friendly karaoke",
  "queer-friendly": "queer-friendly karaoke",
  daytime: "daytime karaoke",
  "dine-in": "dine-in karaoke",
  hispanic: "Hispanic karaoke",
  bowling: "bowling and karaoke",
};

export interface FindContent {
  intro: string;
  highlights: { heading: string; body: string } | null;
  faq: { question: string; answer: string }[];
}

function ratingSentence(top: Listing[]): string | null {
  const rated = top.filter((l) => l.rating != null);
  if (rated.length === 0) return null;
  const names = rated.slice(0, 3).map((l) => l.name);
  const list =
    names.length === 1
      ? names[0]
      : names.length === 2
      ? `${names[0]} and ${names[1]}`
      : `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
  return `The highest-rated ${rated.length === 1 ? "option" : "options"} in this list right now: ${list}.`;
}

function serviceBreakdownSentence(listings: Listing[], city: string): string | null {
  const total = listings.length;
  if (total === 0) return null;
  const privateRooms = listings.filter((l) => l.serviceSlugs.includes("private-karaoke-rooms")).length;
  const restaurants = listings.filter((l) => l.serviceSlugs.includes("restaurant")).length;
  const cities = new Set(listings.map((l) => l.city));
  const parts: string[] = [];
  if (privateRooms > 0) {
    parts.push(`${privateRooms} of ${total} offer a private room`);
  }
  if (restaurants > 0) {
    parts.push(`${restaurants} of ${total} also serve a full food menu`);
  }
  if (cities.size > 1) {
    parts.push(`spots are spread across ${cities.size} neighborhoods and nearby towns around ${city}`);
  }
  if (parts.length === 0) return null;
  return parts.join("; ") + ".";
}

export function buildFindContent(page: FindPage, listings: Listing[]): FindContent {
  const { city, state, kind, count } = page;
  const sorted = [...listings].sort(sortByProminence);

  const intro = KIND_INTRO[kind](city);

  const sentences = [ratingSentence(sorted), serviceBreakdownSentence(listings, city)].filter(
    (s): s is string => Boolean(s)
  );
  const highlights =
    sentences.length > 0
      ? { heading: `What Stands Out in ${city}`, body: sentences.join(" ") }
      : null;

  const label = KIND_FAQ_LABEL[kind];
  const faq = [
    {
      question: `How many ${label} spots are in ${city}, ${state}?`,
      answer: `Our directory currently lists ${count} ${count === 1 ? "venue" : "venues"} matching ${label} in ${city}. Use the map above to filter further by zip code, state, or karaoke type.`,
    },
    {
      question: "Do I need to book ahead?",
      answer:
        kind === "private-rooms"
          ? "Private rooms are usually booked by the hour and can sell out on weekends, so it's worth calling or booking online before you go, especially for a group."
          : "Most bar-style karaoke nights are walk-in and free to join, though it's worth calling ahead on weekends or for a large group.",
    },
    {
      question: `What's the best way to find karaoke near me in ${city}?`,
      answer: `Search the map above by zip code or browse the full list below. Each listing links to hours, ratings, and directions so you can pick a spot before you head out.`,
    },
  ];

  return { intro, highlights, faq };
}
