import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Karaoke Near Me with questions, corrections, or suggestions about karaoke bars and locations in our directory.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Contact
          </nav>
          <h1>Contact Us</h1>
          <p className="lead">
            Questions, corrections, or a karaoke spot to tell us about? We would
            love to hear from you.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <h2>Email</h2>
            <p>
              The best way to reach us is by email. We read every message and
              aim to respond within two to three business days.
            </p>
            <p>
              <a className="btn btn-primary" href={`mailto:${site.email}`}>
                Email {site.email}
              </a>
            </p>

            <h2>What to include</h2>
            <p>To help us respond quickly, please include the following:</p>
            <ul>
              <li>The state and city your message relates to.</li>
              <li>
                The name of the venue, if you are reporting a correction or
                suggesting a new karaoke spot.
              </li>
              <li>
                A clear description of your question or the change you would
                like to see.
              </li>
            </ul>

            <h2>For venue owners</h2>
            <p>
              If you operate a karaoke venue and would like to update how your
              area is described, or let us know about your karaoke nights,
              please get in touch. We are happy to review accurate, up-to-date
              information from venue operators.
            </p>

            <h2>Editorial and privacy questions</h2>
            <p>
              For questions about how we handle your information, see our{" "}
              <Link href="/privacy-policy/">Privacy Policy</Link>. For questions
              about using the site, see our{" "}
              <Link href="/terms-of-service/">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
