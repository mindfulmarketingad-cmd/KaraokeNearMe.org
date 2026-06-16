import type { Metadata } from "next";
import Link from "next/link";
import { states, cityToSlug } from "@/lib/states";
import { regions, statesByRegion } from "@/lib/states";

export const metadata: Metadata = {
  title: "Karaoke by City | Browse All Cities",
  description:
    "Find karaoke bars and KTV venues in cities across all 50 states. Browse by city to discover local karaoke spots, ratings, and directions.",
  alternates: { canonical: "/cities/" },
};

export default function CitiesIndexPage() {
  const totalCities = states.reduce((sum, s) => sum + s.cities.length, 0);

  return (
    <>
      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Cities
          </nav>
          <h1>Karaoke by City</h1>
          <p className="lead">
            Browse karaoke venues in {totalCities} cities across all 50 states.
            Select a city to find local bars, KTV lounges, and karaoke nights near you.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {regions.map((region) => (
            <div key={region} style={{ marginBottom: "3.5rem" }}>
              <h2 style={{ marginBottom: "1.5rem" }}>{region}</h2>
              {statesByRegion(region).map((state) => (
                <div key={state.slug} style={{ marginBottom: "1.8rem" }}>
                  <h3 style={{ marginBottom: "0.7rem" }}>
                    <Link href={`/${state.slug}/`}>{state.name}</Link>
                  </h3>
                  <div className="chip-row">
                    {state.cities.map((city) => (
                      <Link
                        key={city}
                        href={`/${state.slug}/${cityToSlug(city)}/`}
                        className="chip"
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
