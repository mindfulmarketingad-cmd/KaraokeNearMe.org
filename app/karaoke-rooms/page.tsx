import type { Metadata } from "next";
import Link from "next/link";
import { listings, sortByProminence, listingsByService } from "@/lib/listings";
import { states } from "@/lib/states";
import StarRating from "@/components/StarRating";
import LocationCTA from "@/components/LocationCTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Karaoke Rooms Near Me | Private & KTV Rooms",
  description:
    "Find karaoke rooms near you — private KTV suites and group karaoke rooms across the United States. Book a room by the hour for parties, birthdays, and nights out.",
  alternates: { canonical: "/karaoke-rooms/" },
  openGraph: {
    title: "Karaoke Rooms Near Me | Private & KTV Rooms",
    description:
      "Find private karaoke rooms and KTV lounges near you. Book by the hour for groups, parties, and special occasions.",
    url: "/karaoke-rooms/",
    type: "website",
  },
};

export default function KaraokeRoomsPage() {
  const featured = listingsByService("private-karaoke-rooms").slice(0, 6);
  const topStates = ["new-york", "california", "texas", "new-jersey", "washington", "illinois"];
  const stateLinks = states.filter((s) => topStates.includes(s.slug));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
      { "@type": "ListItem", position: 2, name: "Karaoke Rooms Near Me", item: `${site.url}/karaoke-rooms/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are karaoke rooms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Karaoke rooms, also called KTV rooms or karaoke boxes, are private enclosed spaces you rent by the hour. Your group gets its own room with a microphone, speaker system, and song selection screen — no performing for strangers required.",
        },
      },
      {
        "@type": "Question",
        name: "How much do karaoke rooms cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Karaoke room prices typically range from $15 to $50 per hour depending on room size, location, and the day of the week. Many venues charge per room rather than per person, making it economical for larger groups.",
        },
      },
      {
        "@type": "Question",
        name: "How do I find karaoke rooms near me?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use the Karaoke Finder on KaraokeNearMe.org to search by city, or browse the private rooms directory to find KTV venues with real ratings and hours in your area.",
        },
      },
      {
        "@type": "Question",
        name: "Do karaoke rooms require a reservation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most private karaoke rooms accept walk-ins but reservations are strongly recommended on weekends and holidays. Call ahead or check the venue's website to book your time slot in advance.",
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
            Karaoke Rooms Near Me
          </nav>
          <h1>Karaoke Rooms Near Me</h1>
          <p className="lead">
            Find private karaoke rooms and KTV lounges near you. Book a room by
            the hour for parties, date nights, birthdays, and group outings —
            no crowd audience required.
          </p>
          <div style={{ maxWidth: 460, marginTop: "1.6rem" }}>
            <LocationCTA query="karaoke rooms" label="Karaoke Rooms" />
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <h2>What Are Karaoke Rooms?</h2>
            <p>
              Karaoke rooms — also known as KTV rooms, karaoke boxes, or private
              karaoke suites — give your group its own enclosed space with
              microphones, a professional sound system, and a large touch-screen
              song catalog. Unlike bar-style karaoke where you sing in front of
              strangers, a private room lets you perform exclusively for your
              own group. You book the room by the hour and control everything:
              the song queue, the volume, and the pace of the night.
            </p>
            <p>
              Private karaoke rooms are especially popular for birthday parties,
              bachelorette and bachelor outings, corporate team events, and
              first-time singers who prefer a lower-pressure environment. Most
              venues offer rooms in several sizes — from cozy two-person booths
              to large suites that fit 20 or more guests — and many include food
              and drink service directly to your room.
            </p>

            <h2>How to Find Karaoke Rooms Near You</h2>
            <p>
              Use the <Link href="/karaoke-finder/">Karaoke Finder</Link> to
              search by city and view a live map of private karaoke rooms in
              your area. You can also browse our{" "}
              <Link href="/services/private-karaoke-rooms/">
                private karaoke rooms directory
              </Link>{" "}
              to compare venues by rating, hours, and location. For the largest
              selection of private KTV rooms, check major metros like New York,
              Los Angeles, Chicago, and Houston.
            </p>

            <h2>Karaoke Rooms vs. Karaoke Bars</h2>
            <p>
              Bar-style karaoke puts you on a shared stage in front of the whole
              room — fun for social singers who enjoy the crowd energy. Private
              karaoke rooms flip that dynamic: your group is the entire audience.
              Private rooms cost more per session but offer full control over the
              night, making them the preferred choice for celebrations and groups
              who want a dedicated experience without waiting in a public queue.
            </p>
          </div>

          {featured.length > 0 && (
            <div style={{ marginTop: "3rem" }}>
              <h2>Private Karaoke Room Venues</h2>
              <p className="muted" style={{ marginBottom: "1.6rem" }}>
                Venues in our directory offering private karaoke rooms and KTV suites.
              </p>
              <div className="grid grid-3">
                {featured.map((l) => (
                  <Link key={l.slug} href={`/listings/${l.slug}/`} className="listing-card">
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
              <div style={{ marginTop: "1.6rem" }}>
                <Link href="/services/private-karaoke-rooms/" className="btn btn-secondary">
                  View all private karaoke room venues
                </Link>
              </div>
            </div>
          )}

          <div className="prose" style={{ marginTop: "3.5rem" }}>
            <h2>Frequently Asked Questions</h2>
            <h3>What are karaoke rooms?</h3>
            <p>
              Karaoke rooms are private, enclosed spaces you rent by the hour at
              a KTV venue. Your group gets its own microphones, speaker system,
              and song catalog — no performing for strangers required.
            </p>
            <h3>How much do karaoke rooms cost?</h3>
            <p>
              Prices typically range from $15 to $50 per hour depending on room
              size, location, and day of the week. Most venues charge per room,
              not per person, making it economical for groups of four or more.
            </p>
            <h3>Do karaoke rooms require a reservation?</h3>
            <p>
              Most venues accept walk-ins but reservations are strongly recommended
              on weekends and holidays. Call ahead or book online to secure your
              time slot, especially for groups of six or more.
            </p>
          </div>

          <div style={{ marginTop: "3rem" }}>
            <h2>Browse Karaoke Rooms by State</h2>
            <p className="muted" style={{ marginBottom: "1.2rem" }}>
              Private KTV rooms are most common in large urban markets.
            </p>
            <div className="chip-row">
              {stateLinks.map((s) => (
                <Link key={s.slug} href={`/${s.slug}/`} className="chip">
                  Karaoke rooms in {s.name}
                </Link>
              ))}
              <Link href="/states/" className="chip">
                All states →
              </Link>
            </div>
          </div>

          <div className="explore-more" style={{ marginTop: "3rem" }}>
            <Link href="/karaoke-finder/" className="btn btn-primary">
              Find Rooms Near Me
            </Link>
            <Link href="/private-karaoke/" className="btn btn-secondary">
              Private Karaoke
            </Link>
            <Link href="/karaoke-bars/" className="btn btn-secondary">
              Karaoke Bars
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
