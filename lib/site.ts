// Central configuration for site-wide constants. Update these values in one
// place rather than scattering them across pages.
export const site = {
  name: "Karaoke Near Me",
  domain: "karaokenearme.org",
  url: "https://karaokenearme.org",
  // Primary keyword and tagline used across metadata.
  tagline: "The Nationwide Karaoke Directory",
  description:
    "Karaoke Near Me is the nationwide directory of karaoke bars, lounges, and private karaoke rooms across the United States — every state, hundreds of cities. Search by city or state to find karaoke near you.",
  // Contact address for legal pages and the contact page.
  email: "contact@karaokenearme.org",
  // Year the site launched, used in legal pages and the footer.
  launchYear: 2025,
  // Google AdSense publisher ID. Leave empty until the account is approved;
  // when set (e.g. "ca-pub-0000000000000000"), the AdSense script and an
  // ads.txt entry are activated automatically.
  adsenseClientId: "",
};

export const legalLinks = [
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy-policy/", label: "Privacy Policy" },
  { href: "/terms-of-service/", label: "Terms of Service" },
  { href: "/cookie-policy/", label: "Cookie Policy" },
  { href: "/disclaimer/", label: "Disclaimer" },
];

export const mainNav = [
  { href: "/states/", label: "States" },
  { href: "/karaoke-finder/", label: "Karaoke Finder" },
];
