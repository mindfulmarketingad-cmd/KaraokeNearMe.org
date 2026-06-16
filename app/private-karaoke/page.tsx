import type { Metadata } from "next";
import Link from "next/link";
import { listingsByService } from "@/lib/listings";
import { states } from "@/lib/states";
import StarRating from "@/components/StarRating";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Private Karaoke Rooms Near Me | Book a Private Room",
  description:
    "Find private karaoke rooms near you. Book a KTV suite by the hour for birthdays, parties, and group outings — no strangers, no waiting in a public queue.",
  alternates: { canonical: "/private-karaoke/" },
  openGraph: {
    title: "Private Karaoke Rooms Near Me | Book a Private Room",
    description:
      "Book a private karaoke room near you. KTV suites by the hour for parties, birthdays, and group outings.",
    url: "/private-karaoke/",
    type: "website",
  },
};

export default function PrivateKaraokeePage() {
  const featured = listingsByService("private-karaoke-rooms").slice(0, 6);
  const topStates = ["new-york", "california", "new-jersey", "washington", "illinois", "texas"];
  const stateLinks = states.filter((s) => topStates.includes(s.slug));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
      { "@type": "ListItem", position: 2, name: "Private Karaoke Rooms Near Me", item: `${site.url}/private-karaoke/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is private karaoke?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Private karaoke means renting a dedicated room at a KTV venue where only your group sings. There is no shared stage, no waiting for strangers to finish, and no crowd audience — just your group, your song queue, and your own microphones.",
        },
      },
      {
        "@type": "Question",
        name: "How much does private karaoke cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Private karaoke room rental typically costs between $15 and $50 per hour depending on room size, location, and day of the week. Rates are per room, not per person, so splitting the cost across a group of four to eight makes it very affordable.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to reserve a private karaoke room in advance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Reservations are strongly recommended, especially on weekends and for groups of six or more. Many KTV venues fill their private rooms quickly on Friday and Saturday nights. Book online or call ahead to guarantee your time slot.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between KTV and private karaoke?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "KTV (karaoke television) is the industry term for private-room karaoke originating in East Asia. KTV venues offer the same experience as private karaoke rooms — an enclosed space, microphones, a song catalog, and service — just under a different name commonly used in areas with large Asian communities.",
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
            Private Karaoke Rooms Near Me
          </nav>
          <h1>Private Karaoke Rooms Near Me</h1>
          <p className="lead">
            Book a private karaoke room near you — your group gets its own
            space, microphones, and song queue. No crowd, no waiting. Perfect
            for birthdays, parties, and nights out.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <h2>What Is Private Karaoke?</h2>
            <p>
              Private karaoke means renting a dedicated room at a KTV or karaoke
              venue where only your group sings. There is no shared stage, no
              performing in front of strangers, and no waiting for a host to
              call your name. Your group controls the song queue, the volume,
              and the pace of the night — it is a fully self-contained
              experience from the moment you walk in.
            </p>
            <p>
              Private karaoke rooms are available in a range of sizes, from
              intimate two-person booths to large party suites that can seat
              twenty or more guests. Most venues include food and drink service
              directly to the room, and many have premium packages with cocktails,
              bottle service, or catering for special occasions.
            </p>

            <h2>Best Occasions for Private Karaoke</h2>
            <p>
              Private karaoke rooms are a natural fit for birthday parties and
              bachelorette or bachelor nights — you get the full venue experience
              with the privacy of your own group. They also work well for
              corporate team outings, client entertainment, graduation
              celebrations, anniversary dinners, and casual friend groups who
              prefer singing without an audience. For first-time singers or
              anyone who finds public performance intimidating, a private room
              removes that pressure entirely and lets everyone participate.
            </p>

            <h2>How to Book a Private Karaoke Room</h2>
            <p>
              Use the <Link href="/karaoke-finder/">Karaoke Finder</Link> to
              search by city and find private karaoke venues near you. You can
              also browse the{" "}
              <Link href="/services/private-karaoke-rooms/">
                private karaoke rooms directory
              </Link>{" "}
              to compare venues by rating and location. Once you find a venue,
              call ahead or use their online booking to reserve your room —
              especially important on weekends when rooms fill up early.
            </p>
          </div>

          {featured.length > 0 && (
            <div style={{ marginTop: "3rem" }}>
              <h2>Private Karaoke Venues</h2>
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
                  View all private karaoke venues
                </Link>
              </div>
            </div>
          )}

          <div className="prose" style={{ marginTop: "3.5rem" }}>
            <h2>Frequently Asked Questions</h2>
            <h3>What is the difference between KTV and private karaoke?</h3>
            <p>
              KTV (karaoke television) is the industry term for private-room
              karaoke originating in East Asia. KTV and private karaoke are the
              same experience — an enclosed room, microphones, and a song
              catalog — just named differently depending on the venue and market.
            </p>
            <h3>How much does private karaoke cost?</h3>
            <p>
              Room rental runs $15–$50 per hour depending on size and location.
              Rates are per room, so splitting across four to eight people makes
              it very affordable — often cheaper than a round of drinks each.
            </p>
            <h3>Do I need to reserve in advance?</h3>
            <p>
              Yes — book ahead for weekends and groups of six or more. Many
              venues fill all their private rooms on Friday and Saturday nights.
              Call the venue directly or use their online reservation system.
            </p>
          </div>

          <div style={{ marginTop: "3rem" }}>
            <h2>Find Private Karaoke by State</h2>
            <div className="chip-row">
              {stateLinks.map((s) => (
                <Link key={s.slug} href={`/${s.slug}/`} className="chip">
                  Private karaoke in {s.name}
                </Link>
              ))}
              <Link href="/states/" className="chip">
                All states →
              </Link>
            </div>
          </div>

          <div className="explore-more" style={{ marginTop: "3rem" }}>
            <Link href="/karaoke-finder/" className="btn btn-primary">
              Find Private Rooms Near Me
            </Link>
            <Link href="/karaoke-rooms/" className="btn btn-secondary">
              Karaoke Rooms
            </Link>
            <Link href="/korean-karaoke/" className="btn btn-secondary">
              Korean Karaoke (Norebang)
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
