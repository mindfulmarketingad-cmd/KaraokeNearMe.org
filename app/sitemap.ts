import type { MetadataRoute } from "next";
import { states } from "@/lib/states";
import { listings, services } from "@/lib/listings";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/states/", priority: 0.9, changeFrequency: "weekly" },
    { path: "/listings/", priority: 0.9, changeFrequency: "weekly" },
    { path: "/services/", priority: 0.8, changeFrequency: "monthly" },
    { path: "/karaoke-finder/", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about/", priority: 0.5, changeFrequency: "yearly" },
    { path: "/contact/", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacy-policy/", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms-of-service/", priority: 0.3, changeFrequency: "yearly" },
    { path: "/cookie-policy/", priority: 0.3, changeFrequency: "yearly" },
    { path: "/disclaimer/", priority: 0.3, changeFrequency: "yearly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const stateEntries: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${site.url}/states/${s.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const listingEntries: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${site.url}/listings/${l.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${site.url}/services/${s.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...stateEntries, ...listingEntries, ...serviceEntries];
}
