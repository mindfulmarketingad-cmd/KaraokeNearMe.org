"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import VenueImage from "@/components/VenueImage";
import BookingModal, { BookingVenue } from "@/components/BookingModal";
import { FACETS, FACET_LABEL, RATING_OPTIONS, ratingTest } from "@/lib/venueFilters";

export interface SlimListing {
  slug: string;
  name: string;
  type: string | null;
  city: string;
  citySlug: string;
  state: string;
  rating: number | null;
  reviews: number | null;
  facets: string[];
  image: string;
  verified: boolean;
}

type SortOption = "recommended" | "name" | "reviews" | "rating";

export default function ListingsBrowser({ items }: { items: SlimListing[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [rating, setRating] = useState("");
  const [activeFacets, setActiveFacets] = useState<string[]>([]);
  const [inquire, setInquire] = useState<BookingVenue | null>(null);

  const cities = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>();
    for (const l of items) map.set(l.citySlug, { slug: l.citySlug, name: l.city });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  const states = useMemo(() => {
    return [...new Set(items.map((l) => l.state))].sort();
  }, [items]);

  // Only show facet chips that actually match at least one venue in view, so
  // filters never lead to an empty result set on the first click.
  const facetChips = useMemo(() => {
    const present = new Set(items.flatMap((l) => l.facets));
    return FACETS.filter((f) => present.has(f.id));
  }, [items]);

  function toggleFacet(id: string) {
    setActiveFacets((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = items.filter((l) => {
      if (city && l.citySlug !== city) return false;
      if (state && l.state !== state) return false;
      if (!ratingTest(rating, l.rating)) return false;
      // Every selected facet must match (narrowing), so users land on exactly
      // what they asked for.
      if (activeFacets.length > 0 && !activeFacets.every((f) => l.facets.includes(f)))
        return false;
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
    if (sort === "rating") {
      return [...filtered].sort(
        (a, b) =>
          (b.rating ?? -1) - (a.rating ?? -1) || (b.reviews ?? 0) - (a.reviews ?? 0)
      );
    }
    return filtered;
  }, [items, query, city, state, rating, activeFacets, sort]);

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
        <div className="field" style={{ margin: 0, flex: "1 1 160px" }}>
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
          <div className="field" style={{ margin: 0, flex: "1 1 160px" }}>
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
        <div className="field" style={{ margin: 0, flex: "1 1 140px" }}>
          <label htmlFor="rating">Rating</label>
          <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
            {RATING_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field" style={{ margin: 0, flex: "1 1 160px" }}>
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="recommended">Recommended</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviews</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </div>

      {facetChips.length > 0 && (
        <div className="chip-row" style={{ marginTop: "1rem" }}>
          {facetChips.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip chip-toggle${activeFacets.includes(f.id) ? " is-active" : ""}`}
              aria-pressed={activeFacets.includes(f.id)}
              onClick={() => toggleFacet(f.id)}
            >
              {f.label}
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
        <p>No venues match your filters. Try clearing a filter or keyword.</p>
      ) : (
        <div className="grid grid-3">
          {results.map((l) => (
            <div key={l.slug} className="listing-card-cell">
              <Link
                href={`/partners/${l.slug}/`}
                className="listing-card listing-card--photo"
              >
                <span className="listing-card-photo-wrap">
                  <VenueImage src={l.image} alt={l.name} className="listing-card-photo" />
                  {l.verified && (
                    <span className="verified-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Google Verified
                    </span>
                  )}
                </span>
                <span className="listing-card-photo-body">
                  <span className="listing-card-name">{l.name}</span>
                  <span className="listing-card-meta">
                    {l.type ?? "Karaoke venue"} · {l.city}
                  </span>
                  {l.rating != null && (
                    <StarRating rating={l.rating} reviews={l.reviews} size={14} />
                  )}
                  {l.facets.length > 0 && (
                    <span className="venue-card-chips">
                      {l.facets.slice(0, 3).map((id) => (
                        <span key={id} className="venue-card-chip">
                          {FACET_LABEL[id] ?? id}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              </Link>
              <button
                type="button"
                className="card-inquire-btn"
                onClick={() =>
                  setInquire({
                    slug: l.slug,
                    name: l.name,
                    city: l.city,
                    state: l.state,
                  })
                }
              >
                Inquire
              </button>
            </div>
          ))}
        </div>
      )}

      <BookingModal venue={inquire} onClose={() => setInquire(null)} />
    </div>
  );
}
