import type { MetadataRoute } from "next";
import { states } from "@/lib/states";
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

  return [...staticEntries, ...stateEntries];
}
