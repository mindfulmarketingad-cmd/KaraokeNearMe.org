import type { Metadata } from "next";
import Link from "next/link";
import { listingsByService } from "@/lib/listings";
import { states } from "@/lib/states";
import StarRating from "@/components/StarRating";
import LocationCTA from "@/components/LocationCTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Family Karaoke Near Me | Kid-Friendly Karaoke Venues",
  description:
    "Find family-friendly karaoke near you. Discover all-ages karaoke venues, private rooms for families, and restaurants with karaoke nights the whole family can enjoy.",
  alternates: { canonical: "/family-karaoke/" },
  openGraph: {
    title: "Family Karaoke Near Me | Kid-Friendly Karaoke Venues",
    description:
      "Find family-friendly karaoke venues near you — all-ages nights, private rooms, and restaurants with karaoke the whole family can enjoy.",
    url: "/family-karaoke/",
    type: "website",
  },
};

export default function FamilyKaraokeePage() {
  const restaurantVenues = listingsByService("restaurant").slice(0, 3);
  const privateRooms = listingsByService("private-karaoke-rooms").slice(0, 3);
  const featured = [...restaurantVenues, ...privateRooms].slice(0, 6);
  const topStates = ["new-york", "california", "texas", "florida", "georgia", "illinois"];
  const stateLinks = states.filter((s) => topStates.includes(s.slug));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
      { "@type": "ListItem", position: 2, name: "Family Karaoke Near Me", item: `${site.url}/family-karaoke/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is karaoke family-friendly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some karaoke venues are family-friendly, especially private KTV rooms and restaurant karaoke nights. Bar-style karaoke at late-night venues is generally adults-only. Private karaoke rooms are the safest family option since your group has its own space away from the bar area.",
        },
      },
      {
        "@type": "Question",
        name: "What is the best type of karaoke for families?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Private karaoke rooms are the best option for families with children. Your group gets its own enclosed space with a song catalog that includes kids' songs, Disney tracks, and pop hits. Restaurant karaoke nights are another good choice — they tend to run earlier in the evening and maintain a family-appropriate atmosphere.",
        },
      },
      {
        "@type": "Question",
        name: "Can kids sing karaoke?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — most KTV venues welcome children when accompanied by parents or guardians. Song libraries at private karaoke venues typically include kids' favorites from Disney, nursery rhymes, and popular family movies. Always call ahead to confirm age policies before visiting with young children.",
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
            Family Karaoke Near Me
          </nav>
          <h1>Family Karaoke Near Me</h1>
          <p className="lead">
            Find family-friendly karaoke venues near you — all-ages private
            rooms, restaurant karaoke nights, and kid-friendly spots where
            the whole family can take the microphone.
          </p>
          <div style={{ maxWidth: 460, marginTop: "1.6rem" }}>
            <LocationCTA query="family karaoke" label="Family Karaoke" />
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <figure className="content-figure content-figure--wide">
            <img
              src="https://www.carvedculture.co.uk/cdn/shop/articles/best-sing-along-songs-for-karaoke_60b37661-e13d-4c53-89da-8f711559fae8.jpg?v=1759918701"
              alt="Microphone set up for an all-ages karaoke sing-along of popular family-friendly songs"
              width={1200}
              height={525}
              loading="lazy"
            />
            <figcaption>
              Crowd-pleasing sing-along songs make all-ages family karaoke easy and fun for every singer.
            </figcaption>
          </figure>

          <div className="prose">
            <h2>Is Karaoke Family-Friendly?</h2>
            <p>
              Not all karaoke venues are the same when it comes to families.
              Late-night bar karaoke is typically an adult environment, but
              private karaoke rooms and restaurant karaoke nights are excellent
              options for groups with children. Knowing which format to look
              for makes it easy to plan a karaoke night the whole family can
              enjoy.
            </p>

            <h2>Best Types of Family Karaoke</h2>
            <h3>Private karaoke rooms (KTV)</h3>
            <p>
              Private rooms are the top choice for families. Your group has its
              own enclosed space with a song library that includes Disney songs,
              kids&apos; hits, nursery rhymes, and popular movie soundtracks
              alongside adult pop and rock. There is no bar crowd, no late-night
              atmosphere, and no sharing the microphone with strangers. Many
              KTV venues welcome families during afternoon and early evening
              hours.
            </p>
            <h3>Restaurant karaoke nights</h3>
            <p>
              Many restaurants host karaoke nights that start early in the evening
              — often 6 to 9 PM — before transitioning to a more adult crowd
              later. These early windows are a great time to bring kids. A full
              food menu means the family eats together, and the relaxed restaurant
              atmosphere is welcoming to all ages.
            </p>

            <h2>Tips for Family Karaoke</h2>
            <p>
              Always call ahead to confirm age policies before visiting with
              children — some venues have minimum age requirements or hours when
              children are permitted. Arrive early for the best song selection
              and shorter waits. At private KTV venues, book a room in advance
              on weekends to avoid disappointment. Choose a venue with a food
              menu if you have young children — a full meal keeps the night
              running smoothly.
            </p>
          </div>

          {featured.length > 0 && (
            <div style={{ marginTop: "3rem" }}>
              <h2>Family-Friendly Karaoke Venues</h2>
              <p className="muted" style={{ marginBottom: "1.6rem" }}>
                Restaurants and private-room venues suitable for all-ages karaoke nights.
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
            </div>
          )}

          <div className="prose" style={{ marginTop: "3.5rem" }}>
            <h2>Frequently Asked Questions</h2>
            <h3>Is karaoke family-friendly?</h3>
            <p>
              Private KTV rooms and restaurant karaoke nights are the most
              family-friendly options. Bar-style karaoke at late-night venues
              is generally adult-only. Always confirm age policies with the
              venue before visiting with children.
            </p>
            <h3>Can kids sing karaoke?</h3>
            <p>
              Yes — most KTV venues welcome children with parents or guardians.
              Song libraries typically include Disney tracks, kids&apos; songs,
              and popular family-movie soundtracks alongside adult music.
            </p>
            <h3>What is the best type of karaoke for families?</h3>
            <p>
              <Link href="/karaoke-rooms/">Private karaoke rooms</Link> are the
              best choice — your group has its own space, full control over the
              song queue, and no exposure to a bar environment.
              Restaurant karaoke during early evening hours is the second-best
              option for families.
            </p>
          </div>

          <div style={{ marginTop: "3rem" }}>
            <h2>Find Family Karaoke by State</h2>
            <div className="chip-row">
              {stateLinks.map((s) => (
                <Link key={s.slug} href={`/${s.slug}/`} className="chip">
                  Family karaoke in {s.name}
                </Link>
              ))}
              <Link href="/states/" className="chip">
                All states →
              </Link>
            </div>
          </div>

          <div className="explore-more" style={{ marginTop: "3rem" }}>
            <Link href="/karaoke-finder/" className="btn btn-primary">
              Find Family Karaoke Near Me
            </Link>
            <Link href="/private-karaoke/" className="btn btn-secondary">
              Private Karaoke Rooms
            </Link>
            <Link href="/karaoke-rooms/" className="btn btn-secondary">
              Karaoke Rooms
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
