"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// A full-bleed national map for the homepage: every karaoke venue in the
// directory plotted as a mic pin, with a floating search/filter bar on top.
// Uses Leaflet with free OpenStreetMap tiles, loaded from a CDN at runtime so
// the static export needs no extra build dependencies (same approach as
// StateMapExplorer).

export interface HomeMapListing {
  slug: string;
  name: string;
  type: string | null;
  city: string;
  stateCode: string | null;
  stateSlug: string;
  lat: number;
  lng: number;
  rating: number | null;
  reviews: number | null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    L?: any;
  }
}

let leafletPromise: Promise<any> | null = null;
function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject();
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;
  leafletPromise = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return leafletPromise;
}

const MIC_SVG =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">' +
  '<path d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-6a3.5 3.5 0 0 0-7 0v6A3.5 3.5 0 0 0 12 15z"/>' +
  '<path d="M18.5 11.5a6.5 6.5 0 0 1-13 0H4a8 8 0 0 0 7 7.94V22h2v-2.56a8 8 0 0 0 7-7.94z"/>' +
  "</svg>";

export default function HomeMap({
  items,
  scope = "national",
  searchPlaceholder = "Search city, state, or venue name",
  links,
}: {
  items: HomeMapListing[];
  // "national" fits the whole US and recenters there when filters clear;
  // "local" (used by /find/ city pages) always fits the map to the venues
  // currently in view, since there's no nationwide default to fall back to.
  scope?: "national" | "local";
  searchPlaceholder?: string;
  links?: { href: string; label: string; primary?: boolean }[];
}) {
  const [query, setQuery] = useState("");
  const [topRated, setTopRated] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);

  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((l) => {
      if (topRated && (l.rating ?? 0) < 4.5) return false;
      if (
        q &&
        !`${l.name} ${l.city} ${l.stateCode ?? ""}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [items, query, topRated]);

  // Initialize the map once Leaflet has loaded.
  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapElRef.current || mapRef.current) return;
        const map = L.map(mapElRef.current, {
          zoomControl: false,
        }).setView(
          scope === "national" ? [39.5, -98.35] : [items[0]?.lat ?? 39.5, items[0]?.lng ?? -98.35],
          scope === "national" ? 4 : 11
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);
        L.control.zoom({ position: "bottomleft" }).addTo(map);
        layerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        setMapReady(true);
      })
      .catch(() => setMapFailed(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (Re)draw markers whenever the filtered results change.
  useEffect(() => {
    const L = window.L;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!mapReady || !L || !map || !layer) return;
    layer.clearLayers();

    results.forEach((l) => {
      const ratingText = l.rating != null ? l.rating.toFixed(1) : "";
      const icon = L.divIcon({
        className: "knm-mic-wrap",
        html:
          `<span class="knm-mic-pin">${MIC_SVG}` +
          (ratingText ? `<b>${ratingText}</b>` : "") +
          "</span>",
        iconSize: [52, 30],
        iconAnchor: [26, 15],
        popupAnchor: [0, -16],
      });
      const marker = L.marker([l.lat, l.lng], { icon }).addTo(layer);
      const rating = l.rating != null ? `★ ${l.rating.toFixed(1)}` : "";
      marker.bindPopup(
        `<strong>${l.name}</strong><br>${l.type ?? "Karaoke venue"} · ${l.city}, ${
          l.stateCode ?? ""
        }` +
          (rating ? `<br>${rating}` : "") +
          `<br><a href="/listings/${l.slug}/">View details</a>`
      );
    });

    const filtered = Boolean(query.trim() || topRated);
    if (results.length > 0 && (scope === "local" || filtered)) {
      const bounds = L.latLngBounds(results.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: scope === "local" ? 15 : 12 });
    } else if (scope === "national" && !filtered) {
      map.setView([39.5, -98.35], 4);
    }
    map.invalidateSize();
  }, [results, mapReady, query, topRated, scope]);

  return (
    <section className="home-map-section">
      <div className="home-map-bar">
        <div className="home-map-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M21 21l-4.3-4.3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            aria-label="Search karaoke by city, state, or venue"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          type="button"
          className={`home-map-chip${topRated ? " is-active" : ""}`}
          aria-pressed={topRated}
          onClick={() => setTopRated((v) => !v)}
        >
          ★ Top Rated
        </button>
        <span className="home-map-count">
          {results.length.toLocaleString()} {results.length === 1 ? "venue" : "venues"}
        </span>
        {links && links.length > 0 && (
          <div className="home-map-links">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`home-map-chip${l.primary ? " home-map-chip--primary" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="home-map-canvas">
        {mapFailed ? (
          <div className="map-fallback">
            <p>The interactive map could not be loaded. Browse the directory instead.</p>
            <Link href="/states/" className="btn btn-primary">
              Browse by State
            </Link>
          </div>
        ) : (
          <div ref={mapElRef} className="home-map-leaflet" />
        )}
      </div>
    </section>
  );
}
