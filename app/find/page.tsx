import type { Metadata } from "next";
import Link from "next/link";
import { findPagesOfKind, FindPageKind } from "@/lib/listings";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find Karaoke By City",
  description:
    "Find karaoke bars and locations in your city. Browse full-screen search maps of karaoke venues across the United States, city by city.",
  alternates: { canonical: "/find/" },
};

const SECTIONS: { kind: FindPageKind; heading: string }[] = [
  { kind: "city", heading: "Karaoke By City" },
  { kind: "private-rooms", heading: "Private Karaoke Rooms" },
  { kind: "family", heading: "Family Karaoke" },
  { kind: "queer-friendly", heading: "Queer Friendly Karaoke" },
  { kind: "daytime", heading: "Daytime Karaoke" },
  { kind: "dine-in", heading: "Dine In Karaoke" },
  { kind: "hispanic", heading: "Hispanic Karaoke" },
  { kind: "bowling", heading: "Bowling and Karaoke" },
  { kind: "korean", heading: "Korean Karaoke" },
  { kind: "live-band", heading: "Live Band Karaoke" },
  { kind: "best", heading: "Best Karaoke" },
  { kind: "best-bars", heading: "Best Karaoke Bars" },
  { kind: "best-restaurants", heading: "Best Karaoke Restaurants" },
  { kind: "top-rated", heading: "Top Rated Karaoke" },
  { kind: "ktv", heading: "KTV" },
  { kind: "lounge", heading: "Karaoke Lounge" },
  { kind: "spots", heading: "Karaoke Spots" },
  { kind: "24-hour", heading: "24 Hour Karaoke" },
  { kind: "competitions", heading: "Karaoke Competitions" },
  { kind: "open-now", heading: "Karaoke Open Now" },
  { kind: "open-weekends", heading: "Karaoke Open On Weekends" },
  { kind: "friday", heading: "Karaoke Friday" },
  { kind: "saturday", heading: "Karaoke Saturday" },
  { kind: "sunday", heading: "Karaoke Sunday" },
  { kind: "monday", heading: "Karaoke Monday" },
  { kind: "tuesday", heading: "Karaoke Tuesday" },
  { kind: "wednesday", heading: "Karaoke Wednesday" },
  { kind: "thursday", heading: "Karaoke Thursday" },
];

export default function FindHubPage() {
  const allCities = findPagesOfKind("city");

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Find Karaoke By City",
    itemListElement: allCities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Karaoke in ${c.city}, ${c.stateCode ?? c.state}`,
      url: `${site.url}/find/${c.findSlug}/`,
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
            Find
          </nav>
          <h1>Find Karaoke By City</h1>
          <p className="lead">
            Every city below has its own full-screen search map of karaoke
            bars and locations. Pick a city to see venues, ratings, and
            directions.
          </p>
        </div>
      </div>

      {SECTIONS.map(({ kind, heading }) => {
        const cities = findPagesOfKind(kind);
        if (cities.length === 0) return null;
        return (
          <section className="section" key={kind}>
            <div className="container">
              <h2>{heading}</h2>
              <div className="grid grid-3" style={{ marginTop: "1.4rem" }}>
                {cities.map((c) => (
                  <Link
                    key={c.findSlug}
                    href={`/find/${c.findSlug}/`}
                    className="listing-card"
                  >
                    <span className="listing-card-name">
                      {c.city}, {c.stateCode ?? c.state}
                    </span>
                    <span className="listing-card-meta">
                      {c.count} {c.count === 1 ? "location" : "locations"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
