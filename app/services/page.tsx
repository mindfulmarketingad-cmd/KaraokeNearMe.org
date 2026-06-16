import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/listings";
import { serviceContent } from "@/lib/serviceContent";

export const metadata: Metadata = {
  title: "Karaoke Services | Types of Karaoke Venues",
  description:
    "Browse karaoke services and venue types, from karaoke bars and private rooms to piano bars, nightclubs, and DJ-hosted karaoke.",
  alternates: { canonical: "/services/" },
};

export default function ServicesHubPage() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Services
          </nav>
          <h1>Karaoke Services</h1>
          <p className="lead">
            Karaoke comes in many forms. Browse by service type to find the
            experience you are looking for, then compare the venues that offer
            it.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}/`} className="feature">
                <h3 style={{ marginBottom: "0.3rem" }}>{s.label}</h3>
                <p style={{ marginBottom: "0.8rem" }}>
                  {serviceContent[s.slug]?.blurb}
                </p>
                <span className="muted" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {s.count} {s.count === 1 ? "venue" : "venues"} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
