import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { listingsByState, sortByProminence, statesWithListings } from "@/lib/listings";
import StateMapExplorer, { MapListing } from "@/components/StateMapExplorer";
import { site } from "@/lib/site";

// Only states that actually have venues in our directory get an on-site map
// page. Every other state's map CTA links straight to Google Maps instead.
export function generateStaticParams() {
  return statesWithListings().map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};
  const count = listingsByState(state.slug).length;
  return {
    title: `Karaoke Map of ${state.name} | ${count} Venues`,
    description: `Explore an interactive map of ${count} karaoke bars and venues across ${state.name}. Search by city, see ratings and hours, and get directions.`,
    alternates: { canonical: `/states/${state.slug}/map/` },
  };
}

export default async function StateMapPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const stateListings = listingsByState(state.slug).sort(sortByProminence);
  // The map needs coordinates; drop any venue we can't place.
  const items: MapListing[] = stateListings
    .filter((l) => l.lat != null && l.lng != null)
    .map((l) => ({
      slug: l.slug,
      name: l.name,
      type: l.type,
      city: l.city,
      citySlug: l.citySlug,
      address: l.address,
      lat: l.lat as number,
      lng: l.lng as number,
      rating: l.rating,
      reviews: l.reviews,
      priceRange: l.priceRange,
      phone: l.phone,
      website: l.website,
      hours: l.hours,
    }));

  if (items.length === 0) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
      { "@type": "ListItem", position: 2, name: "States", item: site.url + "/states/" },
      {
        "@type": "ListItem",
        position: 3,
        name: state.name,
        item: `${site.url}/${state.slug}/`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Map",
        item: `${site.url}/states/${state.slug}/map/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="map-page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/states/">States</Link>
            <span>/</span>
            <Link href={`/${state.slug}/`}>{state.name}</Link>
            <span>/</span>
            Map
          </nav>
          <h1>Karaoke Map of {state.name}</h1>
          <p className="muted" style={{ margin: 0 }}>
            {items.length} karaoke {items.length === 1 ? "venue" : "venues"} across{" "}
            {state.name}. Search, filter by city, and click a venue to see it on the map.
          </p>
        </div>
      </div>

      <StateMapExplorer stateName={state.name} items={items} />
    </>
  );
}
