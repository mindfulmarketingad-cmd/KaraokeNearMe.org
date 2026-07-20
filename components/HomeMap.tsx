"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FIND_TYPE_FILTERS, FIND_TYPE_LABELS, FindPageKind } from "@/lib/listings";
import StarRating from "@/components/StarRating";

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
  state: string;
  stateCode: string | null;
  stateSlug: string;
  postalCode: string | null;
  lat: number;
  lng: number;
  rating: number | null;
  reviews: number | null;
  tags: FindPageKind[];
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
  showUserLocation = false,
}: {
  items: HomeMapListing[];
  // "national" fits the whole US and recenters there when filters clear;
  // "local" (used by /find/ city pages) always fits the map to the venues
  // currently in view, since there's no nationwide default to fall back to.
  scope?: "national" | "local";
  searchPlaceholder?: string;
  links?: { href: string; label: string; primary?: boolean }[];
  // Shows a live, pulsing "you are here" dot using the browser's Geolocation
  // API. Only meaningful with scope="national" (the homepage); it's opt-in
  // since it triggers a location-permission prompt.
  showUserLocation?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [zip, setZip] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<FindPageKind | "">("");
  const [topRated, setTopRated] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);

  const [satellite, setSatellite] = useState(false);
  const [view, setView] = useState<"map" | "list">("map");

  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const boundaryRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const hasCenteredOnUserRef = useRef(false);
  const streetLayerRef = useRef<any>(null);
  const satelliteLayerRef = useRef<any>(null);

  const states = useMemo(() => {
    const set = new Set(items.map((l) => l.state));
    return [...set].sort();
  }, [items]);

  const typeOptions = useMemo(() => {
    const present = new Set(items.flatMap((l) => l.tags));
    return FIND_TYPE_FILTERS.filter((t) => present.has(t.slug));
  }, [items]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const z = zip.trim();
    return items.filter((l) => {
      if (topRated && (l.rating ?? 0) < 4.5) return false;
      if (stateFilter && l.state !== stateFilter) return false;
      if (typeFilter && !l.tags.includes(typeFilter)) return false;
      if (z && !(l.postalCode ?? "").startsWith(z)) return false;
      if (
        q &&
        !`${l.name} ${l.city} ${l.state} ${l.stateCode ?? ""}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [items, query, zip, stateFilter, typeFilter, topRated]);

  // The list view ranks venues by star rating (highest first), with review
  // volume as the tiebreaker so a lone 5.0 doesn't outrank a well-reviewed
  // 4.9. Unrated venues sort to the bottom.
  const listResults = useMemo(
    () =>
      [...results].sort(
        (a, b) =>
          (b.rating ?? -1) - (a.rating ?? -1) ||
          (b.reviews ?? 0) - (a.reviews ?? 0)
      ),
    [results]
  );

  // Initialize the map once Leaflet has loaded.
  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapElRef.current || mapRef.current) return;
        const map = L.map(mapElRef.current, {
          zoomControl: false,
          scrollWheelZoom: false,
        }).setView(
          scope === "national" ? [39.5, -98.35] : [items[0]?.lat ?? 39.5, items[0]?.lng ?? -98.35],
          scope === "national" ? 4 : 11
        );
        streetLayerRef.current = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }
        ).addTo(map);
        satelliteLayerRef.current = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              "Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics, and the GIS User Community",
            maxZoom: 19,
          }
        );
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

  // Leaflet miscalculates its size if it was hidden (list view) while the
  // container resized; recompute when the map becomes visible again.
  useEffect(() => {
    if (view === "map" && mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [view]);

  // Swap between the street and satellite tile layers.
  useEffect(() => {
    const map = mapRef.current;
    const street = streetLayerRef.current;
    const sat = satelliteLayerRef.current;
    if (!mapReady || !map || !street || !sat) return;
    if (satellite) {
      map.removeLayer(street);
      map.addLayer(sat);
      sat.bringToBack();
    } else {
      map.removeLayer(sat);
      map.addLayer(street);
      street.bringToBack();
    }
  }, [satellite, mapReady]);

  // Track the visitor's live location as a pulsing blue dot, once the map
  // and Leaflet are ready. Silently does nothing if geolocation is
  // unsupported or the user declines the permission prompt.
  useEffect(() => {
    if (!showUserLocation || !mapReady || typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }
    const L = window.L;
    const map = mapRef.current;
    if (!L || !map) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (!userMarkerRef.current) {
          const icon = L.divIcon({
            className: "knm-user-dot-wrap",
            html: '<span class="knm-user-dot"><span class="knm-user-dot-pulse"></span><span class="knm-user-dot-core"></span></span>',
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });
          userMarkerRef.current = L.marker([latitude, longitude], {
            icon,
            zIndexOffset: 1000,
            interactive: false,
          }).addTo(map);
        } else {
          userMarkerRef.current.setLatLng([latitude, longitude]);
        }
        if (!hasCenteredOnUserRef.current) {
          hasCenteredOnUserRef.current = true;
          map.setView([latitude, longitude], 12);
        }
      },
      () => {
        /* permission denied or unavailable; no dot, no error UI */
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [showUserLocation, mapReady]);

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
          `<br><a href="/partners/${l.slug}/">View details</a>`
      );
    });

    const filtered = Boolean(
      query.trim() || zip.trim() || stateFilter || typeFilter || topRated
    );
    if (results.length > 0 && (scope === "local" || filtered)) {
      const bounds = L.latLngBounds(results.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: scope === "local" ? 15 : 12 });
    } else if (scope === "national" && !filtered) {
      map.setView([39.5, -98.35], 4);
    }

    // On /find/ city and state pages, draw a blue outline around all the
    // matching venues so the whole search area reads clearly in one view.
    if (boundaryRef.current) {
      boundaryRef.current.remove();
      boundaryRef.current = null;
    }
    if (scope === "local" && results.length > 0) {
      const areaBounds = L.latLngBounds(results.map((l) => [l.lat, l.lng])).pad(0.2);
      boundaryRef.current = L.rectangle(areaBounds, {
        color: "#2563eb",
        weight: 3,
        fill: false,
        interactive: false,
      }).addTo(map);
    }

    map.invalidateSize();
  }, [results, mapReady, query, zip, stateFilter, typeFilter, topRated, scope]);

  return (
    <section className="home-map-section">
      <div className="home-map-toolbar">
        <input
          type="text"
          inputMode="numeric"
          className="home-map-zip"
          aria-label="Search by zip code"
          placeholder="Zip code"
          maxLength={5}
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/[^\d]/g, ""))}
        />
        <select
          aria-label="Filter by state"
          className="home-map-select"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="">All states</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by karaoke type"
          className="home-map-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as FindPageKind | "")}
        >
          <option value="">All karaoke types</option>
          {typeOptions.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.label}
            </option>
          ))}
        </select>

        <div className="home-map-viewtoggle" role="group" aria-label="Map or list view">
          <button
            type="button"
            className={view === "map" ? "is-active" : ""}
            aria-pressed={view === "map"}
            onClick={() => setView("map")}
          >
            Map
          </button>
          <button
            type="button"
            className={view === "list" ? "is-active" : ""}
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            List
          </button>
        </div>
      </div>

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
          <>
            <div
              ref={mapElRef}
              className="home-map-leaflet"
              style={view === "list" ? { visibility: "hidden" } : undefined}
            />
            {view === "map" && (
              <button
                type="button"
                className={`home-map-satellite${satellite ? " is-active" : ""}`}
                aria-pressed={satellite}
                onClick={() => setSatellite((v) => !v)}
              >
                {satellite ? "Map" : "Satellite"}
              </button>
            )}
            {view === "list" && (
              <div className="home-map-list">
                {results.length === 0 ? (
                  <p className="home-map-list-empty">
                    No venues match your filters. Try clearing the search or
                    zip code.
                  </p>
                ) : (
                  <ol className="home-map-cards">
                    {listResults.map((l, i) => (
                      <li key={l.slug}>
                        <Link href={`/partners/${l.slug}/`} className="venue-card">
                          <span className="venue-card-rank" aria-hidden="true">
                            {i + 1}
                          </span>
                          <span className="venue-card-body">
                            <span className="venue-card-name">{l.name}</span>
                            <span className="venue-card-meta">
                              {l.type ?? "Karaoke venue"} · {l.city},{" "}
                              {l.stateCode ?? l.state}
                            </span>
                            {l.rating != null && (
                              <StarRating
                                rating={l.rating}
                                reviews={l.reviews}
                                size={13}
                              />
                            )}
                            {l.tags.length > 0 && (
                              <span className="venue-card-chips">
                                {l.tags.map((t) => (
                                  <span key={t} className="venue-card-chip">
                                    {FIND_TYPE_LABELS[
                                      t as Exclude<FindPageKind, "city">
                                    ] ?? t}
                                  </span>
                                ))}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
