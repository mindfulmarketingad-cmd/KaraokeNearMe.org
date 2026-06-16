"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import type { Hour } from "@/lib/listings";

// A Google-Maps-style explorer: a scrollable results list on the left synced
// with an interactive map on the right. The map uses Leaflet with free
// OpenStreetMap tiles, loaded from a CDN at runtime so the static export needs
// no extra build dependencies.

export interface MapListing {
  slug: string;
  name: string;
  type: string | null;
  city: string;
  citySlug: string;
  address: string | null;
  lat: number;
  lng: number;
  rating: number | null;
  reviews: number | null;
  priceRange: string | null;
  phone: string | null;
  website: string | null;
  hours: Hour[];
}

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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

function parseClock(s: string): number | null {
  const m = s.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (/PM/i.test(m[3])) h += 12;
  return h * 60 + (m[2] ? parseInt(m[2], 10) : 0);
}

function formatClock(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return mm === 0 ? `${h12} ${ampm}` : `${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

// Best-effort "open now" status from the venue's weekly hours, evaluated in the
// visitor's local time. Returns null when hours are missing/unparseable.
function openStatus(
  hours: Hour[],
  now: Date
): { open: boolean; text: string } | null {
  if (!hours || hours.length === 0) return null;
  const byDay = new Map(hours.map((h) => [h.day, h]));
  const intervals: { start: number; end: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const h = byDay.get(DAY_ORDER[i]);
    if (!h || h.closed) continue;
    if (/24\s*hours/i.test(h.label)) {
      intervals.push({ start: i * 1440, end: i * 1440 + 1440 });
      continue;
    }
    const parts = h.label.split(/[–—-]/);
    if (parts.length !== 2) continue;
    const s = parseClock(parts[0]);
    let e = parseClock(parts[1]);
    if (s == null || e == null) continue;
    if (e <= s) e += 1440; // closes after midnight
    intervals.push({ start: i * 1440 + s, end: i * 1440 + e });
  }
  if (intervals.length === 0) return null;

  const todayIdx = (now.getDay() + 6) % 7; // Mon=0
  const t = todayIdx * 1440 + now.getHours() * 60 + now.getMinutes();
  const week = 7 * 1440;
  for (const iv of intervals) {
    if ((t >= iv.start && t < iv.end) || (t + week >= iv.start && t + week < iv.end)) {
      return { open: true, text: `Open · Closes ${formatClock(iv.end)}` };
    }
  }
  // Find the next opening time for a "Closed · Opens …" message.
  let next = Infinity;
  for (const iv of intervals) {
    let s = iv.start;
    if (s < t) s += week;
    if (s < next) next = s;
  }
  if (next !== Infinity) {
    return { open: false, text: `Closed · Opens ${formatClock(next)}` };
  }
  return { open: false, text: "Closed" };
}

function priceText(range: string | null): string | null {
  return range && /^\$+$/.test(range) ? range : null;
}

export default function StateMapExplorer({
  stateName,
  items,
}: {
  stateName: string;
  items: MapListing[];
}) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);

  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const cardsRef = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => setNow(new Date()), []);

  const cities = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>();
    for (const l of items) map.set(l.citySlug, { slug: l.citySlug, name: l.city });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((l) => {
      if (city && l.citySlug !== city) return false;
      if (q && !`${l.name} ${l.city} ${l.type ?? ""}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [items, query, city]);

  // Initialize the map once Leaflet has loaded.
  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapElRef.current || mapRef.current) return;
        const map = L.map(mapElRef.current, { scrollWheelZoom: false }).setView(
          [items[0]?.lat ?? 40.7, items[0]?.lng ?? -74],
          11
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);
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
    markersRef.current = {};

    results.forEach((l, i) => {
      const icon = L.divIcon({
        className: "knm-pin-wrap",
        html: `<span class="knm-pin"><b>${i + 1}</b></span>`,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -34],
      });
      const marker = L.marker([l.lat, l.lng], { icon }).addTo(layer);
      const rating = l.rating != null ? `★ ${l.rating.toFixed(1)}` : "";
      marker.bindPopup(
        `<strong>${l.name}</strong><br>${l.type ?? "Karaoke venue"} · ${l.city}` +
          (rating ? `<br>${rating}` : "") +
          `<br><a href="/listings/${l.slug}/">View details</a>`
      );
      marker.on("click", () => setActive(l.slug));
      markersRef.current[l.slug] = marker;
    });

    if (results.length > 0) {
      const bounds = L.latLngBounds(results.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
    map.invalidateSize();
  }, [results, mapReady]);

  // Pan to and open the popup for the active listing.
  useEffect(() => {
    if (!active) return;
    const marker = markersRef.current[active];
    const map = mapRef.current;
    if (marker && map) {
      map.panTo(marker.getLatLng());
      marker.openPopup();
    }
    cardsRef.current[active]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [active]);

  return (
    <div className="map-explorer">
      <div className="map-panel">
        <div className="map-panel-search">
          <div className="map-search-input">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              aria-label={`Search karaoke in ${stateName}`}
              placeholder={`Search karaoke in ${stateName}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            aria-label="Filter by city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <p className="map-result-count">
          {results.length} {results.length === 1 ? "result" : "results"}
          {city && ` in ${cities.find((c) => c.slug === city)?.name}`}
        </p>

        <ul className="map-result-list">
          {results.length === 0 && (
            <li className="map-empty">No karaoke venues match your search.</li>
          )}
          {results.map((l, i) => {
            const status = now ? openStatus(l.hours, now) : null;
            const price = priceText(l.priceRange);
            return (
              <li
                key={l.slug}
                ref={(el) => {
                  cardsRef.current[l.slug] = el;
                }}
                className={`map-result${active === l.slug ? " is-active" : ""}`}
                onMouseEnter={() => setActive(l.slug)}
              >
                <span className="map-result-index">{i + 1}</span>
                <div className="map-result-body">
                  <Link href={`/listings/${l.slug}/`} className="map-result-name">
                    {l.name}
                  </Link>
                  {l.rating != null && (
                    <StarRating rating={l.rating} reviews={l.reviews} size={13} />
                  )}
                  <p className="map-result-meta">
                    {l.type ?? "Karaoke venue"}
                    {price && <> · {price}</>}
                    {l.address ? ` · ${l.address}` : ` · ${l.city}`}
                  </p>
                  {status && (
                    <p className={`map-result-status ${status.open ? "is-open" : "is-closed"}`}>
                      {status.text}
                    </p>
                  )}
                  <div className="map-result-actions">
                    <Link href={`/listings/${l.slug}/`}>Details</Link>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Directions
                    </a>
                    {l.phone && <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`}>Call</a>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="map-canvas">
        {mapFailed ? (
          <div className="map-fallback">
            <p>The interactive map could not be loaded. Browse the list of venues, or</p>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(
                `karaoke in ${stateName}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Open in Google Maps
            </a>
          </div>
        ) : (
          <div ref={mapElRef} className="map-leaflet" />
        )}
      </div>
    </div>
  );
}
