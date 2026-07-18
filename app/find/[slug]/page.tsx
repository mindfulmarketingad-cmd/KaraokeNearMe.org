import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findPages,
  findPageListings,
  getFindPage,
  venueTagSlugs,
  FindPage,
  FindPageKind,
} from "@/lib/listings";
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
};

export function generateStaticParams() {
  return findPages().map((p) => ({ slug: p.findSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getFindPage(slug);
  if (!page) return {};
  const copy = TEMPLATE_COPY[page.kind];
  const title = copy.title(page.city, page.state);
  const description = `There are ${page.count} ${copy.noun(page.count)} in ${page.city} ${page.state}.`;
  return {
    title,
    description,
    alternates: { canonical: `/find/${slug}/` },
  };
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
  if (!page) notFound();

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
      state: l.state,
      stateCode: l.stateCode,
      stateSlug: l.stateSlug,
      postalCode: l.postalCode,
      lat: l.lat as number,
      lng: l.lng as number,
      rating: l.rating,
      reviews: l.reviews,
      tags: venueTagSlugs(l),
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
                {l.rating != null && (
                  <StarRating rating={l.rating} reviews={l.reviews} size={14} />
                )}
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
            <Link href="/find/">all cities</Link> or the full{" "}
            <Link href={`/states/${page.stateSlug}/`}>{page.state} directory</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
