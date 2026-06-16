import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { states, getStateBySlug, cityToSlug, getCityName } from "@/lib/states";
import { site } from "@/lib/site";

const KARAOKE_TYPES = {
  "karaoke-rooms": {
    label: "Karaoke Rooms",
    mapSearch: (city: string, stateName: string) =>
      `karaoke rooms near ${city}, ${stateName}`,
    title: (city: string, abbr: string) =>
      `Karaoke Rooms in ${city}, ${abbr} | Private KTV Suites`,
    metaDesc: (city: string, stateName: string) =>
      `Find private karaoke rooms and KTV suites in ${city}, ${stateName}. Book a room by the hour for your group — no crowd, no waiting, just your crew and the mic.`,
    h1: (city: string, abbr: string) => `Karaoke Rooms in ${city}, ${abbr}`,
    lead: (city: string, stateName: string) =>
      `Book a private karaoke room in ${city}, ${stateName}. KTV suites let your group sing on your own schedule — no public stage, no sign-up list, just your crew and the microphone.`,
    body: (city: string, stateName: string) => `
Private karaoke rooms (also called KTV) are available at select venues in ${city}. You reserve a fully enclosed space by the hour, bring your own group, and control the entire experience from song selection to volume. It is the most popular format for birthdays, bachelorette parties, date nights, and corporate outings in ${stateName}.

Most karaoke room venues in ${city} charge between $15 and $50 per hour depending on room size and the night of the week. Fridays and Saturdays book fast — reserve at least a day ahead for weekend slots. Many venues include a song tablet or touchscreen where your group queues tracks directly without waiting for a host.

If you prefer not to book ahead, some venues accept walk-ins during slower weeknight hours. Call the venue in the afternoon to check same-day room availability.
    `.trim(),
    faq: (city: string, stateName: string) => [
      {
        q: `How much do karaoke rooms cost in ${city}?`,
        a: `Karaoke rooms in ${city} typically run $15–$50 per hour depending on room size, venue, and day of the week. Weekends cost more and book faster — reserve in advance for Friday and Saturday nights.`,
      },
      {
        q: `Do I need to book a karaoke room in ${city} ahead of time?`,
        a: `Yes, especially for weekends. Popular venues in ${city} fill up quickly on Friday and Saturday nights. Book at least 24 hours ahead online or by phone. Weeknights are more likely to have walk-in availability.`,
      },
      {
        q: `How many people fit in a karaoke room in ${city}?`,
        a: `Karaoke rooms in ${city} typically come in small (2–6 people), medium (6–12), and large (12–20+) sizes. Let the venue know your group size when booking so they can match you to the right room.`,
      },
    ],
    parentSlug: "karaoke-rooms",
    parentLabel: "Karaoke Rooms",
  },
  "karaoke-bars": {
    label: "Karaoke Bars",
    mapSearch: (city: string, stateName: string) =>
      `karaoke bars near ${city}, ${stateName}`,
    title: (city: string, abbr: string) =>
      `Karaoke Bars in ${city}, ${abbr} | Open-Mic Nights`,
    metaDesc: (city: string, stateName: string) =>
      `Find karaoke bars in ${city}, ${stateName}. Host-led open-mic nights where you add your name to the list and perform for the room — usually free to join.`,
    h1: (city: string, abbr: string) => `Karaoke Bars in ${city}, ${abbr}`,
    lead: (city: string, stateName: string) =>
      `Discover karaoke bars in ${city}, ${stateName} — host-led nights where you add your name to the list and take the stage. The classic, social format and almost always free to join.`,
    body: (city: string, stateName: string) => `
Bar-style karaoke is the most common format in ${city} and across ${stateName}. A host runs the show from a shared stage or corner of the room, rotating through a sign-up list so everyone gets a turn. The crowd cheers for every singer regardless of skill — it is social, welcoming, and the easiest way to find karaoke near you without a reservation.

Most karaoke bars in ${city} run their nights on Thursday through Saturday evenings, starting around 9 or 10 PM. Some spots add Tuesday or Wednesday nights if demand is strong. Arrive 30–45 minutes before the host starts on weekends to get your name near the top of the list — popular venues fill the queue fast.

Participation is almost always free. The venue earns from food and drink sales, so pick up a round and tip your host well — they control the list.
    `.trim(),
    faq: (city: string, stateName: string) => [
      {
        q: `Is karaoke at bars in ${city} free?`,
        a: `Yes — bar karaoke in ${city} is almost always free to participate in. You add your name to the host's list and sing when your turn comes. The bar earns from drink and food sales, not cover charges, though some busy weekend spots may add a small door fee.`,
      },
      {
        q: `What nights do karaoke bars run in ${city}?`,
        a: `Most karaoke bars in ${city} run Thursday through Saturday. Some venues add Tuesday or Wednesday nights. Check the bar's social media or call ahead — schedules can shift by season.`,
      },
      {
        q: `How do I sign up to sing at a karaoke bar in ${city}?`,
        a: `Find the karaoke host when you arrive and ask to add your name to the list. Some venues use a paper slip, others take requests digitally. Arrive early on weekends so you get a spot before the queue fills up.`,
      },
    ],
    parentSlug: "karaoke-bars",
    parentLabel: "Karaoke Bars",
  },
  "private-karaoke": {
    label: "Private Karaoke",
    mapSearch: (city: string, stateName: string) =>
      `private karaoke rooms near ${city}, ${stateName}`,
    title: (city: string, abbr: string) =>
      `Private Karaoke in ${city}, ${abbr} | Book a Room`,
    metaDesc: (city: string, stateName: string) =>
      `Book private karaoke in ${city}, ${stateName}. Fully enclosed rooms for your group — no strangers, no waiting list, just your playlist and your microphones.`,
    h1: (city: string, abbr: string) =>
      `Private Karaoke in ${city}, ${abbr}`,
    lead: (city: string, stateName: string) =>
      `Book a fully private karaoke room in ${city}, ${stateName}. No strangers, no waiting — just your group, your songs, and your microphones for the whole session.`,
    body: (city: string, stateName: string) => `
Private karaoke in ${city} means your group gets a fully enclosed room booked by the hour. No public stage, no sign-up list, and no strangers joining your session. You control the song queue, the volume, and the pace of the night. It is the ideal format for anyone who wants to sing without performing for a crowd.

Private rooms in ${city} are especially popular for birthday parties, bachelorette and bachelor parties, anniversary celebrations, and team outings. Most venues in ${stateName} offer rooms in multiple sizes to fit groups from 2 to 20 or more. Some locations include tambourines, extra mics, and themed room decor for special occasions.

Rates typically run $20–$50 per hour per room. Weekend evenings book the fastest — call or book online at least a day ahead to secure your preferred time slot.
    `.trim(),
    faq: (city: string, stateName: string) => [
      {
        q: `Where can I find private karaoke rooms in ${city}?`,
        a: `Tap the button above to open a Google Maps search for private karaoke rooms near ${city}, ${stateName}. You can also search "KTV ${city}" or "private karaoke ${city}" to find venues with bookable rooms.`,
      },
      {
        q: `How much does private karaoke cost in ${city}?`,
        a: `Private karaoke rooms in ${city} typically cost $20–$50 per hour per room. Weekend nights are pricier and book faster. Some venues charge a minimum spend on food and drinks in addition to the room rate.`,
      },
      {
        q: `Can I do private karaoke for a birthday party in ${city}?`,
        a: `Yes — private karaoke rooms are one of the most popular birthday party options in ${city}. Let the venue know it's a birthday when you book; many offer decorations, reserved time slots, and group packages for special occasions.`,
      },
    ],
    parentSlug: "private-karaoke",
    parentLabel: "Private Karaoke Rooms",
  },
  "family-karaoke": {
    label: "Family Karaoke",
    mapSearch: (city: string, stateName: string) =>
      `family karaoke near ${city}, ${stateName}`,
    title: (city: string, abbr: string) =>
      `Family Karaoke in ${city}, ${abbr} | All-Ages Venues`,
    metaDesc: (city: string, stateName: string) =>
      `Find family-friendly karaoke in ${city}, ${stateName}. All-ages venues, private rooms, and restaurant nights the whole family can enjoy.`,
    h1: (city: string, abbr: string) => `Family Karaoke in ${city}, ${abbr}`,
    lead: (city: string, stateName: string) =>
      `Find all-ages karaoke the whole family can enjoy in ${city}, ${stateName}. Private rooms and family-friendly restaurant nights let kids and adults sing together in a welcoming environment.`,
    body: (city: string, stateName: string) => `
Family karaoke in ${city} is easiest to find at venues with private rooms, where you can bring kids without navigating a bar environment. KTV-style lounges in ${stateName} that offer private bookings are typically the most family-friendly option — your group has its own enclosed space, controls the song volume, and can leave whenever works for your schedule.

Restaurant karaoke nights are another good option for families. Some ${city} restaurants host weekly karaoke evenings earlier in the evening (starting around 7–8 PM) that are relaxed and welcoming to all ages. These nights tend to wind down or shift to a bar atmosphere later, so earlier arrival is ideal for groups with kids.

When searching for family karaoke in ${city}, call ahead to confirm the age policy and start time. Private room venues rarely have age restrictions; bar-style nights depend on local liquor laws and individual venue policy.
    `.trim(),
    faq: (city: string, stateName: string) => [
      {
        q: `Is karaoke in ${city} family-friendly?`,
        a: `Some venues in ${city} are family-friendly, particularly those with private KTV rooms where your group has its own space. Bar-style karaoke nights are typically 21+ after a certain hour. Call the venue ahead of time to confirm their age policy.`,
      },
      {
        q: `Can kids do karaoke in ${city}?`,
        a: `Yes — private karaoke rooms in ${city} are usually the best option for kids. Your group has a dedicated, enclosed space with no bar environment. Some family restaurants also host all-ages karaoke nights earlier in the evening.`,
      },
      {
        q: `What time does family karaoke start in ${city}?`,
        a: `Family-friendly karaoke in ${city} typically runs in the early evening — between 6 and 9 PM — before venues shift to a bar crowd. Private room venues often have afternoon and early evening slots available any day of the week.`,
      },
    ],
    parentSlug: "family-karaoke",
    parentLabel: "Family Karaoke",
  },
  "korean-karaoke": {
    label: "Korean Karaoke",
    mapSearch: (city: string, stateName: string) =>
      `korean karaoke norebang near ${city}, ${stateName}`,
    title: (city: string, abbr: string) =>
      `Korean Karaoke in ${city}, ${abbr} | Norebang & KTV`,
    metaDesc: (city: string, stateName: string) =>
      `Find Korean karaoke (norebang) in ${city}, ${stateName}. Private rooms with massive K-pop and Korean song catalogs, tambourines, and the authentic norebang experience.`,
    h1: (city: string, abbr: string) =>
      `Korean Karaoke in ${city}, ${abbr}`,
    lead: (city: string, stateName: string) =>
      `Find norebang and Korean KTV venues in ${city}, ${stateName}. Private rooms with extensive K-pop and Korean song catalogs, tambourines, and the full norebang experience.`,
    body: (city: string, stateName: string) => `
Korean karaoke — called norebang (노래방) — is a private-room format where your group books an enclosed space by the hour and sings from a catalog that emphasizes K-pop, Korean ballads, and a wide range of international hits. Unlike bar karaoke, there is no public audience: your group controls the whole experience.

Norebang venues in ${city} typically stock thousands of Korean-language tracks alongside English, Spanish, and Japanese options. Most rooms come equipped with high-quality sound systems, tambourines, echo effects, and sometimes disco lighting. The atmosphere is celebratory and encourages everyone to participate regardless of vocal ability.

Authentic norebang spots in ${city} are often found in or near Korean commercial districts or areas with established Korean-American communities. If ${city} does not have a dedicated norebang venue, many standard KTV lounges in ${stateName} carry a large Korean song selection — worth calling ahead to confirm catalog depth.
    `.trim(),
    faq: (city: string, stateName: string) => [
      {
        q: `What is norebang and where can I find it in ${city}?`,
        a: `Norebang (노래방) is Korean private-room karaoke where your group books an enclosed space and sings from a large K-pop and Korean music catalog. Search Google Maps for "norebang ${city}" or "Korean karaoke ${city}" to find venues near you.`,
      },
      {
        q: `Do Korean karaoke venues in ${city} have English songs?`,
        a: `Yes — most norebang and Korean KTV venues in ${city} have extensive English-language catalogs alongside Korean tracks. Popular English genres (pop, hip-hop, rock, R&B) are well-represented, and many venues add new English songs regularly.`,
      },
      {
        q: `How much does Korean karaoke cost in ${city}?`,
        a: `Korean karaoke rooms in ${city} typically cost $15–$40 per hour per room. Prices vary by room size, venue quality, and day of the week. Weekend nights are more expensive and book faster — reserve ahead for Friday and Saturday.`,
      },
    ],
    parentSlug: "korean-karaoke",
    parentLabel: "Korean Karaoke",
  },
} as const;

type KaraokeTypeSlug = keyof typeof KARAOKE_TYPES;
const TYPE_SLUGS = Object.keys(KARAOKE_TYPES) as KaraokeTypeSlug[];

export function generateStaticParams() {
  return states.flatMap((state) =>
    state.cities.flatMap((city) =>
      TYPE_SLUGS.map((type) => ({
        state: state.slug,
        city: cityToSlug(city),
        type,
      }))
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string; type: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug, type } = await params;
  if (!TYPE_SLUGS.includes(type as KaraokeTypeSlug)) return {};
  const state = getStateBySlug(stateSlug);
  if (!state) return {};
  const cityName = getCityName(stateSlug, citySlug);
  if (!cityName) return {};
  const t = KARAOKE_TYPES[type as KaraokeTypeSlug];
  return {
    title: t.title(cityName, state.abbr),
    description: t.metaDesc(cityName, state.name),
    alternates: { canonical: `/${stateSlug}/${citySlug}/${type}/` },
    openGraph: {
      title: t.title(cityName, state.abbr),
      description: t.metaDesc(cityName, state.name),
      url: `/${stateSlug}/${citySlug}/${type}/`,
      type: "website",
    },
  };
}

export default async function CityTypePage({
  params,
}: {
  params: Promise<{ state: string; city: string; type: string }>;
}) {
  const { state: stateSlug, city: citySlug, type } = await params;

  if (!TYPE_SLUGS.includes(type as KaraokeTypeSlug)) notFound();
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();
  const cityName = getCityName(stateSlug, citySlug);
  if (!cityName) notFound();

  const t = KARAOKE_TYPES[type as KaraokeTypeSlug];
  const faqs = t.faq(cityName, state.name);

  const mapsQuery = encodeURIComponent(t.mapSearch(cityName, state.name));
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const mapsGoUrl = `/go/?to=${encodeURIComponent(mapsUrl)}`;

  const nearbyCities = state.cities
    .filter((c) => cityToSlug(c) !== citySlug)
    .slice(0, 8);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: state.name, item: `${site.url}/${stateSlug}/` },
      { "@type": "ListItem", position: 3, name: cityName, item: `${site.url}/${stateSlug}/${citySlug}/` },
      { "@type": "ListItem", position: 4, name: t.label, item: `${site.url}/${stateSlug}/${citySlug}/${type}/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${site.url}/${stateSlug}/${citySlug}/${type}/`,
    name: t.h1(cityName, state.abbr),
    description: t.metaDesc(cityName, state.name),
    url: `${site.url}/${stateSlug}/${citySlug}/${type}/`,
    inLanguage: "en-US",
    dateModified: "2026-06-16",
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
    breadcrumb: breadcrumbSchema,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={`/${stateSlug}/`}>{state.name}</Link>
            <span>/</span>
            <Link href={`/${stateSlug}/${citySlug}/`}>{cityName}</Link>
            <span>/</span>
            {t.label}
          </nav>
          <h1>{t.h1(cityName, state.abbr)}</h1>
          <p className="lead">{t.lead(cityName, state.name)}</p>
          <div className="map-cta-row">
            <Link className="btn btn-primary" href={mapsGoUrl}>
              Find {t.label} in {cityName}
            </Link>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <h2>{t.label} in {cityName}, {state.name}</h2>
            {t.body(cityName, state.name).split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq) => (
              <div key={faq.q} style={{ marginBottom: "1.5rem" }}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}

            <h2>More Karaoke Options in {cityName}</h2>
            <p>
              Looking for other karaoke formats in {cityName}? Explore all
              venue types and find the right spot for your group tonight.
            </p>
            <div className="chip-row" style={{ marginTop: "1rem" }}>
              {TYPE_SLUGS.filter((s) => s !== type).map((s) => (
                <Link
                  key={s}
                  href={`/${stateSlug}/${citySlug}/${s}/`}
                  className="chip"
                >
                  {KARAOKE_TYPES[s].label}
                </Link>
              ))}
              <Link href={`/${stateSlug}/${citySlug}/`} className="chip">
                All karaoke in {cityName}
              </Link>
            </div>
          </div>

          {nearbyCities.length > 0 && (
            <div style={{ marginTop: "3.5rem" }}>
              <h2>{t.label} in Other {state.name} Cities</h2>
              <div className="chip-row" style={{ marginTop: "1.2rem" }}>
                {nearbyCities.map((c) => (
                  <Link
                    key={c}
                    href={`/${stateSlug}/${cityToSlug(c)}/${type}/`}
                    className="chip"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="explore-more" style={{ marginTop: "3rem" }}>
            <Link href={mapsGoUrl} className="btn btn-primary">
              Find {t.label} in {cityName}
            </Link>
            <Link href={`/${stateSlug}/${citySlug}/`} className="btn btn-secondary">
              All karaoke in {cityName}
            </Link>
            <Link href={`/${stateSlug}/`} className="btn btn-secondary">
              Karaoke in {state.name}
            </Link>
            <Link href={`/${t.parentSlug}/`} className="btn btn-secondary">
              {t.parentLabel} guide
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
