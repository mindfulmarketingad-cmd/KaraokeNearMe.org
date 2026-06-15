import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Karaoke Near Me, an independent directory helping people across the United States find local karaoke bars and locations.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            About
          </nav>
          <h1>About Karaoke Near Me</h1>
          <p className="lead">
            An independent directory built to help people find a great place to
            sing, wherever they are.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <h2>Our mission</h2>
            <p>
              Karaoke Near Me exists for one simple reason: finding a good
              karaoke spot should be easy. Whether you are planning a birthday,
              looking for a relaxed weeknight out, or visiting a new city and
              hoping to take the microphone, we help you discover the karaoke
              bars and locations near you across all 50 states and Washington,
              D.C.
            </p>

            <h2>What we do</h2>
            <p>
              We organize the karaoke landscape by state and city so you can
              quickly understand what each area offers. Every state page
              includes an overview of the local scene, the cities with the most
              active karaoke nights, and practical tips for a great experience.
              Our <Link href="/karaoke-finder/">Karaoke Finder</Link> then
              connects you to live, up-to-date local map results so you can see
              what is open near you right now.
            </p>

            <h2>How we keep results useful</h2>
            <p>
              Karaoke schedules change often, with hosts, nights, and even
              venues coming and going from season to season. Rather than publish
              static listings that quickly become outdated, we pair original
              editorial guidance with live local search. That combination gives
              you the context to plan and the real-time results to act on.
            </p>

            <h2>Independence and accuracy</h2>
            <p>
              Karaoke Near Me is an independent resource. We are not affiliated
              with the venues featured through our directory, and we do not
              accept payment in exchange for editorial placement. We work to
              keep our information accurate and helpful, but details can change
              without notice, so we always recommend confirming hours and
              karaoke schedules directly with a venue before you visit. You can
              read more in our <Link href="/disclaimer/">disclaimer</Link>.
            </p>

            <h2>Get in touch</h2>
            <p>
              We welcome corrections, suggestions, and feedback from singers and
              venue owners alike. If something looks out of date or you would
              like to tell us about a karaoke spot, please reach out through our{" "}
              <Link href="/contact/">contact page</Link> or email us at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
