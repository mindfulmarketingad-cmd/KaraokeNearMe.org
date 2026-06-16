import type { Metadata } from "next";
import Link from "next/link";
import { listingsByService } from "@/lib/listings";
import { states } from "@/lib/states";
import StarRating from "@/components/StarRating";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Karaoke Bars Near Me | Find Local Karaoke Bars Tonight",
  description:
    "Find karaoke bars near you open tonight. Browse local karaoke bars with Google ratings, hours, and locations across the United States.",
  alternates: { canonical: "/karaoke-bars/" },
  openGraph: {
    title: "Karaoke Bars Near Me | Find Local Karaoke Bars Tonight",
    description:
      "Find karaoke bars near you — browse ratings, hours, and locations for local karaoke bars across the US.",
    url: "/karaoke-bars/",
    type: "website",
  },
};

export default function KaraokeBarsPage() {
  const featured = listingsByService("karaoke-bar").slice(0, 6);
  const topStates = ["new-york", "california", "texas", "florida", "illinois", "nevada"];
  const stateLinks = states.filter((s) => topStates.includes(s.slug));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
      { "@type": "ListItem", position: 2, name: "Karaoke Bars Near Me", item: `${site.url}/karaoke-bars/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I find karaoke bars near me?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use the Karaoke Finder on KaraokeNearMe.org to search by city or state and see a live Google Maps view of karaoke bars near you. You can also browse our directory of rated karaoke bars by location.",
        },
      },
      {
        "@type": "Question",
        name: "What nights do karaoke bars run karaoke?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most karaoke bars run karaoke Thursday through Saturday nights, with some venues adding Tuesday or Wednesday nights. Weekend nights are the busiest — arrive early to get your name near the top of the list.",
        },
      },
      {
        "@type": "Question",
        name: "Is karaoke at bars free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bar-style karaoke is almost always free to participate in. The venue makes its money from food and drink sales, not from a cover charge to sing. Some bars have a cover charge to enter on busy nights, but signing up to sing is typically free.",
        },
      },
    ],
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

      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Karaoke Bars Near Me
          </nav>
          <h1>Karaoke Bars Near Me</h1>
          <p className="lead">
            Find the best karaoke bars near you — open tonight, with real
            Google ratings, hours, and directions. Browse bars by city or
            jump straight to a live local map.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <h2>What to Expect at a Karaoke Bar</h2>
            <p>
              Karaoke bars are the most common and accessible format for singing
              in public. A karaoke host manages the night, maintains a sign-up
              list, and calls singers to the microphone when their turn comes.
              The whole bar is the audience, which creates a social, energetic
              atmosphere that bar-style karaoke is known for. Most karaoke bars
              welcome singers of all skill levels — the crowd is there to have
              fun, not to judge.
            </p>
            <p>
              Karaoke bars typically run their nights on Thursday, Friday, and
              Saturday evenings, though some venues add mid-week nights as well.
              Song libraries at dedicated karaoke bars can include tens of
              thousands of tracks across every genre, from top-40 pop and classic
              rock to country, hip-hop, Broadway, and international music.
            </p>

            <h2>Tips for Your First Karaoke Bar Visit</h2>
            <p>
              Arrive 30 to 45 minutes before karaoke starts on weekend nights —
              the sign-up list fills quickly and getting your name in early means
              a shorter wait before you perform. Have two or three song options
              ready in case your first choice is not available. Tip your karaoke
              host — hosts who feel appreciated tend to keep the night moving
              smoothly and sometimes reward regulars with a bump up the list.
              Most importantly, the bar crowd is on your side: cheers and
              encouragement from strangers are a staple of the karaoke bar
              experience.
            </p>
          </div>

          {featured.length > 0 && (
            <div style={{ marginTop: "3rem" }}>
              <h2>Karaoke Bars in Our Directory</h2>
              <p className="muted" style={{ marginBottom: "1.6rem" }}>
                Dedicated karaoke bars with host-led nights and full song catalogs.
              </p>
              <div className="grid grid-3">
                {featured.map((l) => (
                  <Link key={l.slug} href={`/listings/${l.slug}/`} className="listing-card">
                    <span className="listing-card-name">{l.name}</span>
                    <span className="listing-card-meta">
                      {l.type ?? "Karaoke bar"} · {l.city}, {l.stateCode ?? l.state}
                    </span>
                    {l.rating != null && (
                      <StarRating rating={l.rating} reviews={l.reviews} size={14} />
                    )}
                  </Link>
                ))}
              </div>
              <div style={{ marginTop: "1.6rem" }}>
                <Link href="/services/karaoke-bar/" className="btn btn-secondary">
                  View all karaoke bars
                </Link>
              </div>
            </div>
          )}

          <div className="prose" style={{ marginTop: "3.5rem" }}>
            <h2>Frequently Asked Questions</h2>
            <h3>How do I find karaoke bars near me?</h3>
            <p>
              Use the <Link href="/karaoke-finder/">Karaoke Finder</Link> to
              search by city, or browse our{" "}
              <Link href="/services/karaoke-bar/">karaoke bar directory</Link>{" "}
              to find rated venues with hours and addresses near you.
            </p>
            <h3>What nights do karaoke bars run karaoke?</h3>
            <p>
              Most karaoke bars run Thursday through Saturday nights. Some add
              Tuesday or Wednesday nights. Weekend nights fill fastest — arrive
              early and add your name to the list before the host starts.
            </p>
            <h3>Is karaoke at a bar free?</h3>
            <p>
              Bar-style karaoke is almost always free to participate in. The
              venue earns from food and drink sales. Some bars charge a door fee
              on busy weekend nights, but signing up to sing is free.
            </p>
          </div>

          <div style={{ marginTop: "3rem" }}>
            <h2>Find Karaoke Bars by State</h2>
            <div className="chip-row" style={{ marginBottom: "0.5rem" }}>
              {stateLinks.map((s) => (
                <Link key={s.slug} href={`/${s.slug}/`} className="chip">
                  Karaoke bars in {s.name}
                </Link>
              ))}
              <Link href="/states/" className="chip">
                All states →
              </Link>
            </div>
          </div>

          <div className="explore-more" style={{ marginTop: "3rem" }}>
            <Link href="/karaoke-finder/" className="btn btn-primary">
              Find Bars Near Me
            </Link>
            <Link href="/karaoke-rooms/" className="btn btn-secondary">
              Karaoke Rooms
            </Link>
            <Link href="/private-karaoke/" className="btn btn-secondary">
              Private Karaoke
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
