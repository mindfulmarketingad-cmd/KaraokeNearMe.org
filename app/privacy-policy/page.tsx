import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "The Karaoke Near Me privacy policy explains what information we collect, how cookies and third-party advertising work, and your privacy choices.",
  alternates: { canonical: "/privacy-policy/" },
};

const UPDATED = "June 15, 2026";

export default function PrivacyPage() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Privacy Policy
          </nav>
          <h1>Privacy Policy</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <p className="updated">Last updated: {UPDATED}</p>

            <p>
              This Privacy Policy describes how {site.name} (&ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and shares
              information when you visit {site.domain} (the &ldquo;Site&rdquo;).
              By using the Site, you agree to the practices described here.
            </p>

            <h2>Information we collect</h2>
            <p>
              We aim to collect as little personal information as possible. The
              information involved in your use of the Site falls into two
              categories:
            </p>
            <h3>Information you provide</h3>
            <p>
              If you contact us by email, we receive your email address and the
              contents of your message. We use this solely to respond to and
              manage your inquiry.
            </p>
            <h3>Information collected automatically</h3>
            <p>
              Like most websites, our Site and our service providers may
              automatically collect certain technical information when you
              visit, such as your IP address, browser type, device type,
              referring pages, and the pages you view. This information is used
              to operate, secure, and improve the Site.
            </p>

            <h2>Cookies and similar technologies</h2>
            <p>
              Cookies are small text files stored on your device. We and our
              partners use cookies and similar technologies to remember your
              preferences, understand how the Site is used, and, where
              applicable, deliver advertising. You can control cookies through
              your browser settings, as described in our{" "}
              <Link href="/cookie-policy/">Cookie Policy</Link>.
            </p>

            <h2>Advertising and Google AdSense</h2>
            <p>
              We may display advertising on this Site, including through Google
              AdSense. Third-party vendors, including Google, use cookies to
              serve ads based on a user&apos;s prior visits to this and other
              websites.
            </p>
            <ul>
              <li>
                Google&apos;s use of advertising cookies enables it and its
                partners to serve ads to you based on your visit to this Site
                and/or other sites on the internet.
              </li>
              <li>
                You may opt out of personalized advertising by visiting{" "}
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
                You can also opt out of a third-party vendor&apos;s use of
                cookies for personalized advertising by visiting{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.aboutads.info
                </a>
                .
              </li>
            </ul>
            <p>
              For more information about how Google uses data when you use our
              partners&apos; sites or apps, see{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s Privacy &amp; Terms
              </a>
              .
            </p>

            <h2>Analytics</h2>
            <p>
              We may use analytics services to understand how visitors use the
              Site in aggregate. These services may set their own cookies and
              process usage data on our behalf to help us improve our content
              and performance.
            </p>

            <h2>How we use information</h2>
            <ul>
              <li>To operate, maintain, and improve the Site.</li>
              <li>To respond to your questions and requests.</li>
              <li>To measure and analyze traffic and usage trends.</li>
              <li>To display and measure advertising, where applicable.</li>
              <li>
                To protect the Site against fraud, abuse, and security issues,
                and to comply with legal obligations.
              </li>
            </ul>

            <h2>Third-party links</h2>
            <p>
              The Site links to third-party services such as online maps and
              external websites. We are not responsible for the privacy
              practices of those services. We encourage you to review the
              privacy policies of any third-party site you visit.
            </p>

            <h2>Your privacy choices</h2>
            <p>
              Depending on where you live, you may have rights regarding your
              personal information, such as the right to access, correct, or
              delete it, or to opt out of certain processing. Residents of the
              European Economic Area and the United Kingdom may have rights
              under the GDPR, and California residents may have rights under the
              CCPA/CPRA, including the right to opt out of the &ldquo;sale&rdquo;
              or &ldquo;sharing&rdquo; of personal information for cross-context
              behavioral advertising. To exercise any of these rights, contact
              us at <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>

            <h2>Children&apos;s privacy</h2>
            <p>
              The Site is intended for a general audience and is not directed to
              children under the age of 13. We do not knowingly collect personal
              information from children under 13. If you believe a child has
              provided us with personal information, please contact us so we can
              remove it.
            </p>

            <h2>Data retention and security</h2>
            <p>
              We retain information only as long as necessary for the purposes
              described in this policy or as required by law. We take reasonable
              measures to protect information, but no method of transmission or
              storage is completely secure.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we
              will revise the &ldquo;Last updated&rdquo; date above. Your
              continued use of the Site after changes take effect constitutes
              acceptance of the updated policy.
            </p>

            <h2>Contact us</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> or through our{" "}
              <Link href="/contact/">contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
