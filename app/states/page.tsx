import type { Metadata } from "next";
import Link from "next/link";
import { regions, statesByRegion, states } from "@/lib/states";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Karaoke By State | Browse All States",
  description:
    "Browse karaoke bars and locations by state. Explore all 50 states plus Washington, D.C. and find local karaoke venues near you.",
  alternates: { canonical: "/states/" },
};

export default function StatesPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Karaoke by State",
    itemListElement: states.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Karaoke in ${s.name}`,
      url: `${site.url}/states/${s.slug}/`,
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
            States
          </nav>
          <h1>Karaoke By State</h1>
          <p className="lead">
            Explore karaoke bars and locations across all 50 states and
            Washington, D.C. Select a state to see its most active cities and
            local karaoke tips.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {regions.map((region) => (
            <div className="region-block" key={region}>
              <h3>{region}</h3>
              <div className="grid grid-states">
                {statesByRegion(region).map((s) => (
                  <Link
                    key={s.slug}
                    href={`/states/${s.slug}/`}
                    className="state-card"
                  >
                    <span className="name">{s.name}</span>
                    <span className="abbr">{s.abbr}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
