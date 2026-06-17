import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateBySlug, states, cityToSlug } from "@/lib/states";
import { listingsByState, sortByProminence, citiesForState, listingUrl } from "@/lib/listings";
import StarRating from "@/components/StarRating";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return states.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};
  const topCities = state.cities.slice(0, 3).join(", ");
  return {
    title: `Karaoke in ${state.name} | Karaoke Bars, KTV & Locations`,
    description: `Find the best karaoke bars and KTV lounges in ${state.name}. Discover karaoke nights in ${topCities} and across the ${state.region}. Browse venues, get local tips, and find karaoke near you tonight.`,
    alternates: { canonical: `/${state.slug}/` },
    keywords: [
      `karaoke ${state.name}`,
      `karaoke bars ${state.name}`,
      `karaoke near me ${state.name}`,
      `KTV ${state.name}`,
      `karaoke ${state.cities[0]}`,
      `karaoke bars near me`,
      `karaoke tonight ${state.name}`,
    ],
  };
}

// States where private-room KTV culture is well-established
const ktvStates = new Set([
  "california",
  "new-york",
  "texas",
  "hawaii",
  "new-jersey",
  "washington",
  "georgia",
  "illinois",
  "virginia",
  "maryland",
  "massachusetts",
  "nevada",
  "florida",
  "pennsylvania",
  "ohio",
  "colorado",
  "oregon",
  "michigan",
  "minnesota",
  "north-carolina",
  "louisiana",
  "arizona",
]);

function mapsSearch(city: string, stateName: string): string {
  const query = encodeURIComponent(`karaoke near ${city}, ${stateName}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  return `/go/?to=${encodeURIComponent(mapsUrl)}`;
}

function regionExpectation(region: string, stateName: string): string {
  switch (region) {
    case "Northeast":
      return `Karaoke bars in ${stateName} tend to be lively and bar-style, with experienced hosts who keep the night moving at a good pace. Song catalogs are typically extensive, covering everything from classic rock and pop to country, hip-hop, and Broadway hits. Audiences are encouraging—even strangers cheer you on, making it a welcoming environment for first-timers and seasoned performers alike.`;
    case "South":
      return `Southern hospitality extends to the karaoke stage in ${stateName}. Expect friendly, enthusiastic crowds who cheer for everyone regardless of vocal talent. Many ${stateName} venues add a personal touch with hosts who know the regulars by name and make newcomers feel instantly at home. The atmosphere is relaxed, social, and genuinely fun.`;
    case "Midwest":
      return `Midwestern karaoke in ${stateName} keeps things unpretentious and genuinely fun. Most venues run host-led open-mic-style nights where anyone can add their name to the list and take the microphone. The atmosphere is casual and welcoming—no prior experience or vocal talent required to step up and perform for a supportive crowd.`;
    case "West":
      return `The karaoke scene in ${stateName} embraces diversity and self-expression. You will find everything from lively dive-bar nights to polished private-room KTV experiences depending on the city. Hosts are typically enthusiastic, song libraries are large, and the crowd tends to be supportive across all musical genres and skill levels.`;
    default:
      return `Karaoke in ${stateName} is a welcoming, crowd-friendly experience. Most venues offer a broad song catalog and a supportive atmosphere where beginners and seasoned performers alike feel right at home on the microphone.`;
  }
}

function karaokeTypesText(
  slug: string,
  stateName: string,
  cities: string[]
): string {
  const city1 = cities[0];
  const city2 = cities[1] ?? cities[0];
  if (ktvStates.has(slug)) {
    return `${stateName} offers both traditional bar-style karaoke and private-room KTV lounges. Bar karaoke is the most widespread option—you sign up with a host and perform for the whole room when your turn comes. Private KTV rooms, available in ${city1} and ${city2}, let you book a dedicated space by the hour so your group sings on its own schedule without a crowd audience. KTV rooms are especially popular for birthday parties, date nights, and corporate outings. Both formats have enthusiastic followings and are easy to find across the state.`;
  }
  return `Karaoke in ${stateName} is primarily hosted bar-style, where you add your name to a list and perform for the room when your turn arrives. This open format creates a fun, communal energy and is perfect for solo singers or small groups wanting to enjoy karaoke with a crowd. Some larger venues in ${city1} may offer semi-private booths or dedicated event spaces for group bookings—worth calling ahead to check on availability, particularly for weekends and special occasions.`;
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const related = states
    .filter((s) => s.region === state.region && s.slug !== state.slug)
    .slice(0, 6);

  const stateListings = listingsByState(state.slug).sort(sortByProminence);
  const featured = stateListings.slice(0, 6);
  const hasListings = stateListings.length > 0;
  const listingCities = citiesForState(state.slug);

  const topCities = state.cities.slice(0, 3).join(", ");

  const faqs = [
    {
      question: `Is karaoke popular in ${state.name}?`,
      answer: `Yes—karaoke is alive and well in ${state.name}. ${state.intro} With active venues in cities like ${topCities}, there are plenty of options whether you prefer a lively bar night or a more private singing experience.`,
    },
    {
      question: `What are the best cities for karaoke in ${state.name}?`,
      answer: `The top cities for karaoke in ${state.name} include ${state.cities.join(", ")}. ${state.cities[0]} has the widest selection of venues, from traditional bar nights to dedicated karaoke spots.${state.cities[1] ? ` ${state.cities[1]} is also a strong pick, with a dependable local scene and multiple venues running regular nights throughout the week.` : ""}`,
    },
    {
      question: `Are there private karaoke rooms in ${state.name}?`,
      answer: ktvStates.has(state.slug)
        ? `Yes, private karaoke rooms (KTV) are available in ${state.name}, particularly in ${state.cities[0]}${state.cities[1] ? ` and ${state.cities[1]}` : ""}. These venues let your group book a dedicated room by the hour, giving you full control over the song queue and a private atmosphere—ideal for parties, birthdays, and group outings.`
        : `Private karaoke rooms (KTV) are available at select venues in ${state.name}, though bar-style karaoke remains more common. If you are looking for a private room experience, call ahead to venues in ${state.cities[0]} to check availability, especially for weekend group bookings.`,
    },
    {
      question: `What nights is karaoke available in ${state.name}?`,
      answer: `Karaoke in ${state.name} most commonly runs Thursday through Saturday nights, with some venues in ${state.cities[0]} hosting additional nights on Tuesday or Wednesday. Weekend nights fill up fastest, so arrive 30 to 45 minutes before the karaoke host starts to get your name near the top of the list.`,
    },
    {
      question: `How do I find karaoke near me in ${state.name}?`,
      answer: `Use the Karaoke Finder on KaraokeNearMe.org to search by city or neighborhood across ${state.name}. You can also browse the interactive ${state.name} karaoke map, which shows venues in ${topCities} and additional cities statewide. Tap any venue for details on hours, type, and ratings.`,
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.url + "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: state.name,
        item: `${site.url}/${state.slug}/`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const itemListSchema =
    featured.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Karaoke Venues in ${state.name}`,
          description: `Top-rated karaoke bars and venues in ${state.name}.`,
          numberOfItems: featured.length,
          itemListElement: featured.map((venue, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "EntertainmentBusiness",
              name: venue.name,
              url: `${site.url}${listingUrl(venue)}`,
              ...(venue.address
                ? {
                    address: {
                      "@type": "PostalAddress",
                      streetAddress: venue.address,
                      addressLocality: venue.city,
                      addressRegion: venue.stateCode ?? state.abbr,
                      addressCountry: "US",
                    },
                  }
                : {}),
              ...(venue.rating != null
                ? {
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: venue.rating,
                      reviewCount: venue.reviews ?? 1,
                      bestRating: 5,
                      worstRating: 1,
                    },
                  }
                : {}),
            },
          })),
        }
      : null;

  const cityListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Popular Karaoke Cities in ${state.name}`,
    description: `Cities with active karaoke scenes in ${state.name}.`,
    numberOfItems: state.cities.length,
    itemListElement: state.cities.map((city, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "City",
        name: city,
        containedInPlace: {
          "@type": "State",
          name: state.name,
          containedInPlace: { "@type": "Country", name: "United States" },
        },
        url: `${site.url}/${state.slug}/${cityToSlug(city)}/`,
      },
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${site.url}/${state.slug}/`,
    name: `Karaoke in ${state.name}`,
    description: `Find karaoke bars, KTV lounges, and karaoke nights in ${state.name}. Explore venues in ${topCities} and across the ${state.region}.`,
    url: `${site.url}/${state.slug}/`,
    inLanguage: "en-US",
    dateModified: "2026-06-16",
    keywords: `karaoke ${state.name}, karaoke bars ${state.name}, karaoke near me ${state.name}, KTV ${state.name}, ${state.cities.slice(0, 3).map((c) => `karaoke ${c}`).join(", ")}`,
    isPartOf: {
      "@type": "WebSite",
      name: site.name,
      url: site.url,
    },
    about: {
      "@type": "State",
      name: state.name,
      containedInPlace: {
        "@type": "Country",
        name: "United States",
      },
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".lead"],
    },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityListSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            {state.name}
          </nav>
          <h1>Karaoke in {state.name}</h1>
          <p className="lead">{state.intro}</p>
          <div className="map-cta-row">
            {hasListings ? (
              <Link
                href={`/states/${state.slug}/map/`}
                className="btn btn-primary"
              >
                View {state.name} Karaoke Map
              </Link>
            ) : (
              <Link
                className="btn btn-primary"
                href={mapsSearch(state.capital, state.name)}
              >
                View {state.name} Karaoke Map
              </Link>
            )}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <h2>Karaoke Near You in {state.name}</h2>
            <p>
              {state.name} is part of the {state.region} and our directory
              currently highlights {state.cities.length}{" "}
              {state.cities.length === 1 ? "city" : "cities"} known for
              karaoke, centered on the area around the state capital,{" "}
              {state.capital}. Select a city below to open a live local map of
              nearby karaoke bars, lounges, and private rooms so you can see
              what is open and close to you right now.
            </p>
            <p>{regionExpectation(state.region, state.name)}</p>

            <h2>The Karaoke Scene in {state.name}</h2>
            <p>{state.scene}</p>

            <h2>Types of Karaoke in {state.name}</h2>
            <p>{karaokeTypesText(state.slug, state.name, state.cities)}</p>

            <h2>Popular Karaoke Cities in {state.name}</h2>
            <p>
              These cities have some of the most active karaoke scenes in the
              state. Tap any city to find karaoke near you on the map.
            </p>
          </div>

          <ul className="city-list">
            {state.cities.map((city) => (
              <li key={city}>
                <Link href={`/${state.slug}/${cityToSlug(city)}/`}>
                  <span className="city-list-name">{city}</span>
                  <span className="city-list-cta">
                    Explore
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 17L17 7M17 7H8M17 7v9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {featured.length > 0 && (
            <div style={{ marginTop: "3.5rem" }}>
              <h2>Karaoke Venues in {state.name}</h2>
              <p className="muted">
                {stateListings.length} {state.name} venues are featured in our
                directory. Here are some of the most reviewed.
              </p>
              <div className="grid grid-3" style={{ marginTop: "1.6rem" }}>
                {featured.map((l) => (
                  <Link
                    key={l.slug}
                    href={listingUrl(l)}
                    className="listing-card"
                  >
                    <span className="listing-card-name">{l.name}</span>
                    <span className="listing-card-meta">
                      {l.type ?? "Karaoke venue"} · {l.city}
                    </span>
                    {l.rating != null && (
                      <StarRating
                        rating={l.rating}
                        reviews={l.reviews}
                        size={14}
                      />
                    )}
                  </Link>
                ))}
              </div>
              <div style={{ marginTop: "1.6rem" }}>
                <Link href="/listings/" className="btn btn-secondary">
                  View all {stateListings.length} karaoke venues in {state.name}
                </Link>
              </div>
              {listingCities.length > 1 && (
                <div style={{ marginTop: "2rem" }}>
                  <h3 style={{ marginBottom: "0.8rem" }}>Browse by City</h3>
                  <div className="chip-row">
                    {listingCities.map((c) => (
                      <Link key={c.slug} href={`/${state.slug}/${c.slug}/`} className="chip">
                        {c.name} ({c.count})
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="prose" style={{ marginTop: "3.5rem" }}>
            <h2>
              Frequently Asked Questions About Karaoke in {state.name}
            </h2>
            {faqs.map((faq) => (
              <div key={faq.question} style={{ marginBottom: "1.75rem" }}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="prose" style={{ marginTop: "3rem" }}>
            <h2>Tips for a Great Karaoke Night in {state.name}</h2>
            <ul>
              <li>
                Call ahead or check social media for the venue&apos;s karaoke
                schedule, as nights and hosts can change week to week.
              </li>
              <li>
                Arrive early on weekends. Popular {state.name} spots fill up
                fast, and the sign-up list grows quickly once the night begins.
              </li>
              <li>
                For groups and celebrations, look for private-room karaoke
                {ktvStates.has(state.slug)
                  ? `—widely available in ${state.cities[0]}—`
                  : " where available "}
                so you can sing on your own schedule without waiting in a
                crowd queue.
              </li>
              <li>
                Have a backup song ready in case your first choice is not in
                the venue&apos;s catalog. Most hosts appreciate singers who
                come prepared with two or three options.
              </li>
              <li>
                Tip your karaoke host. Hosts manage the sound, keep the
                night running smoothly, and often reward enthusiastic
                tippers with a bump up the list—it is good etiquette and
                makes the whole room more fun.
              </li>
            </ul>

            <div
              className="finder-result"
              style={{ marginTop: "2rem", borderStyle: "solid" }}
            >
              <strong>Looking somewhere more specific?</strong>
              <p style={{ margin: "0.5rem 0 0" }}>
                Use the{" "}
                <Link href="/karaoke-finder/">Karaoke Finder</Link> to search
                by any city, or{" "}
                <Link href={mapsSearch(state.capital, state.name)}>
                  view karaoke across {state.name}
                </Link>{" "}
                on the map.
              </p>
            </div>
          </div>

          {related.length > 0 && (
            <div style={{ marginTop: "3.5rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>
                More karaoke in the {state.region}
              </h3>
              <div className="chip-row">
                {related.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}/`}
                    className="chip"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
