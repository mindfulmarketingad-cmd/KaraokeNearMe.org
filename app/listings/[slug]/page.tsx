import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getListing,
  listings,
  similarListings,
  telHref,
  mapsEmbedUrl,
  mapsPlaceUrl,
  priceLabel,
} from "@/lib/listings";
import { getStateBySlug } from "@/lib/states";
import StarRating from "@/components/StarRating";
import HoursTable from "@/components/HoursTable";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const l = getListing(slug);
  if (!l) return {};
  const type = (l.type ?? "karaoke venue").toLowerCase();
  return {
    title: { absolute: `${l.name} – ${l.city}, ${l.state}` },
    description: `${l.name} is a ${type} in ${l.city}, ${l.state}. See its Google rating, reviews, hours, services offered, and location on the map.`,
    alternates: { canonical: `/listings/${l.slug}/` },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const l = getListing(slug);
  if (!l) notFound();

  const similar = similarListings(l, 6);
  const state = getStateBySlug(l.stateSlug);
  const price = priceLabel(l.priceRange);

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: l.name,
    url: `${site.url}/listings/${l.slug}/`,
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
      { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
      { "@type": "ListItem", position: 2, name: "Listings", item: site.url + "/listings/" },
      {
        "@type": "ListItem",
        position: 3,
        name: l.name,
        item: `${site.url}/listings/${l.slug}/`,
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
            <Link href="/listings/">Listings</Link>
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
                  ? `“${l.description}”`
                  : `“Rated ${l.rating?.toFixed(1) ?? "highly"} out of 5 by ${
                      l.reviews?.toLocaleString() ?? "local"
                    } guests on Google.”`}
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
                    Visit website
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

      <section className="section">
        <div className="container">
          {similar.length > 0 && (
            <>
              <h2>Similar Karaoke Spots Near {l.city}</h2>
              <div className="grid grid-3" style={{ marginTop: "1.6rem" }}>
                {similar.map((s) => (
                  <Link key={s.slug} href={`/listings/${s.slug}/`} className="listing-card">
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
              <Link href={`/states/${state.slug}/`} className="btn btn-secondary">
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
