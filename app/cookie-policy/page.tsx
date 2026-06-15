import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "The Karaoke Near Me cookie policy explains how we and our partners use cookies and how you can manage your preferences.",
  alternates: { canonical: "/cookie-policy/" },
};

const UPDATED = "June 15, 2026";

export default function CookiePage() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Cookie Policy
          </nav>
          <h1>Cookie Policy</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <p className="updated">Last updated: {UPDATED}</p>

            <p>
              This Cookie Policy explains how {site.name} (&ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;) uses cookies and similar
              technologies on {site.domain}. It should be read together with our{" "}
              <Link href="/privacy-policy/">Privacy Policy</Link>.
            </p>

            <h2>What are cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit
              a website. They are widely used to make websites work, to improve
              efficiency, and to provide reporting and advertising information.
              Similar technologies include web beacons, pixels, and local
              storage.
            </p>

            <h2>Types of cookies we use</h2>
            <h3>Essential cookies</h3>
            <p>
              These are necessary for the Site to function properly, such as
              remembering basic preferences. The Site cannot work as intended
              without them.
            </p>
            <h3>Analytics cookies</h3>
            <p>
              These help us understand how visitors interact with the Site by
              collecting and reporting information in aggregate. This allows us
              to improve our content and performance.
            </p>
            <h3>Advertising cookies</h3>
            <p>
              Where we display advertising, third-party vendors, including
              Google, may use cookies to serve ads based on your prior visits to
              this Site and other sites. These cookies may be used to measure ad
              performance and, where applicable, to personalize the ads you see.
            </p>

            <h2>Third-party cookies</h2>
            <p>
              Some cookies are placed by third parties that provide services
              through our Site, such as advertising and analytics providers. As
              noted in our Privacy Policy, Google and other third-party vendors
              use cookies to serve ads based on a user&apos;s visits to this and
              other sites. We do not control these third-party cookies.
            </p>

            <h2>Managing cookies</h2>
            <p>
              You can control and manage cookies in several ways:
            </p>
            <ul>
              <li>
                Most browsers let you refuse or delete cookies through their
                settings. Refer to your browser&apos;s help documentation.
              </li>
              <li>
                You can opt out of personalized advertising from Google at{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Ads Settings
                </a>
                .
              </li>
              <li>
                You can opt out of personalized advertising from participating
                vendors at{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.aboutads.info
                </a>{" "}
                or{" "}
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  optout.networkadvertising.org
                </a>
                .
              </li>
            </ul>
            <p>
              Please note that blocking some cookies may affect your experience
              on the Site and the services we are able to offer.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes
              will be reflected by the &ldquo;Last updated&rdquo; date above.
            </p>

            <h2>Contact</h2>
            <p>
              If you have questions about our use of cookies, contact us at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
