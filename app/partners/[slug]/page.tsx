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
import { buildPartnerContent } from "@/lib/partnerContent";
import StarRating from "@/components/StarRating";
import HoursTable from "@/components/HoursTable";
import ClaimBusinessButton from "@/components/ClaimBusinessButton";
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
  const description = `${l.name} is a ${type} in ${l.city}, ${l.state}. See its Google rating, reviews, hours, services offered, and location on the map.`;
  const socialImage = l.photoUrl ?? `${site.url}/hero.jpg`;
  return {
    title: { absolute: `${l.name} – ${l.city}, ${l.state}` },
    description,
    alternates: { canonical: `/partners/${l.slug}/` },
    openGraph: { images: [{ url: socialImage }] },
    twitter: { card: "summary_large_image", images: [socialImage] },
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
  const content = buildPartnerContent(l);

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: l.name,
    url: `${site.url}/partners/${l.slug}/`,
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
    ...(l.photoUrl ? { image: l.photoUrl } : {}),
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
      { "@type": "ListItem", position: 2, name: "Partners", item: site.url + "/partners/" },
      {
        "@type": "ListItem",
        position: 3,
        name: l.name,
        item: `${site.url}/partners/${l.slug}/`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/partners/">Partners</Link>
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

      <section className="section" style={{ paddingTop: 0, paddingBottom: "1.6rem" }}>
        <div className="container">
          <div className="listing-photos">
            {l.photoUrl ? (
              <img
                src={l.photoUrl}
                alt={l.name}
                className="listing-photo-main"
                loading="eager"
              />
            ) : (
              <img
                src="/hero.jpg"
                alt={`Karaoke at a venue like ${l.name}`}
                className="listing-photo-main"
                loading="eager"
              />
            )}
            {l.streetViewUrl && (
              <img
                src={l.streetViewUrl}
                alt={`Street view of ${l.name}`}
                className="listing-photo-street"
                loading="lazy"
              />
            )}
          </div>
          {l.photosCount != null && (
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.6rem" }}>
              {l.photosCount.toLocaleString()} photos on Google
            </p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container listing-layout">
          <div className="listing-main">
            <h2>About {l.name}</h2>
            <p>{l.about}</p>

            <h2>What {l.name} Is Known For</h2>
            <dl className="venue-facts">
              <div className="venue-fact">
                <dt>Specialty</dt>
                <dd>{content.specialty}</dd>
              </div>
              <div className="venue-fact">
                <dt>Known for</dt>
                <dd>{content.knownFor.join(", ")}</dd>
              </div>
              <div className="venue-fact">
                <dt>Best for</dt>
                <dd>{content.bestFor}</dd>
              </div>
              <div className="venue-fact">
                <dt>Keep in mind</dt>
                <dd>{content.keepInMind}</dd>
              </div>
              <div className="venue-fact">
                <dt>Worth knowing</dt>
                <dd>{content.worthKnowing}</dd>
              </div>
            </dl>

            {(content.atmosphereScore != null || content.foodScore != null) && (
              <>
                <h2>Atmosphere &amp; Food Scores</h2>
                <div className="score-row">
                  {content.atmosphereScore != null && (
                    <div className="score">
                      <span className="score-value">
                        {content.atmosphereScore.toFixed(1)}
                        <span className="score-max">/5</span>
                      </span>
                      <span className="score-label">Atmosphere</span>
                    </div>
                  )}
                  {content.foodScore != null && (
                    <div className="score">
                      <span className="score-value">
                        {content.foodScore.toFixed(1)}
                        <span className="score-max">/5</span>
                      </span>
                      <span className="score-label">Food</span>
                    </div>
                  )}
                </div>
                <p className="muted" style={{ fontSize: "0.9rem" }}>
                  <strong>How we score:</strong> {content.scoreBasis}
                </p>
              </>
            )}

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

            <h2>Frequently Asked Questions</h2>
            <div className="venue-faq">
              {content.faqs.map((f) => (
                <div key={f.q} className="venue-faq-item">
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>

            <h2>Karaoke Near {l.name}</h2>
            {similar.length > 0 ? (
              <>
                <p className="muted" style={{ marginTop: "-0.4rem" }}>
                  Other karaoke spots close to {l.name} in and around {l.city}.
                </p>
                <ul className="nearby-list">
                  {similar.slice(0, 5).map((s) => (
                    <li key={s.slug}>
                      <Link href={`/partners/${s.slug}/`}>{s.name}</Link>
                      <span className="muted">
                        {" "}
                        &mdash; {s.type ?? "Karaoke venue"}, {s.city}
                      </span>
                    </li>
                  ))}
                </ul>
                <p>
                  Or see the full map of{" "}
                  <Link href={`/find/karaoke-${l.citySlug}-${(l.stateCode ?? "").toLowerCase()}/`}>
                    karaoke in {l.city}
                  </Link>
                  .
                </p>
              </>
            ) : (
              <p>
                Browse more options on our{" "}
                <Link href="/find/">Find Karaoke by City</Link> maps or the{" "}
                {state && <Link href={`/find/karaoke-${state.slug}/`}>{state.name} directory</Link>}.
              </p>
            )}
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
              {l.bookingUrl && (
                <a
                  className="btn btn-secondary"
                  style={{ width: "100%", textAlign: "center", marginTop: "0.6rem" }}
                  href={l.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book / Order Online
                </a>
              )}
            </div>

            <div className="info-card">
              <h3>Business Hours</h3>
              <HoursTable hours={l.hours} />
            </div>

            <div className="info-card">
              <h3>Own this business?</h3>
              <p className="muted" style={{ fontSize: "0.9rem", marginTop: 0 }}>
                Claim this listing to keep its details accurate and up to
                date. Claims are reviewed before approval.
              </p>
              <ClaimBusinessButton listingSlug={l.slug} listingName={l.name} />
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
          <div className="explore-more">
            {state && (
              <Link href={`/find/karaoke-${state.slug}/`} className="btn btn-secondary">
                Karaoke in {state.name}
              </Link>
            )}
            <Link href="/partners/" className="btn btn-secondary">
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
