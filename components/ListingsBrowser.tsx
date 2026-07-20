"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { FIND_TYPE_FILTERS, FindPageKind } from "@/lib/listings";

export interface SlimListing {
  slug: string;
  name: string;
  type: string | null;
  city: string;
  citySlug: string;
  state: string;
  rating: number | null;
  reviews: number | null;
  tags: FindPageKind[];
}

type SortOption = "recommended" | "name" | "reviews";

export default function ListingsBrowser({ items }: { items: SlimListing[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [activeTags, setActiveTags] = useState<FindPageKind[]>([]);

  const cities = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>();
    for (const l of items) map.set(l.citySlug, { slug: l.citySlug, name: l.city });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  const states = useMemo(() => {
    return [...new Set(items.map((l) => l.state))].sort();
  }, [items]);

  const typeChips = useMemo(() => {
    const present = new Set(items.flatMap((l) => l.tags));
    return FIND_TYPE_FILTERS.filter((t) => present.has(t.slug));
  }, [items]);

  function toggleTag(tag: FindPageKind) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = items.filter((l) => {
      if (city && l.citySlug !== city) return false;
      if (state && l.state !== state) return false;
      if (activeTags.length > 0 && !activeTags.some((t) => l.tags.includes(t))) return false;
      if (
        q &&
        !`${l.name} ${l.city} ${l.state} ${l.type ?? ""}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
    if (sort === "name") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "reviews") {
      return [...filtered].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
    }
    return filtered;
  }, [items, query, city, state, activeTags, sort]);

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
        {states.length > 1 && (
          <div className="field" style={{ margin: 0, flex: "1 1 180px" }}>
            <label htmlFor="state">State</label>
            <select id="state" value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">All states</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="field" style={{ margin: 0, flex: "1 1 180px" }}>
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="recommended">Recommended</option>
            <option value="name">Name (A–Z)</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>
      </div>

      {typeChips.length > 0 && (
        <div className="chip-row" style={{ marginTop: "1rem" }}>
          {typeChips.map((t) => (
            <button
              key={t.slug}
              type="button"
              className={`chip chip-toggle${activeTags.includes(t.slug) ? " is-active" : ""}`}
              aria-pressed={activeTags.includes(t.slug)}
              onClick={() => toggleTag(t.slug)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <p className="muted" style={{ margin: "1.2rem 0" }}>
        Showing {results.length} {results.length === 1 ? "venue" : "venues"}
        {city && ` in ${cities.find((c) => c.slug === city)?.name}`}
        {state && ` in ${state}`}.
      </p>

      {results.length === 0 ? (
        <p>No venues match your search. Try a different city or keyword.</p>
      ) : (
        <div className="grid grid-3">
          {results.map((l) => (
            <Link key={l.slug} href={`/partners/${l.slug}/`} className="listing-card">
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
