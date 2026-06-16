import type { Metadata } from "next";
import Link from "next/link";
import { allCities, statesWithListings } from "@/lib/listings";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Karaoke by City | Local Venues & Bars",
  description:
    "Browse karaoke bars and KTV venues by city. Find local karaoke spots with ratings, hours, and directions in cities across the United States.",
  alternates: { canonical: "/cities/" },
};

export default function CitiesIndexPage() {
  const cities = allCities();
  const stateLinks = statesWithListings();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Karaoke Cities",
    numberOfItems: cities.length,
    itemListElement: cities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${c.name}, ${c.stateCode ?? c.state}`,
      url: `${site.url}/cities/${c.slug}/`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Cities
          </nav>
          <h1>Karaoke by City</h1>
          <p className="lead">
            Browse karaoke venues in {cities.length} cities across the United
            States. Select a city to see all local karaoke bars, KTV lounges,
            and ratings.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <h2>Cities with Karaoke Venues</h2>
          <div className="grid grid-3" style={{ marginTop: "1.6rem" }}>
            {cities.map((c) => (
              <Link key={c.slug} href={`/cities/${c.slug}/`} className="feature">
                <h3 style={{ marginBottom: "0.3rem" }}>
                  {c.name}, {c.stateCode ?? c.state}
                </h3>
                <p style={{ marginBottom: "0.8rem", fontSize: "0.9rem" }}>
                  {c.count} karaoke venue{c.count !== 1 ? "s" : ""} in our directory
                </p>
                <span className="muted" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Browse venues &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {stateLinks.length > 1 && (
        <section className="section section--alt">
          <div className="container">
            <h2>Browse by State</h2>
            <p className="lead">
              Explore all karaoke cities and venues organized by state.
            </p>
            <div className="chip-row" style={{ marginTop: "1.4rem" }}>
              {stateLinks.map((s) => (
                <Link key={s.slug} href={`/states/${s.slug}/`} className="chip">
                  {s.name} ({s.count})
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
