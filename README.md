# Karaoke Near Me

A directory website for finding local karaoke bars and locations across the
United States. Built with **Next.js (App Router)** and TypeScript, configured
for static export so it can be hosted on Vercel, Netlify, GitHub Pages, or any
static host.

- **Main keyword:** Karaoke Near Me
- **Domain:** karaokenearme.org
- **Design:** minimalist and authoritative — coral (`#ff8066`) on white.

## Features

- Homepage hero with a "Karaoke Near Me" call to action.
- "Karaoke Bars & Locations By State" directory covering all 50 states plus
  Washington, D.C., grouped by region.
- Navigation mega menu (States by region + Karaoke Finder).
- Interactive Karaoke Finder that searches by current location or by
  state/city using live map results.
- Original editorial content for every state (built for SEO and AdSense).
- Full set of legal pages for Google AdSense approval: Privacy Policy, Terms of
  Service, Cookie Policy, Disclaimer, About, and Contact.
- SEO built in: per-page metadata, Open Graph/Twitter tags, JSON-LD structured
  data, `sitemap.xml`, and `robots.txt`.

## Getting started

```bash
npm install
npm run dev      # local development at http://localhost:3000
npm run build    # static export to ./out
```

The exported static site is written to the `out/` directory.

## Project structure

```
app/
  layout.tsx            Root layout, metadata, header/footer, AdSense slot
  page.tsx              Homepage (hero + by-state directory)
  states/               State index + dynamic per-state pages
  karaoke-finder/       Interactive finder page
  about/ contact/       About and contact pages
  privacy-policy/ ...   Legal pages
  sitemap.ts robots.ts  Generated sitemap.xml and robots.txt
components/             Header (mega menu), Footer, Finder, JsonLd
lib/
  site.ts               Site-wide config (name, URL, AdSense ID)
  states.ts             State data and helpers
public/ads.txt          AdSense authorized-sellers file
```

## Enabling Google AdSense

1. Apply for Google AdSense and get approved.
2. Set `adsenseClientId` in `lib/site.ts` to your publisher ID
   (e.g. `"ca-pub-0000000000000000"`). This activates the AdSense script
   site-wide.
3. Edit `public/ads.txt` and add your publisher line as described in that file.
4. Place ad units in pages as desired.

## Notes

This is an independent directory. It links to public map results rather than
publishing fabricated venue listings, and it does not process bookings.
