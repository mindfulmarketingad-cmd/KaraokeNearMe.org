import Link from "next/link";
import { regions, statesByRegion, states } from "@/lib/states";
import { listings, sortByProminence, listingUrl } from "@/lib/listings";
import StarRating from "@/components/StarRating";
import Finder from "@/components/Finder";
import Reviews from "@/components/Reviews";

export default function HomePage() {
  const featured = [...listings].sort(sortByProminence).slice(0, 6);

  return (
    <>
      {/* Panel 1: Hero */}
      <section className="hero hero--photo">
        <div className="container">
          <span className="eyebrow">Nationwide Karaoke Directory</span>
          <h1>Karaoke Near Me</h1>
          <p className="lead">
            Find local karaoke bars and locations across the United States.
            Browse by state, explore your city, and discover the best place to
            sing tonight.
          </p>
          <div className="hero-actions">
            <Link href="/karaoke-finder/" className="btn btn-primary">
              Find Karaoke Near Me
            </Link>
            <Link href="/states/" className="btn btn-secondary">
              Browse by State
            </Link>
          </div>
        </div>
      </section>

      {/* Panel 1.5: Karaoke Finder */}
      <section className="section section--alt">
        <div className="container">
          <div className="grid-2aside">
            <Finder />
            <div className="prose" style={{ maxWidth: "none" }}>
              <span className="eyebrow">Karaoke Finder</span>
              <h2 className="mt-0">Find the Exact Karaoke Spot You Want</h2>
              <p>
                Not all karaoke is the same. Tell us what you&apos;re after —
                a private KTV room for a birthday, a lively open-mic bar, an
                all-ages family spot, or authentic Korean norebang — and we&apos;ll
                match you to the right venues near you.
              </p>
              <p>
                Filter by <strong>karaoke type</strong>,{" "}
                <strong>group size</strong>, <strong>arrival time</strong>, and
                whether you want <strong>food and drinks</strong>. Then search
                from your current location or pick any city. We build a focused
                map search so you skip the guesswork and find your perfect spot
                in seconds.
              </p>
              <p>
                Prefer the full experience?{" "}
                <Link href="/karaoke-finder/">Open the Karaoke Finder</Link> to
                see how it works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Panel 2: By State directory */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">Directory</span>
          <h2>Karaoke Bars &amp; Locations By State</h2>
          <p className="lead">
            Select your state to explore karaoke venues, popular cities, and
            local tips for finding a great night out.
          </p>

          <div style={{ marginTop: "2.5rem" }}>
            {regions.map((region) => (
              <div className="region-block" key={region}>
                <h3>{region}</h3>
                <div className="grid grid-states">
                  {statesByRegion(region).map((s) => (
                    <Link
                      key={s.slug}
                      href={`/${s.slug}/`}
                      className={`state-card state-card--${region.toLowerCase()}`}
                    >
                      <span className="name">{s.name}</span>
                      <span className="abbr">{s.abbr}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="section section--alt">
        <div className="container">
          <span className="eyebrow">Featured</span>
          <h2>Popular Karaoke Venues</h2>
          <p className="lead">
            A few of the most reviewed karaoke spots in our directory. Browse all{" "}
            {listings.length} listings to find one near you.
          </p>
          <div className="grid grid-3" style={{ marginTop: "2.2rem" }}>
            {featured.map((l) => (
              <Link key={l.slug} href={listingUrl(l)} className="listing-card">
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
          <div style={{ marginTop: "2.2rem" }}>
            <Link href="/listings/" className="btn btn-primary">
              Browse all listings
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews carousel */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">Loved by Singers</span>
          <h2>What People Are Saying</h2>
          <p className="lead">
            Thousands of singers use Karaoke Near Me to find exactly the spot
            they want. Here&apos;s what they tell us.
          </p>
          <div style={{ marginTop: "2.4rem" }}>
            <Reviews />
          </div>
        </div>
      </section>

      {/* Karaoke types hub — H2 links for SEO */}
      <section className="section">
        <div className="container">
          <div className="prose">
            <span className="eyebrow">Browse by Type</span>
            <h2>
              <Link href="/karaoke-rooms/">Karaoke Rooms Near Me</Link>
            </h2>
            <p>
              Find private karaoke rooms and KTV suites you can book by the
              hour. Perfect for birthdays, parties, and groups who want their
              own space without a crowd audience.
            </p>

            <h2>
              <Link href="/karaoke-bars/">Karaoke Bars Near Me</Link>
            </h2>
            <p>
              Discover karaoke bars near you — host-led open-mic nights where
              you add your name to a list and sing for the room. The classic,
              social format and usually free to join.
            </p>

            <h2>
              <Link href="/private-karaoke/">Private Karaoke Rooms Near Me</Link>
            </h2>
            <p>
              Book a fully private karaoke room for your group. No strangers,
              no waiting — just your crew, your playlist, and your own
              microphones for the whole session.
            </p>

            <h2>
              <Link href="/family-karaoke/">Family Karaoke Near Me</Link>
            </h2>
            <p>
              Looking for all-ages karaoke the whole family can enjoy?
              Find kid-friendly private rooms and restaurant karaoke nights
              that welcome families earlier in the evening.
            </p>

            <h2>
              <Link href="/korean-karaoke/">Korean Karaoke Near Me</Link>
            </h2>
            <p>
              Find norebang and Korean KTV venues near you — private rooms with
              massive Korean and K-pop song catalogs, tambourines, and the
              authentic norebang experience in Koreatown and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Supporting content: how to find karaoke */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">How It Works</span>
          <h2>Finding Karaoke Near You</h2>
          <p className="lead">
            Three simple steps to go from searching to singing.
          </p>
          <div className="grid grid-3" style={{ marginTop: "2.2rem" }}>
            <div className="feature">
              <span className="num">1</span>
              <h3>Choose your state</h3>
              <p>
                Start with our state directory. Each state page highlights the
                cities and metro areas with the most active karaoke scenes.
              </p>
            </div>
            <div className="feature">
              <span className="num">2</span>
              <h3>Narrow to your city</h3>
              <p>
                Use the Karaoke Finder to pick your city and jump straight to a
                live local map of nearby karaoke bars and lounges.
              </p>
            </div>
            <div className="feature">
              <span className="num">3</span>
              <h3>Pick a place and go</h3>
              <p>
                Review what each area offers, from private rooms to host-led bar
                nights, then head out and take the microphone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting content: types of karaoke */}
      <section className="section">
        <div className="container">
          <div className="prose">
            <span className="eyebrow">Know Before You Go</span>
            <h2>Types of Karaoke Venues</h2>
            <figure className="content-figure content-figure--wide">
              <img
                src="https://www.parties-to-go.com/wp-content/uploads/2020/12/video-4647668_640.jpg"
                alt="Person holding a microphone and singing at a local karaoke night"
                width={640}
                height={280}
                loading="lazy"
              />
              <figcaption>
                From host-led karaoke bars to private KTV rooms, there&apos;s a karaoke format for every group.
              </figcaption>
            </figure>
            <p>
              Karaoke comes in several formats, and knowing the difference helps
              you choose the right spot for your night. Understanding the
              options below makes it easier to match a venue to your group and
              the kind of evening you want.
            </p>
            <h3>Karaoke bars and lounges</h3>
            <p>
              The most common format in the United States. A host runs the show
              from a shared stage or corner of the room, and singers take turns
              performing for the whole bar. These nights are social, welcoming
              to newcomers, and usually free to join, with the venue earning
              from food and drinks.
            </p>
            <h3>Private karaoke rooms (KTV)</h3>
            <p>
              Popular in larger cities and areas with strong East Asian
              communities, private-room karaoke lets your group rent an
              enclosed space by the hour. It is ideal for celebrations, shy
              first-timers, and anyone who wants a more personal experience with
              their own song list and service.
            </p>
            <h3>Restaurant and pub karaoke</h3>
            <p>
              Many neighborhood restaurants and pubs schedule weekly karaoke
              nights. These tend to be relaxed, family-friendly earlier in the
              evening, and a dependable way to find singing close to home
              without traveling to a dedicated venue.
            </p>
            <p>
              Ready to begin? Browse our{" "}
              <Link href="/states/">complete state directory</Link> or open the{" "}
              <Link href="/karaoke-finder/">Karaoke Finder</Link> to locate a
              spot near you.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
