import type { Metadata } from "next";
import Link from "next/link";
import { states } from "@/lib/states";
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
      url: `${site.url}/find/karaoke-${s.slug}/`,
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
          <ul className="plain-link-list">
            {states.map((s) => (
              <li key={s.slug}>
                <Link href={`/find/karaoke-${s.slug}/`}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
