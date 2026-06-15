import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer for Karaoke Near Me. Information is provided for general purposes only; please verify details directly with venues.",
  alternates: { canonical: "/disclaimer/" },
};

const UPDATED = "June 15, 2026";

export default function DisclaimerPage() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Disclaimer
          </nav>
          <h1>Disclaimer</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <p className="updated">Last updated: {UPDATED}</p>

            <h2>General information</h2>
            <p>
              The information provided by {site.name} on {site.domain} (the
              &ldquo;Site&rdquo;) is for general informational purposes only. All
              information on the Site is provided in good faith; however, we make
              no representation or warranty of any kind, express or implied,
              regarding the accuracy, adequacy, validity, reliability, or
              completeness of any information on the Site.
            </p>

            <h2>No venue affiliation</h2>
            <p>
              {site.name} is an independent directory. We are not affiliated
              with, endorsed by, or sponsored by the venues referenced through
              the Site unless explicitly stated. Venue names and trademarks
              belong to their respective owners and are used for identification
              and informational purposes only.
            </p>

            <h2>Accuracy and availability</h2>
            <p>
              Karaoke schedules, hours of operation, and even the venues
              themselves change frequently and without notice. Listings and
              descriptions may become outdated. We strongly recommend confirming
              all details, including whether karaoke is offered and on which
              nights, directly with the venue before making plans or traveling.
            </p>

            <h2>External links</h2>
            <p>
              The Site contains links to external websites and third-party
              services, including online maps. We do not warrant, endorse, or
              assume responsibility for the accuracy or reliability of any
              information offered by third-party services linked through the
              Site. We are not a party to, and are not responsible for, any
              transaction between you and a third party.
            </p>

            <h2>Responsible enjoyment</h2>
            <p>
              Many karaoke venues serve alcohol. Please drink responsibly, never
              drink and drive, and follow all venue rules and local laws.
              {" "}
              {site.name} is not responsible for your conduct or experience at
              any venue.
            </p>

            <h2>Professional advice</h2>
            <p>
              The Site does not provide legal, financial, or professional advice
              of any kind. Any reliance you place on the information from the
              Site is strictly at your own risk.
            </p>

            <h2>Contact</h2>
            <p>
              If you find an error or have a question about this disclaimer,
              please contact us at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> or through our{" "}
              <Link href="/contact/">contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
