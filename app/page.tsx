import Link from "next/link";
import { regions, statesByRegion, states, totalCities } from "@/lib/states";
import { listings, sortByProminence, venueTagSlugs } from "@/lib/listings";
import { venueFacetIds } from "@/lib/venueFilters";
import StarRating from "@/components/StarRating";
import HomeMap, { HomeMapListing } from "@/components/HomeMap";

export default function HomePage() {
  const featured = [...listings].sort(sortByProminence).slice(0, 6);

  const mapItems: HomeMapListing[] = listings
    .filter((l) => l.lat != null && l.lng != null)
    .map((l) => ({
      slug: l.slug,
      name: l.name,
      type: l.type,
      city: l.city,
      citySlug: l.citySlug,
      state: l.state,
      stateCode: l.stateCode,
      stateSlug: l.stateSlug,
      postalCode: l.postalCode,
      lat: l.lat as number,
      lng: l.lng as number,
      rating: l.rating,
      reviews: l.reviews,
      tags: venueTagSlugs(l),
      facets: venueFacetIds(l),
      verified: l.verified,
    }));

  return (
    <>
      {/* Panel 1: Full-screen national karaoke map */}
      <HomeMap
        items={mapItems}
        showUserLocation
        links={[
          { href: "/states/", label: "Browse by State" },
          { href: "/karaoke-finder/", label: "Karaoke Finder", primary: true },
        ]}
      />

      {/* Intro + stats strip */}
      <section className="section">
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

          <div className="stats">
            <div className="stat">
              <span className="figure">{states.length}</span>
              <span className="label">States &amp; territories covered</span>
            </div>
            <div className="stat">
              <span className="figure">{totalCities()}+</span>
              <span className="label">Cities and metro areas</span>
            </div>
            <div className="stat">
              <span className="figure">{regions.length}</span>
              <span className="label">Regions across the country</span>
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
                      href={`/find/karaoke-${s.slug}/`}
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
              <Link key={l.slug} href={`/partners/${l.slug}/`} className="listing-card">
                <span className="listing-card-name">{l.name}</span>
                <span className="listing-card-meta">
                  {l.type ?? "Karaoke venue"} · {l.city}, {l.stateCode ?? l.state}
                </span>
                <StarRating rating={l.rating} reviews={l.reviews} size={14} />
              </Link>
            ))}
          </div>
          <div style={{ marginTop: "2.2rem" }}>
            <Link href="/partners/" className="btn btn-primary">
              Browse all listings
            </Link>
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
