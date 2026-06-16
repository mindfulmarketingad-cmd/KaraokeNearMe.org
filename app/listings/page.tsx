import type { Metadata } from "next";
import Link from "next/link";
import {
  listings,
  services,
  statesWithListings,
  sortByProminence,
} from "@/lib/listings";
import ListingsBrowser, { SlimListing } from "@/components/ListingsBrowser";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Karaoke Listings | Local Karaoke Bars & Venues",
  description:
    "Browse our directory of karaoke bars and venues. Search by city or service and view ratings, hours, and locations for each spot.",
  alternates: { canonical: "/listings/" },
};

export default function ListingsHubPage() {
  const items: SlimListing[] = [...listings].sort(sortByProminence).map((l) => ({
    slug: l.slug,
    name: l.name,
    type: l.type,
    city: l.city,
    citySlug: l.citySlug,
    state: l.state,
    rating: l.rating,
    reviews: l.reviews,
  }));

  const states = statesWithListings();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Karaoke Listings",
    numberOfItems: listings.length,
    itemListElement: items.slice(0, 50).map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: l.name,
      url: `${site.url}/listings/${l.slug}/`,
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
            Listings
          </nav>
          <h1>Karaoke Listings</h1>
          <p className="lead">
            Explore {listings.length} karaoke bars and venues in our directory.
            Search by name or city, or browse by service below to find the right
            place to sing.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <ListingsBrowser items={items} />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <h2>Browse by Service</h2>
          <p className="lead">Find venues by the type of karaoke experience they offer.</p>
          <div className="chip-row" style={{ marginTop: "1.4rem" }}>
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}/`} className="chip">
                {s.label} ({s.count})
              </Link>
            ))}
          </div>

          {states.length > 1 && (
            <>
              <h2 style={{ marginTop: "3rem" }}>Browse by State</h2>
              <div className="chip-row" style={{ marginTop: "1.4rem" }}>
                {states.map((s) => (
                  <Link key={s.slug} href={`/states/${s.slug}/`} className="chip">
                    {s.name} ({s.count})
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
