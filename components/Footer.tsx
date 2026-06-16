import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <span className="brand-mark" aria-hidden="true" />
              Karaoke Near Me
            </Link>
            <p>
              A nationwide directory helping you find local karaoke bars and
              locations. Browse by state and discover a place to sing tonight.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/listings/">Listings</Link>
              </li>
              <li>
                <Link href="/services/">Services</Link>
              </li>
              <li>
                <Link href="/states/">Browse States</Link>
              </li>
              <li>
                <Link href="/karaoke-finder/">Karaoke Finder</Link>
              </li>
              <li>
                <Link href="/about/">About</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link href="/privacy-policy/">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-of-service/">Terms of Service</Link>
              </li>
              <li>
                <Link href="/cookie-policy/">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/disclaimer/">Disclaimer</Link>
              </li>
              <li>
                <Link href="/contact/">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            &copy; {year} {site.name}. All rights reserved.
          </span>
          <span>{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}
