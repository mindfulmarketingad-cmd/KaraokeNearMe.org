"use client";

import { useState } from "react";

/**
 * Location-aware Google Maps CTA.
 *
 * Clicking "Find … Near Me" triggers the browser's native geolocation
 * permission prompt — that prompt IS the location-confirmation step. Once the
 * user allows it, we anchor the Google Maps search to their exact coordinates
 * (`/@lat,lng,13z`) so the results are genuinely local. If they deny location
 * (or the browser has no geolocation), we reveal a manual city/ZIP field so the
 * search is still relevant to wherever they are.
 *
 * Every redirect goes through /go/ for the consistent "Finding Karaoke…"
 * loading screen.
 */

type Status = "idle" | "locating" | "denied";

function goTo(mapsUrl: string) {
  window.location.href = `/go/?to=${encodeURIComponent(mapsUrl)}`;
}

// Google Maps search anchored to specific coordinates.
function coordsMapsUrl(query: string, lat: number, lng: number): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(
    query
  )}/@${lat},${lng},13z`;
}

// Plain query search — Google centers on the place name / IP location.
function queryMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

export default function LocationCTA({
  query,
  label,
}: {
  /** Base search phrase, e.g. "private karaoke rooms". */
  query: string;
  /** Noun shown in the button, e.g. "Private Karaoke". */
  label: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [place, setPlace] = useState("");

  function handleNearMe() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        goTo(coordsMapsUrl(query, latitude, longitude));
      },
      () => {
        // Permission denied, timed out, or unavailable — let them type a place.
        setStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function handleManualSearch() {
    const trimmed = place.trim();
    if (!trimmed) return;
    goTo(queryMapsUrl(`${query} near ${trimmed}`));
  }

  return (
    <div className="finder" style={{ marginTop: "0.5rem" }}>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="near-me-cta">Find {label.toLowerCase()} near you</label>
        <button
          id="near-me-cta"
          type="button"
          className="btn btn-primary"
          style={{ width: "100%", textAlign: "center" }}
          onClick={handleNearMe}
          disabled={status === "locating"}
        >
          {status === "locating"
            ? "Detecting your location…"
            : `📍 Find ${label} Near Me`}
        </button>
        <p
          className="muted"
          style={{ margin: "0.6rem 0 0", fontSize: "0.88rem" }}
        >
          We&apos;ll ask your browser for your location so the map is centered on
          where you are right now. Nothing is stored.
        </p>
      </div>

      {status === "denied" && (
        <div className="finder-result" style={{ marginTop: "1.2rem" }}>
          <strong>Enter your location</strong>
          <p style={{ margin: "0.4rem 0 0.9rem", fontSize: "0.92rem" }}>
            No problem — type your city or ZIP code and we&apos;ll search there
            instead.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input
              type="text"
              inputMode="text"
              placeholder="City or ZIP code"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleManualSearch();
              }}
              style={{ flex: "1 1 180px" }}
              aria-label="City or ZIP code"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleManualSearch}
              disabled={!place.trim()}
            >
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
