import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  states,
  getStateBySlug,
  cityToSlug,
  getCityName,
} from "@/lib/states";
import { listingsByCity, sortByProminence } from "@/lib/listings";
import StarRating from "@/components/StarRating";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return states.flatMap((state) =>
    state.cities.map((city) => ({
      state: state.slug,
      city: cityToSlug(city),
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return {};
  const cityName = getCityName(stateSlug, citySlug);
  if (!cityName) return {};
  return {
    title: `Karaoke in ${cityName}, ${state.abbr} | Bars, KTV & Venues`,
    description: `Find karaoke bars, KTV lounges, and karaoke nights in ${cityName}, ${state.name}. Browse local venues with ratings, hours, and directions — open tonight.`,
    alternates: { canonical: `/${stateSlug}/${citySlug}/` },
    openGraph: {
      title: `Karaoke in ${cityName}, ${state.abbr}`,
      description: `Find karaoke bars and KTV venues in ${cityName}, ${state.name} — ratings, hours, and directions.`,
      url: `/${stateSlug}/${citySlug}/`,
      type: "website",
    },
  };
}

function regionExpectation(region: string, stateName: string, cityName: string): string {
  switch (region) {
    case "Northeast":
      return `Karaoke in ${cityName} follows the ${stateName} tradition of lively, bar-style nights with experienced hosts and enthusiastic crowds. Song catalogs run deep, covering classic rock, pop, country, hip-hop, and Broadway. Audiences are encouraging — strangers cheer for everyone, making it an easy environment for first-timers.`;
    case "South":
      return `Southern hospitality is on full display at karaoke nights in ${cityName}. Expect friendly crowds who cheer for every singer regardless of skill level, and hosts who know the regulars by name and welcome newcomers with equal warmth. The atmosphere is relaxed, social, and genuinely fun.`;
    case "Midwest":
      return `Karaoke in ${cityName} keeps things unpretentious and genuinely fun. Most venues run host-led open-mic-style nights where anyone can add their name to the list and take the microphone. No prior experience required — Midwestern crowds are reliably supportive and easy to win over.`;
    case "West":
      return `The karaoke scene in ${cityName} embraces diversity and self-expression. You will find everything from lively dive-bar nights to polished private-room KTV experiences. Hosts are enthusiastic, song libraries are large, and the crowd is supportive across all genres and skill levels.`;
    default:
      return `Karaoke in ${cityName} is a welcoming, crowd-friendly experience. Most venues offer a broad song catalog and a supportive atmosphere where beginners and seasoned performers alike feel right at home.`;
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();

  const cityName = getCityName(stateSlug, citySlug);
  if (!cityName) notFound();

  const venues = listingsByCity(citySlug).sort(sortByProminence);
  const nearbyCities = state.cities
    .filter((c) => cityToSlug(c) !== citySlug)
    .slice(0, 8);

  const mapsQuery = encodeURIComponent(`karaoke near ${cityName}, ${state.name}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const mapsGoUrl = `/go/?to=${encodeURIComponent(mapsUrl)}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "States", item: `${site.url}/states/` },
      { "@type": "ListItem", position: 3, name: state.name, item: `${site.url}/states/${state.slug}/` },
      { "@type": "ListItem", position: 4, name: cityName, item: `${site.url}/${stateSlug}/${citySlug}/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where can I find karaoke near me in ${cityName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Tap the "Find Karaoke in ${cityName}" button above to open a live Google Maps search showing karaoke bars and KTV venues near ${cityName}, ${state.name}. You can also use the Karaoke Finder on KaraokeNearMe.org to search by city name.`,
        },
      },
      {
        "@type": "Question",
        name: `What nights is karaoke available in ${cityName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Karaoke in ${cityName} most commonly runs Thursday through Saturday nights. Some venues add Tuesday or Wednesday karaoke nights. Weekends fill the fastest — arrive 30 to 45 minutes before the host starts to get your name near the top of the sign-up list.`,
        },
      },
      {
        "@type": "Question",
        name: `Are there private karaoke rooms in ${cityName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Private karaoke rooms (KTV) are available at select venues in ${cityName}. Check the venue listings above or search Google Maps for "private karaoke rooms ${cityName}" to find KTV lounges in the area. Private rooms are ideal for birthday parties, group outings, and anyone who prefers singing without a crowd audience.`,
        },
      },
      {
        "@type": "Question",
        name: `Is karaoke free in ${cityName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Bar-style karaoke in ${cityName} is almost always free to participate in — venues earn from food and drink sales. Private karaoke rooms typically charge $15–$50 per hour per room. Some bars add a door charge on busy weekend nights, but signing up to sing is generally free.`,
        },
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${site.url}/${stateSlug}/${citySlug}/`,
    name: `Karaoke in ${cityName}, ${state.name}`,
    description: `Find karaoke bars, KTV lounges, and karaoke nights in ${cityName}, ${state.name}.`,
    url: `${site.url}/${stateSlug}/${citySlug}/`,
    inLanguage: "en-US",
    dateModified: "2026-06-16",
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
    about: {
      "@type": "City",
      name: cityName,
      containedInPlace: {
        "@type": "State",
        name: state.name,
        containedInPlace: { "@type": "Country", name: "United States" },
      },
    },
    breadcrumb: breadcrumbSchema,
  };

  const itemListSchema =
    venues.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Karaoke Venues in ${cityName}, ${state.name}`,
          numberOfItems: venues.length,
          itemListElement: venues.map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "LocalBusiness",
              name: v.name,
              url: `${site.url}/listings/${v.slug}/`,
              address: v.address
                ? {
                    "@type": "PostalAddress",
                    streetAddress: v.address,
                    addressLocality: cityName,
                    addressRegion: state.abbr,
                    addressCountry: "US",
                  }
                : undefined,
              ...(v.rating && v.reviews
                ? {
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: v.rating,
                      reviewCount: v.reviews,
                      bestRating: 5,
                      worstRating: 1,
                    },
                  }
                : {}),
            },
          })),
        }
      : null;

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
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/states/">States</Link>
            <span>/</span>
            <Link href={`/states/${state.slug}/`}>{state.name}</Link>
            <span>/</span>
            {cityName}
          </nav>
          <h1>Karaoke in {cityName}, {state.abbr}</h1>
          <p className="lead">
            {venues.length > 0
              ? `${venues.length} karaoke venue${venues.length !== 1 ? "s" : ""} in ${cityName} — browse ratings, hours, and get directions to find the right spot tonight.`
              : `Find karaoke bars, KTV lounges, and karaoke nights in ${cityName}, ${state.name}. Tap the button below to see all karaoke spots near you on Google Maps.`}
          </p>
          <div className="map-cta-row">
            <Link className="btn btn-primary" href={mapsGoUrl}>
              Find Karaoke in {cityName}
            </Link>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {venues.length > 0 ? (
            <>
              <div className="prose">
                <h2>Karaoke Venues in {cityName}</h2>
                <p>
                  These karaoke bars, KTV lounges, and karaoke-friendly spots are
                  listed in our directory for {cityName}, {state.name}. Each listing
                  includes the venue&apos;s Google rating, address, hours, and
                  services offered.
                </p>
              </div>
              <div className="grid grid-3" style={{ marginTop: "2rem" }}>
                {venues.map((v) => (
                  <Link key={v.slug} href={`/listings/${v.slug}/`} className="listing-card">
                    <span className="listing-card-name">{v.name}</span>
                    <span className="listing-card-meta">
                      {v.type ?? "Karaoke venue"} · {cityName}
                    </span>
                    {v.address && (
                      <span className="listing-card-meta" style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                        {v.address}
                      </span>
                    )}
                    {v.rating != null && (
                      <StarRating rating={v.rating} reviews={v.reviews} size={14} />
                    )}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="prose">
              <h2>Karaoke in {cityName}, {state.name}</h2>
              <p>{state.intro}</p>
            </div>
          )}

          <div className="prose" style={{ marginTop: "3rem" }}>
            <h2>What to Expect at Karaoke in {cityName}</h2>
            <p>{regionExpectation(state.region, state.name, cityName)}</p>

            <h2>Tips for Finding Karaoke in {cityName}</h2>
            <ul>
              <li>
                Tap <strong>Find Karaoke in {cityName}</strong> above to open
                a live Google Maps search showing all nearby karaoke spots with
                real-time hours and ratings.
              </li>
              <li>
                Karaoke nights in {cityName} typically run Thursday through
                Saturday. Arrive 30–45 minutes before the host starts on weekends
                to get near the top of the sign-up list.
              </li>
              <li>
                Have two or three song options ready — song catalogs vary by
                venue. Most karaoke bars in {state.name} cover pop, rock,
                country, and hip-hop, but niche requests may not always be
                available.
              </li>
              <li>
                For groups and special occasions, look for private karaoke rooms
                (KTV) in {cityName}. Call ahead to check availability and reserve
                a room, especially on Friday and Saturday nights.
              </li>
            </ul>
          </div>

          <div className="prose" style={{ marginTop: "3rem" }}>
            <h2>Frequently Asked Questions About Karaoke in {cityName}</h2>

            <h3>Where can I find karaoke near me in {cityName}?</h3>
            <p>
              Tap the <Link href={mapsGoUrl}>karaoke map for {cityName}</Link>{" "}
              to see all nearby karaoke bars and KTV venues on Google Maps. You
              can also use the{" "}
              <Link href="/karaoke-finder/">Karaoke Finder</Link> to search
              by city across all 50 states.
            </p>

            <h3>What nights is karaoke available in {cityName}?</h3>
            <p>
              Most karaoke venues in {cityName} run Thursday through Saturday
              nights. Some spots add Tuesday or Wednesday events. Weekends book
              fast — arrive early to secure a spot on the list.
            </p>

            <h3>Are there private karaoke rooms in {cityName}?</h3>
            <p>
              Private karaoke rooms (KTV) are available at select venues in{" "}
              {cityName}. Search Google Maps for &ldquo;private karaoke rooms{" "}
              {cityName}&rdquo; to find KTV lounges nearby, or visit our{" "}
              <Link href="/private-karaoke/">private karaoke guide</Link> to
              learn more.
            </p>

            <h3>Is karaoke free in {cityName}?</h3>
            <p>
              Bar-style karaoke is almost always free to participate in — venues
              earn from food and drink sales. Private KTV rooms charge $15–$50
              per hour per room. Some bars add a cover on busy weekends, but
              signing up to sing is typically free.
            </p>
          </div>

          {nearbyCities.length > 0 && (
            <div style={{ marginTop: "3.5rem" }}>
              <h2>More Karaoke in {state.name}</h2>
              <div className="chip-row" style={{ marginTop: "1.2rem" }}>
                {nearbyCities.map((c) => (
                  <Link
                    key={c}
                    href={`/${state.slug}/${cityToSlug(c)}/`}
                    className="chip"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="explore-more" style={{ marginTop: "3rem" }}>
            <Link href={`/states/${state.slug}/`} className="btn btn-secondary">
              All karaoke in {state.name}
            </Link>
            <Link href="/listings/" className="btn btn-secondary">
              Venue directory
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
