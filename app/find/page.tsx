import type { Metadata } from "next";
import Link from "next/link";
import { findPages, stateFindPages, FindPageKind } from "@/lib/listings";
import { site } from "@/lib/site";
import FindIndexBrowser, { FindIndexItem } from "@/components/FindIndexBrowser";

export const metadata: Metadata = {
  title: "Find Karaoke By City",
  description:
    "Find karaoke bars and locations in your city. Search and filter every karaoke search-map page on the site, by city, state, or karaoke type.",
  alternates: { canonical: "/find/" },
};

const CATEGORY_LABELS: Record<FindPageKind, string> = {
  city: "Karaoke By City",
  "private-rooms": "Private Karaoke Rooms",
  family: "Family Karaoke",
  "queer-friendly": "Queer Friendly Karaoke",
  daytime: "Daytime Karaoke",
  "dine-in": "Dine In Karaoke",
  hispanic: "Hispanic Karaoke",
  bowling: "Bowling and Karaoke",
  korean: "Korean Karaoke",
  "live-band": "Live Band Karaoke",
  best: "Best Karaoke",
  "top-rated": "Top Rated Karaoke",
  ktv: "KTV",
  lounge: "Karaoke Lounge",
  spots: "Karaoke Spots",
  "24-hour": "24 Hour Karaoke",
  competitions: "Karaoke Competitions",
  "open-now": "Karaoke Open Now",
  "open-weekends": "Karaoke Open On Weekends",
  friday: "Karaoke Friday",
  saturday: "Karaoke Saturday",
  sunday: "Karaoke Sunday",
  monday: "Karaoke Monday",
  tuesday: "Karaoke Tuesday",
  wednesday: "Karaoke Wednesday",
  thursday: "Karaoke Thursday",
  "best-bars": "Best Karaoke Bars",
  "best-restaurants": "Best Karaoke Restaurants",
};

const STATE_CATEGORY = "Karaoke By State";

export default function FindHubPage() {
  const cityPages = findPages();
  const statePages = stateFindPages();

  const items: FindIndexItem[] = [
    ...statePages.map((s) => ({
      href: `/find/${s.findSlug}/`,
      title: `Karaoke in ${s.state}`,
      category: STATE_CATEGORY,
      location: s.state,
      count: s.count,
    })),
    ...cityPages.map((c) => {
      const location = `${c.city}, ${c.stateCode ?? c.state}`;
      const category = CATEGORY_LABELS[c.kind];
      return {
        href: `/find/${c.findSlug}/`,
        title:
          c.kind === "city" ? `Karaoke in ${location}` : `${category} in ${location}`,
        category,
        location,
        count: c.count,
      };
    }),
  ];

  const categories = [
    STATE_CATEGORY,
    ...Array.from(new Set(cityPages.map((c) => CATEGORY_LABELS[c.kind]))).sort((a, b) =>
      a.localeCompare(b)
    ),
  ];

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Find Karaoke By City",
    numberOfItems: items.length,
    itemListElement: items.slice(0, 50).map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: i.title,
      url: `${site.url}${i.href}`,
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
            Every page below is its own full-screen search map of karaoke bars
            and locations. Search, filter by type, or sort to find yours.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <FindIndexBrowser items={items} categories={categories} />
        </div>
      </section>
    </>
  );
}
