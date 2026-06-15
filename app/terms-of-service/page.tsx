import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The Terms of Service governing your use of Karaoke Near Me, an online directory of karaoke bars and locations.",
  alternates: { canonical: "/terms-of-service/" },
};

const UPDATED = "June 15, 2026";

export default function TermsPage() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Terms of Service
          </nav>
          <h1>Terms of Service</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="prose">
            <p className="updated">Last updated: {UPDATED}</p>

            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
              and use of {site.domain} (the &ldquo;Site&rdquo;), operated by{" "}
              {site.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;). By accessing or using the Site, you agree to be
              bound by these Terms. If you do not agree, please do not use the
              Site.
            </p>

            <h2>Use of the Site</h2>
            <p>
              The Site provides an informational directory of karaoke bars and
              locations, along with tools that link to third-party map results.
              You may use the Site for your personal, non-commercial use and in
              compliance with these Terms and all applicable laws.
            </p>

            <h2>Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>
                Use the Site in any way that violates applicable law or
                regulation.
              </li>
              <li>
                Attempt to gain unauthorized access to the Site, its servers, or
                related systems.
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                Site.
              </li>
              <li>
                Scrape, harvest, or collect content or data from the Site
                through automated means without our prior written consent.
              </li>
              <li>
                Copy, reproduce, or redistribute our original content without
                permission.
              </li>
            </ul>

            <h2>Informational purpose only</h2>
            <p>
              The Site is provided for general informational purposes. We do not
              own, operate, endorse, or guarantee any venue referenced through
              the Site, and we do not process reservations or bookings. Venue
              details, hours, and karaoke schedules change frequently. You are
              responsible for confirming information directly with a venue
              before relying on it. See our{" "}
              <Link href="/disclaimer/">disclaimer</Link> for more.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The Site and its original content, features, and design are owned
              by {site.name} and are protected by intellectual property laws.
              Trademarks, venue names, and third-party content remain the
              property of their respective owners.
            </p>

            <h2>Third-party links and services</h2>
            <p>
              The Site contains links to third-party websites and services,
              including online maps and advertising. We are not responsible for
              the content, policies, or practices of any third party. Your use
              of third-party services is governed by their terms.
            </p>

            <h2>Disclaimer of warranties</h2>
            <p>
              The Site is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; without warranties of any kind, whether express
              or implied, including but not limited to warranties of
              merchantability, fitness for a particular purpose, accuracy, or
              non-infringement. We do not warrant that the Site will be
              uninterrupted, error-free, or free of harmful components.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, {site.name} and its
              operators shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss arising
              from your use of, or inability to use, the Site or any information
              obtained through it.
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless {site.name} from any
              claims, damages, or expenses arising out of your use of the Site
              or your violation of these Terms.
            </p>

            <h2>Changes to these Terms</h2>
            <p>
              We may revise these Terms at any time. The updated version will be
              indicated by the &ldquo;Last updated&rdquo; date above, and it
              takes effect when posted. Your continued use of the Site
              constitutes acceptance of the revised Terms.
            </p>

            <h2>Governing law</h2>
            <p>
              These Terms are governed by the laws of the United States and the
              state in which the operator resides, without regard to conflict of
              law principles.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these Terms can be sent to{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> or through our{" "}
              <Link href="/contact/">contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
