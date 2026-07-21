import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findPages,
  findPageListings,
  getFindPage,
  stateFindPages,
  getStateFindPage,
  listingsByState,
  citiesForState,
  sortByProminence,
  venueTagSlugs,
  FindPage,
  FindPageKind,
  StateFindPage,
} from "@/lib/listings";
import { getStateBySlug } from "@/lib/states";
import { venueFacetIds } from "@/lib/venueFilters";
import { buildFindContent } from "@/lib/findContent";
import HomeMap, { HomeMapListing } from "@/components/HomeMap";
import StarRating from "@/components/StarRating";
import { site } from "@/lib/site";

// Copy for each pSEO /find/ template. `noun` describes what's being counted
// ("Karaoke locations", "karaoke venues with private rooms", ...) and slots
// into "There are {count} {noun} in {city} {state}."
const TEMPLATE_COPY: Record<
  FindPageKind,
  { title: (city: string, state: string) => string; noun: (count: number) => string }
> = {
  city: {
    title: (city, state) => `Karaoke in ${city} ${state}`,
    noun: (count) => `Karaoke ${count === 1 ? "location" : "locations"}`,
  },
  "private-rooms": {
    title: (city, state) => `Private Karaoke in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "venue" : "venues"} with private rooms`,
  },
  family: {
    title: (city, state) => `Family Karaoke in ${city} ${state}`,
    noun: (count) => `family-friendly karaoke ${count === 1 ? "spot" : "spots"}`,
  },
  "queer-friendly": {
    title: (city, state) => `Queer Friendly Karaoke in ${city} ${state}`,
    noun: (count) => `queer-friendly karaoke ${count === 1 ? "spot" : "spots"}`,
  },
  daytime: {
    title: (city, state) => `Daytime Karaoke in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} open for daytime singing`,
  },
  "dine-in": {
    title: (city, state) => `Dine In Karaoke in ${city} ${state}`,
    noun: (count) => `dine-in karaoke ${count === 1 ? "spot" : "spots"}`,
  },
  hispanic: {
    title: (city, state) => `Hispanic Karaoke in ${city} ${state}`,
    noun: (count) => `Hispanic karaoke ${count === 1 ? "spot" : "spots"}`,
  },
  bowling: {
    title: (city, state) => `Bowling and Karaoke in ${city} ${state}`,
    noun: (count) => `bowling and karaoke ${count === 1 ? "spot" : "spots"}`,
  },
  korean: {
    title: (city, state) => `Korean Karaoke in ${city} ${state}`,
    noun: (count) => `Korean karaoke ${count === 1 ? "spot" : "spots"}`,
  },
  "live-band": {
    title: (city, state) => `Live Band Karaoke in ${city} ${state}`,
    noun: (count) => `live-music karaoke ${count === 1 ? "venue" : "venues"}`,
  },
  best: {
    title: (city, state) => `Best Karaoke in ${city} ${state}`,
    noun: (count) => `well-reviewed karaoke ${count === 1 ? "spot" : "spots"}`,
  },
  "top-rated": {
    title: (city, state) => `Top Rated Karaoke in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} rated 4.5 stars or higher`,
  },
  ktv: {
    title: (city, state) => `KTV in ${city} ${state}`,
    noun: (count) => `KTV ${count === 1 ? "spot" : "spots"}`,
  },
  lounge: {
    title: (city, state) => `Karaoke Lounge in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "lounge" : "lounges"}`,
  },
  spots: {
    title: (city, state) => `Karaoke Spots in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"}`,
  },
  "24-hour": {
    title: (city, state) => `24 Hour Karaoke in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} open 24 hours`,
  },
  competitions: {
    title: (city, state) => `Karaoke Competitions in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "venue" : "venues"} to check for competitions`,
  },
  monday: {
    title: (city, state) => `Karaoke Monday in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} open on Mondays`,
  },
  tuesday: {
    title: (city, state) => `Karaoke Tuesday in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} open on Tuesdays`,
  },
  wednesday: {
    title: (city, state) => `Karaoke Wednesday in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} open on Wednesdays`,
  },
  thursday: {
    title: (city, state) => `Karaoke Thursday in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} open on Thursdays`,
  },
  friday: {
    title: (city, state) => `Karaoke Friday in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} open on Fridays`,
  },
  saturday: {
    title: (city, state) => `Karaoke Saturday in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} open on Saturdays`,
  },
  sunday: {
    title: (city, state) => `Karaoke Sunday in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} open on Sundays`,
  },
  "open-now": {
    title: (city, state) => `Karaoke Open Now in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} with posted hours`,
  },
  "open-weekends": {
    title: (city, state) => `Karaoke Open On Weekends in ${city} ${state}`,
    noun: (count) => `karaoke ${count === 1 ? "spot" : "spots"} open on weekends`,
  },
  "best-bars": {
    title: (city, state) => `Best Karaoke Bars in ${city} ${state}`,
    noun: (count) => `top-rated karaoke ${count === 1 ? "bar" : "bars"}`,
  },
  "best-restaurants": {
    title: (city, state) => `Best Karaoke Restaurants in ${city} ${state}`,
    noun: (count) => `top-rated karaoke ${count === 1 ? "restaurant" : "restaurants"}`,
  },
};

export function generateStaticParams() {
  const citySlugs = findPages().map((p) => p.findSlug);
  const citySet = new Set(citySlugs);
  const stateSlugs = stateFindPages()
    .map((p) => p.findSlug)
    .filter((s) => !citySet.has(s));
  return [...citySlugs, ...stateSlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getFindPage(slug);
  if (page) {
    const copy = TEMPLATE_COPY[page.kind];
    return {
      title: copy.title(page.city, page.state),
      description: `There are ${page.count} ${copy.noun(page.count)} in ${page.city} ${page.state}.`,
      alternates: { canonical: `/find/${slug}/` },
    };
  }
  const statePage = getStateFindPage(slug);
  if (statePage) {
    return {
      title: `Karaoke in ${statePage.state}`,
      description: `Find karaoke bars and locations across ${statePage.state}. Explore an interactive map of ${statePage.count} karaoke venues, search by city, and get directions.`,
      alternates: { canonical: `/find/${slug}/` },
    };
  }
  return {};
}

function breadcrumbLabel(page: FindPage): string {
  return TEMPLATE_COPY[page.kind].title(page.city, page.stateCode ?? page.state);
}

export default async function FindCityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getFindPage(slug);
  if (!page) {
    const statePage = getStateFindPage(slug);
    if (statePage) return <StateFindView statePage={statePage} />;
    notFound();
  }

  const copy = TEMPLATE_COPY[page.kind];
  const cityListings = findPageListings(page);
  const content = buildFindContent(page, cityListings);

  const mapItems: HomeMapListing[] = cityListings
    .filter((l) => l.lat != null && l.lng != null)
    .map((l) => ({
      slug: l.slug,
      name: l.name,
      type: l.type,
      city: l.city,
      citySlug: l.citySlug,
      state: l.state,
      stateCode: l.stateCode,
      stateSlug: l.stateSlug,
      postalCode: l.postalCode,
      lat: l.lat as number,
      lng: l.lng as number,
      rating: l.rating,
      reviews: l.reviews,
      tags: venueTagSlugs(l),
      facets: venueFacetIds(l),
      verified: l.verified,
    }));

  if (mapItems.length === 0) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
      { "@type": "ListItem", position: 2, name: "Find", item: `${site.url}/find/` },
      {
        "@type": "ListItem",
        position: 3,
        name: breadcrumbLabel(page),
        item: `${site.url}/find/${page.findSlug}/`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
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

      <div className="map-page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/find/">Find</Link>
            <span>/</span>
            {page.city}, {page.stateCode ?? page.state}
          </nav>
          <h1>{copy.title(page.city, page.state)}</h1>
          <p className="muted" style={{ margin: 0 }}>
            There are {page.count} {copy.noun(page.count)} in {page.city}{" "}
            {page.state}. Search the map below, or browse the full list
            further down to see ratings, hours, and directions.
          </p>
        </div>
      </div>

      <HomeMap
        items={mapItems}
        scope="local"
        searchPlaceholder={`Search karaoke in ${page.city}`}
        links={[
          { href: "/find/", label: "All Cities" },
          { href: `/states/${page.stateSlug}/`, label: page.state, primary: true },
        ]}
      />

      <section className="section">
        <div className="container">
          <h2>What to Expect</h2>
          <p>{content.intro}</p>

          {content.highlights && (
            <>
              <h2>{content.highlights.heading}</h2>
              <p>{content.highlights.body}</p>
            </>
          )}

          <h2>{page.city} Karaoke Listings</h2>
          <div className="grid grid-3" style={{ marginTop: "1.4rem" }}>
            {cityListings.map((l) => (
              <Link key={l.slug} href={`/partners/${l.slug}/`} className="listing-card">
                <span className="listing-card-name">{l.name}</span>
                <span className="listing-card-meta">
                  {l.type ?? "Karaoke venue"} · {l.city}, {l.stateCode ?? l.state}
                </span>
                <StarRating rating={l.rating} reviews={l.reviews} size={14} />
              </Link>
            ))}
          </div>

          <h2 style={{ marginTop: "2.6rem" }}>{page.city} Karaoke FAQ</h2>
          <div className="prose" style={{ maxWidth: "none" }}>
            {content.faq.map((f) => (
              <div key={f.question}>
                <h3>{f.question}</h3>
                <p>{f.answer}</p>
              </div>
            ))}
          </div>

          <p className="muted" style={{ marginTop: "2rem" }}>
            Looking for karaoke somewhere else? Browse{" "}
            <Link href="/find/">all cities</Link> or all{" "}
            <Link href={`/find/karaoke-${page.stateSlug}/`}>karaoke in {page.state}</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

/* ---- Statewide "Karaoke in [State]" find page ---- */
function StateFindView({ statePage }: { statePage: StateFindPage }) {
  const stateInfo = getStateBySlug(statePage.stateSlug);
  const stateListings = listingsByState(statePage.stateSlug).sort(sortByProminence);
  const cities = citiesForState(statePage.stateSlug);
  const abbr = (statePage.stateCode ?? "").toLowerCase();

  const mapItems: HomeMapListing[] = stateListings
    .filter((l) => l.lat != null && l.lng != null)
    .map((l) => ({
      slug: l.slug,
      name: l.name,
      type: l.type,
      city: l.city,
      citySlug: l.citySlug,
      state: l.state,
      stateCode: l.stateCode,
      stateSlug: l.stateSlug,
      postalCode: l.postalCode,
      lat: l.lat as number,
      lng: l.lng as number,
      rating: l.rating,
      reviews: l.reviews,
      tags: venueTagSlugs(l),
      facets: venueFacetIds(l),
      verified: l.verified,
    }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
      { "@type": "ListItem", position: 2, name: "Find", item: `${site.url}/find/` },
      {
        "@type": "ListItem",
        position: 3,
        name: `Karaoke in ${statePage.state}`,
        item: `${site.url}/find/${statePage.findSlug}/`,
      },
    ],
  };

  const ratedCount = stateListings.filter((l) => l.rating != null).length;
  const topNames = stateListings
    .filter((l) => l.rating != null)
    .slice(0, 3)
    .map((l) => l.name);

  const stateFaqs = [
    {
      q: `How many karaoke venues are in ${statePage.state}?`,
      a: `Our directory lists ${statePage.count} karaoke ${
        statePage.count === 1 ? "venue" : "venues"
      } across ${cities.length} ${
        cities.length === 1 ? "city" : "cities"
      } in ${statePage.state}. Use the map above to search by city or zip code, or filter by karaoke type.`,
    },
    {
      q: `Which cities have the most karaoke in ${statePage.state}?`,
      a:
        cities.length > 0
          ? `${cities
              .slice(0, 3)
              .map((c) => c.name)
              .join(", ")} currently have the most karaoke venues listed in ${statePage.state}. Every city with a listing has its own dedicated map further down this page.`
          : `Browse the map above to see karaoke venues across ${statePage.state}.`,
    },
    {
      q: `What are the best-rated karaoke spots in ${statePage.state}?`,
      a:
        topNames.length > 0
          ? `Of the ${ratedCount} rated ${statePage.state} venues in our directory, the top names right now include ${topNames.join(
              ", "
            )}. Ratings shift over time, so check the map above for the current list sorted highest-rated first.`
          : `Most ${statePage.state} venues in our directory don't have a Google rating yet. Use the map above to browse what's listed and check each venue's own page for reviews.`,
    },
    {
      q: `What's the best way to find karaoke near me in ${statePage.state}?`,
      a: `Search the map above by zip code, city, or karaoke type (private rooms, family-friendly, and more), or switch to list view to scan every venue at once. Each listing links out to hours, ratings, and directions.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: stateFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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

      <div className="map-page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/find/">Find</Link>
            <span>/</span>
            {statePage.state}
          </nav>
          <h1>Karaoke in {statePage.state}</h1>
          <p className="muted" style={{ margin: 0 }}>
            {statePage.count} karaoke {statePage.count === 1 ? "venue" : "venues"} across{" "}
            {statePage.state}. Search the map below, filter by city, and click a venue for
            hours, ratings, and directions.
          </p>
        </div>
      </div>

      <HomeMap
        items={mapItems}
        scope="local"
        searchPlaceholder={`Search karaoke in ${statePage.state}`}
        links={[{ href: "/find/", label: "All Cities", primary: true }]}
      />

      <section className="section">
        <div className="container">
          <h2>Karaoke Across {statePage.state}</h2>
          <p>
            {stateInfo?.intro ??
              `${statePage.state} has karaoke venues spread across ${cities.length} ${
                cities.length === 1 ? "city" : "cities"
              } in our directory. Use the map above to find a spot near you, or pick a city below.`}
          </p>

          {cities.length > 0 && (
            <>
              <h2>Karaoke by City in {statePage.state}</h2>
              <div className="grid grid-3" style={{ marginTop: "1.4rem" }}>
                {cities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/find/karaoke-${c.slug}-${abbr}/`}
                    className="listing-card"
                  >
                    <span className="listing-card-name">{c.name}</span>
                    <span className="listing-card-meta">
                      {c.count} karaoke {c.count === 1 ? "venue" : "venues"}
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}

          <h2 style={{ marginTop: "2.6rem" }}>Top-Rated Karaoke in {statePage.state}</h2>
          <div className="grid grid-3" style={{ marginTop: "1.4rem" }}>
            {stateListings.slice(0, 6).map((l) => (
              <Link key={l.slug} href={`/partners/${l.slug}/`} className="listing-card">
                <span className="listing-card-name">{l.name}</span>
                <span className="listing-card-meta">
                  {l.type ?? "Karaoke venue"} · {l.city}, {l.stateCode ?? l.state}
                </span>
                <StarRating rating={l.rating} reviews={l.reviews} size={14} />
              </Link>
            ))}
          </div>

          <h2 style={{ marginTop: "2.6rem" }}>{statePage.state} Karaoke FAQ</h2>
          <div className="prose" style={{ maxWidth: "none" }}>
            {stateFaqs.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>

          <p className="muted" style={{ marginTop: "2rem" }}>
            Looking somewhere else? Browse{" "}
            <Link href="/find/">karaoke in every city</Link> or use the{" "}
            <Link href="/karaoke-finder/">Karaoke Finder</Link> to search near you.
          </p>
        </div>
      </section>
    </>
  );
}
