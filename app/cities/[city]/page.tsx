import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allCities,
  getCityInfo,
  listingsByCity,
  citiesForState,
  sortByProminence,
  mapsPlaceUrl,
  telHref,
  priceLabel,
} from "@/lib/listings";
import { getStateBySlug } from "@/lib/states";
import StarRating from "@/components/StarRating";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return allCities().map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityInfo(citySlug);
  if (!city) return {};
  const stateCode = city.stateCode ?? city.state;
  return {
    title: `Karaoke in ${city.name}, ${stateCode} | Bars, KTV & Venues`,
    description: `Find the best karaoke bars and KTV lounges in ${city.name}, ${city.state}. Browse ${city.count} local venue${city.count !== 1 ? "s" : ""} with ratings, hours, and directions.`,
    alternates: { canonical: `/cities/${city.slug}/` },
    openGraph: {
      title: `Karaoke in ${city.name}, ${stateCode}`,
      description: `Browse ${city.count} karaoke venue${city.count !== 1 ? "s" : ""} in ${city.name}, ${city.state} — ratings, hours, addresses, and directions.`,
      url: `/cities/${city.slug}/`,
      type: "website",
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCityInfo(citySlug);
  if (!city) notFound();

  const venues = listingsByCity(citySlug).sort(sortByProminence);
  const state = getStateBySlug(city.stateSlug);
  const nearbyCities = citiesForState(city.stateSlug)
    .filter((c) => c.slug !== citySlug)
    .slice(0, 8);

  const stateCode = city.stateCode ?? city.state;
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`karaoke near ${city.name}, ${city.state}`)}`;
  const mapsGoUrl = `/go/?to=${encodeURIComponent(mapsSearchUrl)}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
      { "@type": "ListItem", position: 2, name: "States", item: site.url + "/states/" },
      ...(state
        ? [{ "@type": "ListItem", position: 3, name: state.name, item: `${site.url}/states/${state.slug}/` }]
        : []),
      {
        "@type": "ListItem",
        position: state ? 4 : 3,
        name: city.name,
        item: `${site.url}/cities/${city.slug}/`,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Karaoke Venues in ${city.name}, ${city.state}`,
    description: `Top-rated karaoke bars, KTV lounges, and karaoke venues in ${city.name}, ${city.state}.`,
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
              addressLocality: city.name,
              addressRegion: stateCode,
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
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What are the best karaoke bars in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${city.name} has ${venues.length} karaoke venue${venues.length !== 1 ? "s" : ""} in our directory${venues[0] ? `, including ${venues[0].name}${venues[1] ? ` and ${venues[1].name}` : ""}` : ""}. Browse the full list above to compare ratings and hours.`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I find karaoke near me in ${city.name}, ${city.state}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Use the map link on each venue card above to get directions, or tap "View on Map" to see all karaoke spots near ${city.name} on Google Maps at once.`,
        },
      },
      {
        "@type": "Question",
        name: `Are there private karaoke rooms (KTV) in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Some venues in ${city.name} offer private karaoke rooms. Check the "Services Offered" section on each venue's listing page for details on room availability and booking.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/states/">States</Link>
            <span>/</span>
            {state ? (
              <>
                <Link href={`/states/${state.slug}/`}>{state.name}</Link>
                <span>/</span>
              </>
            ) : null}
            {city.name}
          </nav>
          <h1>Karaoke in {city.name}, {stateCode}</h1>
          <p className="lead">
            {venues.length} karaoke venue{venues.length !== 1 ? "s" : ""} in {city.name}, {city.state} — browse
            ratings, hours, and get directions to find the perfect spot tonight.
          </p>
          <div className="map-cta-row">
            <Link className="btn btn-primary" href={mapsGoUrl}>
              View Karaoke Map of {city.name}
            </Link>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <h2>Karaoke Venues in {city.name}</h2>
            <p>
              Below are all the karaoke bars, KTV lounges, and karaoke-friendly spots
              we track in {city.name}, {city.state}. Each listing shows the venue&apos;s
              Google rating, address, hours, and services offered so you can choose
              the right fit for your night. Tap any card to see the full listing.
            </p>
          </div>

          <div className="grid grid-3" style={{ marginTop: "2rem" }}>
            {venues.map((v) => {
              const price = priceLabel(v.priceRange);
              return (
                <Link key={v.slug} href={`/listings/${v.slug}/`} className="listing-card">
                  <span className="listing-card-name">{v.name}</span>
                  <span className="listing-card-meta">
                    {v.type ?? "Karaoke venue"}
                    {price ? ` · ${price}` : ""}
                  </span>
                  {v.address && (
                    <span className="listing-card-meta" style={{ fontSize: "0.8rem", opacity: 0.75 }}>
                      {v.address}
                    </span>
                  )}
                  {v.rating != null && (
                    <StarRating rating={v.rating} reviews={v.reviews} size={14} />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="prose" style={{ marginTop: "3.5rem" }}>
            <h2>Frequently Asked Questions</h2>
            <h3>What are the best karaoke bars in {city.name}?</h3>
            <p>
              {city.name} has {venues.length} karaoke venue{venues.length !== 1 ? "s" : ""} in
              our directory{venues[0] ? `, including ${venues[0].name}${venues[1] ? ` and ${venues[1].name}` : ""}` : ""}. The
              venues above are ranked by Google review volume and rating, so the most-reviewed
              spots appear first.
            </p>
            <h3>Where can I find karaoke near me in {city.name}?</h3>
            <p>
              Use the <Link href={mapsGoUrl}>karaoke map for {city.name}</Link> to see all
              nearby spots at once, or tap any venue card above to get directions.
              You can also use the <Link href="/karaoke-finder/">Karaoke Finder</Link> to
              search by city name across all 50 states.
            </p>
            <h3>Are there private karaoke rooms (KTV) in {city.name}?</h3>
            <p>
              Some venues in {city.name} offer private karaoke rooms. Check the
              &ldquo;Services Offered&rdquo; section on each venue&apos;s listing page
              for details on room availability and booking.
            </p>
          </div>

          {nearbyCities.length > 0 && (
            <div style={{ marginTop: "3.5rem" }}>
              <h2>Other Karaoke Cities in {city.state}</h2>
              <div className="chip-row" style={{ marginTop: "1.2rem" }}>
                {nearbyCities.map((c) => (
                  <Link key={c.slug} href={`/cities/${c.slug}/`} className="chip">
                    {c.name} ({c.count})
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="explore-more" style={{ marginTop: "3rem" }}>
            {state && (
              <Link href={`/states/${state.slug}/`} className="btn btn-secondary">
                All karaoke in {state.name}
              </Link>
            )}
            <Link href="/listings/" className="btn btn-secondary">
              Full venue directory
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
