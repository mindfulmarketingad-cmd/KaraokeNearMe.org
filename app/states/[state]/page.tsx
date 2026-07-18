import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateBySlug, states } from "@/lib/states";
import { listingsByState, sortByProminence } from "@/lib/listings";
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
  return {
    title: `Karaoke in ${state.name} | Karaoke Bars & Locations`,
    description: `Find karaoke near you in ${state.name}. Explore popular karaoke cities including ${state.cities
      .slice(0, 3)
      .join(", ")}, plus local tips for a great night out.`,
    alternates: { canonical: `/states/${state.slug}/` },
  };
}

// Build a Google Maps search link for finding karaoke in a given city. This
// sends visitors to a live, up-to-date map rather than to fabricated listings.
function mapsSearch(city: string, stateName: string): string {
  const q = encodeURIComponent(`karaoke near ${city}, ${stateName}`);
  return `https://www.google.com/maps/search/${q}`;
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  // Surrounding states in the same region for cross-navigation.
  const related = states
    .filter((s) => s.region === state.region && s.slug !== state.slug)
    .slice(0, 6);

  // Directory listings we have for this state, most prominent first.
  const stateListings = listingsByState(state.slug).sort(sortByProminence);
  const featured = stateListings.slice(0, 6);
  // States we have venues for get an on-site, Google-Maps-style map page; the
  // rest fall back to a live Google Maps search.
  const hasListings = stateListings.length > 0;

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
        name: "States",
        item: site.url + "/states/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: state.name,
        item: `${site.url}/states/${state.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/states/">States</Link>
            <span>/</span>
            {state.name}
          </nav>
          <h1>Karaoke in {state.name}</h1>
          <p className="lead">{state.intro}</p>
          <div className="map-cta-row">
            {hasListings ? (
              <Link href={`/states/${state.slug}/map/`} className="btn btn-primary">
                View {state.name} Karaoke Map
              </Link>
            ) : (
              <a
                className="btn btn-primary"
                href={mapsSearch(state.capital, state.name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View {state.name} Karaoke Map
              </a>
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

            <h2>Popular Karaoke Cities in {state.name}</h2>
            <p>
              These cities have some of the most active karaoke scenes in the
              state. Tap any city to find karaoke near you on the map.
            </p>
          </div>

          <ul className="city-list">
            {state.cities.map((city) => (
              <li key={city}>
                <a
                  href={mapsSearch(city, state.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="city-list-name">{city}</span>
                  <span className="city-list-cta">
                    Map
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
                </a>
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
                    href={`/partners/${l.slug}/`}
                    className="listing-card"
                  >
                    <span className="listing-card-name">{l.name}</span>
                    <span className="listing-card-meta">
                      {l.type ?? "Karaoke venue"} · {l.city}
                    </span>
                    {l.rating != null && (
                      <StarRating rating={l.rating} reviews={l.reviews} size={14} />
                    )}
                  </Link>
                ))}
              </div>
              <div style={{ marginTop: "1.6rem" }}>
                <Link href="/partners/" className="btn btn-secondary">
                  View all listings
                </Link>
              </div>
            </div>
          )}

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
                For groups and celebrations, look for private-room karaoke where
                available so you can sing on your own schedule.
              </li>
              <li>
                Have a backup song ready in case your first choice is not in the
                venue&apos;s catalog.
              </li>
            </ul>

            <div
              className="finder-result"
              style={{ marginTop: "2rem", borderStyle: "solid" }}
            >
              <strong>Looking somewhere more specific?</strong>
              <p style={{ margin: "0.5rem 0 0" }}>
                Use the{" "}
                <Link href="/karaoke-finder/">Karaoke Finder</Link> to search by
                any city, or{" "}
                <a
                  href={mapsSearch(state.capital, state.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  view karaoke across {state.name}
                </a>{" "}
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
                  <Link key={s.slug} href={`/states/${s.slug}/`} className="chip">
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
