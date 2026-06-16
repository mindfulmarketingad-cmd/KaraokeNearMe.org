import type { Metadata } from "next";
import Link from "next/link";
import { listingsByService } from "@/lib/listings";
import { states } from "@/lib/states";
import StarRating from "@/components/StarRating";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Korean Karaoke Near Me | Norebang & KTV Lounges",
  description:
    "Find Korean karaoke (norebang) near you. Discover KTV lounges with private rooms, Korean song catalogs, and the authentic norebang experience across the United States.",
  alternates: { canonical: "/korean-karaoke/" },
  openGraph: {
    title: "Korean Karaoke Near Me | Norebang & KTV Lounges",
    description:
      "Find Korean karaoke (norebang) near you — private KTV rooms with Korean song catalogs and the authentic norebang experience.",
    url: "/korean-karaoke/",
    type: "website",
  },
};

export default function KoreanKaraokeePage() {
  const featured = listingsByService("private-karaoke-rooms").slice(0, 6);
  const koreanStates = ["new-york", "california", "new-jersey", "virginia", "washington", "georgia"];
  const stateLinks = states.filter((s) => koreanStates.includes(s.slug));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
      { "@type": "ListItem", position: 2, name: "Korean Karaoke Near Me", item: `${site.url}/korean-karaoke/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Korean karaoke (norebang)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Norebang (노래방) is the Korean word for a private karaoke room. Korean karaoke venues offer enclosed rooms rented by the hour where your group sings privately. Song catalogs at Korean karaoke venues typically include an extensive Korean-language library alongside English pop, K-pop, and international music.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between norebang and regular karaoke?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Norebang always uses a private-room format — your group gets its own enclosed space and never sings in front of strangers. Regular American karaoke is usually bar-style with a shared stage. Norebang venues also tend to have larger Korean and K-pop song libraries, tambourines and maracas in the room, and food and drink service directly to your suite.",
        },
      },
      {
        "@type": "Question",
        name: "Where can I find Korean karaoke near me?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Korean karaoke venues are most concentrated in cities with large Korean-American communities, including Los Angeles (Koreatown), New York City (Flushing, Manhattan Koreatown), Washington DC (Annandale, VA), and Atlanta. Use the Karaoke Finder on KaraokeNearMe.org to search for private karaoke rooms in your city.",
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
            Korean Karaoke Near Me
          </nav>
          <h1>Korean Karaoke Near Me</h1>
          <p className="lead">
            Find norebang and Korean KTV venues near you. Private rooms,
            massive Korean and K-pop song catalogs, and the authentic norebang
            experience — in Koreatown and beyond.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <h2>What Is Korean Karaoke (Norebang)?</h2>
            <p>
              Norebang (노래방) is the Korean term for a private karaoke room,
              and it describes a specific style of karaoke experience that
              originated in South Korea and spread worldwide. Unlike American
              bar karaoke where singers perform in front of a crowd, norebang
              venues offer enclosed private rooms — your group rents the entire
              space by the hour, gives you full control of the song queue, and
              never requires you to perform for strangers.
            </p>
            <p>
              Korean karaoke venues in the United States typically feature
              extensive Korean-language song libraries alongside English pop,
              hip-hop, K-pop, J-pop, and international music. The rooms often
              come stocked with tambourines, maracas, and other percussion
              instruments. Many venues offer food and drink menus with Korean
              snacks, fried chicken, fruit platters, and cocktails delivered
              directly to your room during your session.
            </p>

            <h2>The Norebang Experience</h2>
            <p>
              A typical norebang session runs one to three hours. You book
              a room at the front desk, pay by the hour based on the room size,
              and your group is shown to a private suite with a large-screen
              TV, microphones, a song catalog touch screen, and a sound system.
              A song score appears after each performance — a gamified element
              that Korean karaoke is famous for — and the friendly competition
              between friends is a big part of what makes norebang so fun.
              Sessions often run late into the night in cities with active
              Korean communities, with some venues open until 4 or 5 AM.
            </p>

            <h2>Where to Find Korean Karaoke in the US</h2>
            <p>
              Korean karaoke is most concentrated in cities with large
              Korean-American communities. Los Angeles&apos;s Koreatown and
              Flushing in New York City have the highest density of norebang
              venues in the country, with dozens of options at various price
              points. Washington DC (particularly Annandale and Centreville in
              Northern Virginia), Atlanta (Duluth, Doraville), Seattle
              (Lynnwood), and Chicago (Niles) also have active Korean karaoke
              scenes. Use the{" "}
              <Link href="/karaoke-finder/">Karaoke Finder</Link> to search by
              city or browse{" "}
              <Link href="/services/private-karaoke-rooms/">
                private karaoke room venues
              </Link>{" "}
              to find norebang near you.
            </p>
          </div>

          {featured.length > 0 && (
            <div style={{ marginTop: "3rem" }}>
              <h2>KTV &amp; Norebang Venues</h2>
              <p className="muted" style={{ marginBottom: "1.6rem" }}>
                Private karaoke room venues in our directory — many offering Korean song catalogs.
              </p>
              <div className="grid grid-3">
                {featured.map((l) => (
                  <Link key={l.slug} href={`/listings/${l.slug}/`} className="listing-card">
                    <span className="listing-card-name">{l.name}</span>
                    <span className="listing-card-meta">
                      {l.type ?? "KTV venue"} · {l.city}, {l.stateCode ?? l.state}
                    </span>
                    {l.rating != null && (
                      <StarRating rating={l.rating} reviews={l.reviews} size={14} />
                    )}
                  </Link>
                ))}
              </div>
              <div style={{ marginTop: "1.6rem" }}>
                <Link href="/services/private-karaoke-rooms/" className="btn btn-secondary">
                  View all KTV venues
                </Link>
              </div>
            </div>
          )}

          <div className="prose" style={{ marginTop: "3.5rem" }}>
            <h2>Frequently Asked Questions</h2>
            <h3>What is the difference between norebang and regular karaoke?</h3>
            <p>
              Norebang always uses a private-room format — your group has its
              own enclosed space and never sings in front of strangers. American
              bar karaoke puts you on a shared stage. Norebang venues also
              feature larger Korean and K-pop libraries, in-room percussion
              instruments, and food and drink service to the room.
            </p>
            <h3>Where can I find Korean karaoke near me?</h3>
            <p>
              Use the <Link href="/karaoke-finder/">Karaoke Finder</Link> to
              search by city, or browse the state pages for cities with large
              Korean-American communities — New York, Los Angeles, Washington DC,
              Atlanta, and Seattle have the most active norebang scenes.
            </p>
            <h3>How much does norebang cost?</h3>
            <p>
              Korean karaoke room rates typically run $15–$40 per hour depending
              on room size and location. Rates are per room, making it affordable
              when split across a group. Some venues charge more during peak
              weekend hours.
            </p>
          </div>

          <div style={{ marginTop: "3rem" }}>
            <h2>Find Korean Karaoke by State</h2>
            <div className="chip-row">
              {stateLinks.map((s) => (
                <Link key={s.slug} href={`/${s.slug}/`} className="chip">
                  Korean karaoke in {s.name}
                </Link>
              ))}
              <Link href="/states/" className="chip">
                All states →
              </Link>
            </div>
          </div>

          <div className="explore-more" style={{ marginTop: "3rem" }}>
            <Link href="/karaoke-finder/" className="btn btn-primary">
              Find Norebang Near Me
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
