import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { states, getStateBySlug, cityToSlug, getCityName } from "@/lib/states";
import {
  getListing,
  listings,
  listingUrl,
  similarListings,
  telHref,
  mapsEmbedUrl,
  mapsPlaceUrl,
  priceLabel,
} from "@/lib/listings";
import StarRating from "@/components/StarRating";
import HoursTable from "@/components/HoursTable";
import { site } from "@/lib/site";

// ---------------------------------------------------------------------------
// Karaoke type definitions (copied from the former [type]/page.tsx)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// generateStaticParams — returns BOTH type pages and listing pages
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  const typeParams = states.flatMap((state) =>
    state.cities.flatMap((city) =>
      TYPE_SLUGS.map((type) => ({
        state: state.slug,
        city: cityToSlug(city),
        slug: type,
      }))
    )
  );

  const listingParams = listings.map((l) => ({
    state: l.stateSlug,
    city: l.citySlug,
    slug: l.slug,
  }));

  return [...typeParams, ...listingParams];
}

// ---------------------------------------------------------------------------
// generateMetadata — branches on type vs listing
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string; slug: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug, slug } = await params;

  // --- Type branch ---
  if (TYPE_SLUGS.includes(slug as KaraokeTypeSlug)) {
    const state = getStateBySlug(stateSlug);
    if (!state) return {};
    const cityName = getCityName(stateSlug, citySlug);
    if (!cityName) return {};
    const t = KARAOKE_TYPES[slug as KaraokeTypeSlug];
    return {
      title: t.title(cityName, state.abbr),
      description: t.metaDesc(cityName, state.name),
      alternates: { canonical: `/${stateSlug}/${citySlug}/${slug}/` },
      openGraph: {
        title: t.title(cityName, state.abbr),
        description: t.metaDesc(cityName, state.name),
        url: `/${stateSlug}/${citySlug}/${slug}/`,
        type: "website",
      },
    };
  }

  // --- Listing branch ---
  const l = getListing(slug);
  if (!l) return {};
  const type = (l.type ?? "karaoke venue").toLowerCase();
  const ratingSnippet =
    l.rating && l.reviews
      ? ` Rated ${l.rating.toFixed(1)}/5 from ${l.reviews.toLocaleString()} Google reviews.`
      : "";
  return {
    title: { absolute: `${l.name} – Karaoke in ${l.city}, ${l.state}` },
    description: `${l.name} is a ${type} in ${l.city}, ${l.state}.${ratingSnippet} View hours, address, services, and directions.`,
    alternates: { canonical: `/${l.stateSlug}/${l.citySlug}/${l.slug}/` },
    openGraph: {
      title: `${l.name} – Karaoke in ${l.city}, ${l.state}`,
      description: `${l.name} is a ${type} in ${l.city}, ${l.state}.${ratingSnippet}`,
      url: `/${l.stateSlug}/${l.citySlug}/${l.slug}/`,
      type: "website",
    },
  };
}

// ---------------------------------------------------------------------------
// Page component — branches on type vs listing
// ---------------------------------------------------------------------------

export default async function CitySlugPage({
  params,
}: {
  params: Promise<{ state: string; city: string; slug: string }>;
}) {
  const { state: stateSlug, city: citySlug, slug } = await params;

  // =========================================================================
  // TYPE BRANCH
  // =========================================================================
  if (TYPE_SLUGS.includes(slug as KaraokeTypeSlug)) {
    if (!TYPE_SLUGS.includes(slug as KaraokeTypeSlug)) notFound();
    const state = getStateBySlug(stateSlug);
    if (!state) notFound();
    const cityName = getCityName(stateSlug, citySlug);
    if (!cityName) notFound();

    const t = KARAOKE_TYPES[slug as KaraokeTypeSlug];
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
        { "@type": "ListItem", position: 4, name: t.label, item: `${site.url}/${stateSlug}/${citySlug}/${slug}/` },
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
      "@id": `${site.url}/${stateSlug}/${citySlug}/${slug}/`,
      name: t.h1(cityName, state.abbr),
      description: t.metaDesc(cityName, state.name),
      url: `${site.url}/${stateSlug}/${citySlug}/${slug}/`,
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
                {TYPE_SLUGS.filter((s) => s !== slug).map((s) => (
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
                      href={`/${stateSlug}/${cityToSlug(c)}/${slug}/`}
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

  // =========================================================================
  // LISTING BRANCH
  // =========================================================================
  const l = getListing(slug);
  if (!l) notFound();
  if (l.stateSlug !== stateSlug || l.citySlug !== citySlug) notFound();

  const similar = similarListings(l, 6);
  const state = getStateBySlug(l.stateSlug);
  const price = priceLabel(l.priceRange);

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: l.name,
    url: `${site.url}/${l.stateSlug}/${l.citySlug}/${l.slug}/`,
    address: {
      "@type": "PostalAddress",
      streetAddress: l.address ?? undefined,
      addressLocality: l.city,
      addressRegion: l.stateCode ?? l.state,
      postalCode: l.postalCode ?? undefined,
      addressCountry: "US",
    },
    ...(l.lat && l.lng
      ? { geo: { "@type": "GeoCoordinates", latitude: l.lat, longitude: l.lng } }
      : {}),
    ...(l.phone ? { telephone: l.phone } : {}),
    ...(l.priceRange ? { priceRange: l.priceRange } : {}),
    ...(l.rating && l.reviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: l.rating,
            reviewCount: l.reviews,
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: l.state, item: `${site.url}/${stateSlug}/` },
      { "@type": "ListItem", position: 3, name: l.city, item: `${site.url}/${stateSlug}/${citySlug}/` },
      {
        "@type": "ListItem",
        position: 4,
        name: l.name,
        item: `${site.url}/${stateSlug}/${citySlug}/${slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={`/${stateSlug}/`}>{l.state}</Link>
            <span>/</span>
            <Link href={`/${stateSlug}/${citySlug}/`}>{l.city}</Link>
            <span>/</span>
            {l.name}
          </nav>
          <h1>{l.name}</h1>
          <div className="listing-meta">
            <span>{l.type ?? "Karaoke venue"}</span>
            <span className="dot">·</span>
            <span>
              {l.city}, {l.stateCode ?? l.state}
            </span>
            {price && (
              <>
                <span className="dot">·</span>
                <span>{price}</span>
              </>
            )}
          </div>
          <div className="listing-badges">
            {l.rating != null && (
              <StarRating rating={l.rating} reviews={l.reviews} size={18} />
            )}
            {l.verified && (
              <span className="badge-verified">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Verified on Google
              </span>
            )}
          </div>
        </div>
      </div>

      {l.photoUrl && (
        <div style={{ background: "#111", lineHeight: 0 }}>
          <img
            src={l.photoUrl}
            alt={`Inside ${l.name} — karaoke venue in ${l.city}, ${l.stateCode ?? l.state}`}
            width={1200}
            height={480}
            style={{
              width: "100%",
              maxHeight: 420,
              objectFit: "cover",
              display: "block",
              opacity: 0.92,
            }}
            loading="eager"
          />
        </div>
      )}

      <section className="section">
        <div className="container listing-layout">
          <div className="listing-main">
            <h2>About {l.name}</h2>
            <p>{l.about}</p>

            {l.servicesOffered.length > 0 && (
              <>
                <h2>Services Offered</h2>
                <p className="muted" style={{ marginTop: "-0.4rem" }}>
                  Tap a linked service to find other providers that handle it.
                </p>
                <div className="chip-row">
                  {l.servicesOffered.map((s) =>
                    s.slug ? (
                      <Link key={s.label} href={`/services/${s.slug}/`} className="chip">
                        {s.label}
                      </Link>
                    ) : (
                      <span key={s.label} className="chip chip-static">
                        {s.label}
                      </span>
                    )
                  )}
                </div>
              </>
            )}

            {l.amenities.length > 0 && (
              <>
                <h3 style={{ marginTop: "2rem" }}>Features &amp; amenities</h3>
                <ul className="amenities">
                  {l.amenities.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="quote-block">
              <p className="quote-text">
                {l.description
                  ? `"${l.description}"`
                  : `"Rated ${l.rating?.toFixed(1) ?? "highly"} out of 5 by ${
                      l.reviews?.toLocaleString() ?? "local"
                    } guests on Google."`}
              </p>
              <p className="quote-cite">
                {l.description
                  ? `Editorial summary from ${l.name}'s Google profile`
                  : `Based on verified Google reviews for ${l.name}`}
              </p>
            </div>
          </div>

          <aside className="listing-aside">
            <div className="info-card">
              <h3>Visit</h3>
              {l.address && (
                <p className="info-row">
                  <span className="info-label">Address</span>
                  <a href={mapsPlaceUrl(l)} target="_blank" rel="noopener noreferrer">
                    {l.address}
                  </a>
                </p>
              )}
              {l.phone && (
                <p className="info-row">
                  <span className="info-label">Phone</span>
                  <a href={telHref(l.phone)}>{l.phone}</a>
                </p>
              )}
              {l.website && (
                <p className="info-row">
                  <span className="info-label">Website</span>
                  <a href={l.website} target="_blank" rel="noopener noreferrer">
                    Visit {l.name} website
                  </a>
                </p>
              )}
              <a
                className="btn btn-primary"
                style={{ width: "100%", textAlign: "center", marginTop: "0.6rem" }}
                href={mapsPlaceUrl(l)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </div>

            <div className="info-card">
              <h3>Business Hours</h3>
              <HoursTable hours={l.hours} />
            </div>
          </aside>
        </div>
      </section>

      {l.lat && l.lng && (
        <section className="section section--alt" style={{ padding: "0" }}>
          <iframe
            title={`Map showing the location of ${l.name}`}
            src={mapsEmbedUrl(l)}
            width="100%"
            height="420"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      )}

      {l.googleReviews && l.googleReviews.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <h2>Google Reviews for {l.name}</h2>
            <p className="muted" style={{ marginBottom: "2rem" }}>
              From Google — {l.rating?.toFixed(1)} stars · {l.reviews?.toLocaleString()} reviews
            </p>
            <div className="grid grid-3">
              {l.googleReviews.map((r, i) => (
                <figure key={i} className="review-card">
                  <div className="review-stars">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                  <blockquote className="review-text">&ldquo;{r.text}&rdquo;</blockquote>
                  <figcaption className="review-author">
                    {r.avatarUrl && (
                      <img
                        src={r.avatarUrl}
                        alt={r.author}
                        width={32}
                        height={32}
                        style={{ borderRadius: "50%", flexShrink: 0 }}
                        loading="lazy"
                      />
                    )}
                    <span>
                      <strong>{r.author}</strong>
                      {r.time && <span style={{ opacity: 0.55, fontSize: "0.8rem" }}> · {r.time}</span>}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          {similar.length > 0 && (
            <>
              <h2>Similar Karaoke Spots Near {l.city}</h2>
              <div className="grid grid-3" style={{ marginTop: "1.6rem" }}>
                {similar.map((s) => (
                  <Link key={s.slug} href={listingUrl(s)} className="listing-card">
                    <span className="listing-card-name">{s.name}</span>
                    <span className="listing-card-meta">
                      {s.type ?? "Karaoke venue"} · {s.city}
                    </span>
                    {s.rating != null && (
                      <StarRating rating={s.rating} reviews={s.reviews} size={14} />
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}

          <div className="explore-more">
            {state && (
              <Link href={`/${state.slug}/`} className="btn btn-secondary">
                Karaoke in {state.name}
              </Link>
            )}
            <Link href="/listings/" className="btn btn-secondary">
              All listings
            </Link>
            <Link href="/karaoke-finder/" className="btn btn-secondary">
              Karaoke Finder
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
