import Link from "next/link";
import { site } from "@/lib/site";
import Logo from "@/components/Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <Logo size={26} className="brand-logo" />
              Karaoke Near Me
            </Link>
            <p>
              A nationwide directory helping you find local karaoke bars and
              locations. Browse by state and discover a place to sing tonight.
            </p>
            <div className="social-row">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.84L7.01 4.13H5.04l12.04 15.64z" />
                </svg>
              </a>
            </div>
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
