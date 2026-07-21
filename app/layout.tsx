import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Karaoke Near Me | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "karaoke near me",
    "karaoke bars",
    "karaoke locations",
    "karaoke spots",
    "private room karaoke",
    "KTV",
    "where to sing karaoke",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `Karaoke Near Me | ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `Karaoke Near Me | ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "directory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/karaoke-finder/`,
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    alternateName: "KaraokeNearMe.org",
    url: site.url,
    description: site.description,
    slogan: site.tagline,
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    knowsAbout: [
      "Karaoke bars",
      "Karaoke lounges",
      "Private karaoke rooms",
      "KTV",
      "Karaoke near me",
    ],
  };

  return (
    <html lang="en">
      <head>
        {site.adsenseClientId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsenseClientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
        <JsonLd data={websiteSchema} />
        <JsonLd data={orgSchema} />
      </head>
      <body>
        <Header />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
