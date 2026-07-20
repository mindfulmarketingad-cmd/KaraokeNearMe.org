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
  korean: (city) =>
    `These ${city} venues bring a Korean-style karaoke experience — expect a song catalog and menu leaning Korean alongside the mic, closer to the noraebang format than a typical American bar night.`,
  "live-band": (city) =>
    `These ${city} venues pair karaoke with a live-music stage, which is often where you'll find live band karaoke — singing backed by a real band instead of a backing track. Formats vary by night, so it's worth calling ahead to confirm.`,
  best: (city) =>
    `"Best" here is based on real numbers, not opinion: these ${city} venues have built up at least 50 Google reviews, a track record that a brand-new listing hasn't had time to earn yet.`,
  "top-rated": (city) =>
    `These are the ${city} karaoke venues rated 4.5 stars or higher on Google, based on actual guest reviews rather than review volume alone.`,
  ktv: (city) =>
    `KTV — short for "karaoke television," the private-room format popularized across East Asia — means renting an enclosed room by the hour instead of taking turns on a shared stage. Here's where to find it in ${city}.`,
  lounge: (city) =>
    `A karaoke lounge trades a loud bar-room stage for a more low-key, seated setup — think cocktails and couches with a relaxed pace between songs. These are the venues tagged as lounges in ${city}.`,
  spots: (city) =>
    `No frills, just options: this is the full, casual list of everywhere to sing in ${city}, from a dive bar with a mic in the corner to a dedicated karaoke room.`,
  "24-hour": (city) =>
    `These ${city} venues list at least one day with round-the-clock hours, so an after-hours or early-morning session isn't off the table. Always worth a call first to confirm karaoke itself runs at that hour, since a venue being open doesn't guarantee the mic is on.`,
  competitions: (city) =>
    `Karaoke competitions and contest nights don't run on a fixed national schedule — they rotate through local karaoke bars, often as seasonal singoffs or weekly themed nights with a prize. Rather than guess, this page maps every karaoke venue in ${city} so you know exactly where to call and ask what contests are coming up.`,
  monday: (city) =>
    `Monday is my sleeper pick for karaoke. The rooms are quieter, the rotation moves fast, and you can sing three or four songs without waiting an hour between turns. Every ${city} spot below lists Monday hours in our directory, so you're not driving out to a locked door on the slowest night of the week.`,
  tuesday: (city) =>
    `Tuesday karaoke has a loyal regulars-and-hosts kind of energy — small crowd, familiar faces, and a host who has time to actually coach you through a song. I've pulled together the ${city} venues that show Tuesday hours here so you can find one that's genuinely open, not just hoping.`,
  wednesday: (city) =>
    `Midweek is where karaoke quietly comes alive. Wednesday nights tend to draw people who take it a little more seriously without the weekend chaos, and the wait times are still short. These are the ${city} venues our directory lists as open on Wednesdays.`,
  thursday: (city) =>
    `Thursday is the unofficial start of the weekend for karaoke, and it's my favorite compromise night — livelier than midweek, but you can still get on the mic more than once before the list fills up. Below are the ${city} spots that post Thursday hours.`,
  friday: (city) =>
    `Friday is peak karaoke: full rooms, long sign-up lists, and a crowd that's ready to sing along with you. Get there early to lock in a slot. These ${city} venues all list Friday hours in our directory, so you can plan the night with confidence.`,
  saturday: (city) =>
    `Saturday is the biggest karaoke night of the week almost everywhere, which means the best energy and the longest waits. My advice: pick your song early and put your name in the second you walk in. Here are the ${city} venues we have listed as open on Saturdays.`,
  sunday: (city) =>
    `Sunday karaoke is its own quiet ritual — a lower-key, wind-down-the-weekend crowd, often with a shorter list and a more relaxed host. These are the ${city} spots our directory shows with Sunday hours, so you can close out the weekend on the mic.`,
  "open-now": (city) =>
    `Trying to find karaoke that's open right now in ${city}? These are the venues we have posted hours for, so you can check each one's schedule on the map and its listing to see who's actually open at this hour. Because things change fast, I'd still call ahead before you head out — a bar can be open while its karaoke night is not.`,
  "open-weekends": (city) =>
    `If your only free time to sing is Saturday or Sunday, this is your shortlist. Every ${city} venue below lists weekend hours in our directory, so you're choosing from places that are genuinely open when you are — not scrambling to find a backup at 9pm on a Saturday.`,
  "best-bars": (city) =>
    `The best karaoke bars in ${city} aren't the ones with the flashiest sign — they're the ones people keep coming back to, and the reviews show it. I've ranked every dedicated karaoke bar here by its Google star rating, highest first, so the spots real singers rate most are right at the top. A great karaoke bar earns those stars on the fundamentals: a deep, current song book, a mic and sound system that actually sound good, a host who keeps the rotation fair, and a crowd that cheers instead of talks over you.`,
  "best-restaurants": (city) =>
    `The best karaoke restaurants in ${city} let you make a whole night of it — dinner, drinks, and the mic in one place — and the ones below are ranked by their Google star rating, highest first, so the top-reviewed spots lead. What earns a karaoke restaurant its stars is the balance: food and service good enough to stand on their own, plus a karaoke setup that doesn't feel like an afterthought. That combination is exactly what makes them a safe pick for a birthday, a group dinner, or a mixed crowd that wants more than a bar.`,
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
  korean: "Korean karaoke",
  "live-band": "live band karaoke",
  best: "highly-reviewed karaoke",
  "top-rated": "top-rated karaoke",
  ktv: "KTV",
  lounge: "karaoke lounge",
  spots: "karaoke",
  "24-hour": "24-hour karaoke",
  competitions: "karaoke",
  monday: "Monday karaoke",
  tuesday: "Tuesday karaoke",
  wednesday: "Wednesday karaoke",
  thursday: "Thursday karaoke",
  friday: "Friday karaoke",
  saturday: "Saturday karaoke",
  sunday: "Sunday karaoke",
  "open-now": "open karaoke",
  "open-weekends": "weekend karaoke",
  "best-bars": "top-rated karaoke bar",
  "best-restaurants": "top-rated karaoke restaurant",
};

// Templates whose whole premise is a schedule, so their FAQ addresses how
// reliable published hours are rather than the generic "book ahead" answer.
const SCHEDULE_KINDS = new Set<FindPageKind>([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "open-now",
  "open-weekends",
]);

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
  const faq =
    kind === "competitions"
      ? [
          {
            question: `Where are karaoke competitions held in ${city}, ${state}?`,
            answer: `Competition and contest nights are hosted by individual karaoke bars rather than listed centrally, so they change often. This page maps the ${count} karaoke ${count === 1 ? "venue" : "venues"} in ${city} — call the ones nearest you to ask whether they run a singoff, weekly contest, or seasonal competition.`,
          },
          {
            question: "How do karaoke competitions usually work?",
            answer:
              "Formats vary: some bars run a weekly contest with a small cash or bar-tab prize and a judge or applause meter, while others hold multi-week seasonal singoffs with a final. Entry is usually free or low-cost, but rules and sign-up cutoffs differ by venue, so confirm before you go.",
          },
          {
            question: `What's the best way to find a karaoke competition near me in ${city}?`,
            answer:
              "Start with the venues on the map above, then check each spot's website or social pages and call to confirm dates. Dedicated karaoke bars are the most likely to run organized contests.",
          },
        ]
      : [
          {
            question: `How many ${label} spots are in ${city}, ${state}?`,
            answer: `Our directory currently lists ${count} ${count === 1 ? "venue" : "venues"} matching ${label} in ${city}. Use the map above to filter further by zip code, state, or karaoke type.`,
          },
          SCHEDULE_KINDS.has(kind)
            ? {
                question: "Are these hours reliable?",
                answer:
                  "We show the hours each venue publishes, but karaoke schedules shift more than regular business hours — a bar can be open while its karaoke host has the night off. Treat this as a starting point and call ahead to confirm the mic is actually on before you head out.",
              }
            : {
                question: "Do I need to book ahead?",
                answer:
                  kind === "private-rooms" || kind === "ktv"
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
