"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";

export interface SlimListing {
  slug: string;
  name: string;
  type: string | null;
  city: string;
  citySlug: string;
  state: string;
  rating: number | null;
  reviews: number | null;
}

export default function ListingsBrowser({ items }: { items: SlimListing[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  const cities = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>();
    for (const l of items) map.set(l.citySlug, { slug: l.citySlug, name: l.city });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((l) => {
      if (city && l.citySlug !== city) return false;
      if (q && !(`${l.name} ${l.city} ${l.type ?? ""}`.toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [items, query, city]);

  return (
    <div>
      <div className="filter-bar">
        <div className="field" style={{ margin: 0, flex: "2 1 240px" }}>
          <label htmlFor="q">Search venues</label>
          <input
            id="q"
            type="text"
            placeholder="Search by name, city, or type"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="field" style={{ margin: 0, flex: "1 1 180px" }}>
          <label htmlFor="city">City</label>
          <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="muted" style={{ margin: "1.2rem 0" }}>
        Showing {results.length} {results.length === 1 ? "venue" : "venues"}
        {city && ` in ${cities.find((c) => c.slug === city)?.name}`}.
      </p>

      {results.length === 0 ? (
        <p>No venues match your search. Try a different city or keyword.</p>
      ) : (
        <div className="grid grid-3">
          {results.map((l) => (
            <Link key={l.slug} href={`/listings/${l.slug}/`} className="listing-card">
              <span className="listing-card-name">{l.name}</span>
              <span className="listing-card-meta">
                {l.type ?? "Karaoke venue"} · {l.city}
              </span>
              {l.rating != null && (
                <StarRating rating={l.rating} reviews={l.reviews} size={14} />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
