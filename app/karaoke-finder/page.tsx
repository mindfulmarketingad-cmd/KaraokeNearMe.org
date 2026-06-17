import type { Metadata } from "next";
import Link from "next/link";
import Finder from "@/components/Finder";

export const metadata: Metadata = {
  title: "Karaoke Finder | Find Karaoke Near You",
  description:
    "Use the Karaoke Finder to search for karaoke bars and locations near you. Find karaoke by your current location or browse by state and city.",
  alternates: { canonical: "/karaoke-finder/" },
};

export default function FinderPage() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Karaoke Finder
          </nav>
          <h1>Karaoke Finder</h1>
          <p className="lead">
            Find karaoke near you in seconds. Search from your current location,
            or choose a state and city to see nearby karaoke bars, lounges, and
            private rooms on the map.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid-2aside">
            <Finder />

            <div className="prose" style={{ maxWidth: "none" }}>
              <figure className="content-figure content-figure--media mt-0">
                <img
                  src="https://media.wired.com/photos/6430bf0507f19c7bfb8c7f89/master/pass/How-to-Use-Karaoke-Mode-on-Apple-Music,-Spotify,-and-More-Gear-GettyImages-1365389911.jpg"
                  alt="Person singing along to on-screen lyrics while using karaoke mode to find a song"
                  width={1600}
                  height={1200}
                  loading="lazy"
                />
                <figcaption>
                  Tell the finder what you want and search live karaoke venues near you in seconds.
                </figcaption>
              </figure>
              <h2 className="mt-0">How the Karaoke Finder Works</h2>
              <p>
                The Karaoke Finder connects you to live, up-to-date local
                results so you always see what is actually open near you. Choose
                one of two ways to search:
              </p>
              <h3>Search near your current location</h3>
              <p>
                Select <strong>Find Karaoke Near Me</strong> to open a map of
                karaoke venues around you. Your device may ask permission to
                share your location so results can be centered on where you are
                right now.
              </p>
              <h3>Browse by state and city</h3>
              <p>
                Prefer to plan ahead or search a different area? Pick a state,
                then narrow to a specific city. We will build a focused karaoke
                search for that location and show it to you on the map.
              </p>
              <p>
                Want background on a particular area first? Visit our{" "}
                <Link href="/states/">state directory</Link> for an overview of
                each state&apos;s karaoke scene, popular cities, and tips before
                you head out.
              </p>
              <p className="muted" style={{ fontSize: "0.95rem" }}>
                Karaoke Near Me is an independent directory. We link to public
                map results and do not take bookings. Always confirm hours and
                karaoke schedules with the venue before visiting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
