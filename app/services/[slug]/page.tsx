import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  services,
  getService,
  listingsByService,
} from "@/lib/listings";
import { serviceContent } from "@/lib/serviceContent";
import StarRating from "@/components/StarRating";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.label} | Karaoke Directory`,
    description: `Find ${service.label.toLowerCase()} in our karaoke directory. Compare ${service.count} venues by Google rating, location, and hours.`,
    alternates: { canonical: `/services/${service.slug}/` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const providers = listingsByService(service.slug);
  const content = serviceContent[service.slug];
  const others = services.filter((s) => s.slug !== service.slug);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: service.label,
    numberOfItems: providers.length,
    itemListElement: providers.map((l, i) => ({
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
            <Link href="/services/">Services</Link>
            <span>/</span>
            {service.label}
          </nav>
          <h1>{service.label}</h1>
          {content && <p className="lead">{content.intro}</p>}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <h2>
            {providers.length} {providers.length === 1 ? "Venue" : "Venues"}
          </h2>
          <div className="grid grid-3" style={{ marginTop: "1.6rem" }}>
            {providers.map((l) => (
              <Link key={l.slug} href={`/listings/${l.slug}/`} className="listing-card">
                <span className="listing-card-name">{l.name}</span>
                <span className="listing-card-meta">
                  {l.type ?? "Karaoke venue"} · {l.city}
                </span>
                {l.rating != null && (
                  <StarRating rating={l.rating} reviews={l.reviews} size={14} />
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <h2>Other Karaoke Services</h2>
          <div className="chip-row" style={{ marginTop: "1.4rem" }}>
            {others.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}/`} className="chip">
                {s.label} ({s.count})
              </Link>
            ))}
          </div>
          <div className="explore-more">
            <Link href="/partners/" className="btn btn-secondary">
              All listings
            </Link>
            <Link href="/services/" className="btn btn-secondary">
              All services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
