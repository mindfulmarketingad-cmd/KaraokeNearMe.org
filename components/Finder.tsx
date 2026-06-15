"use client";

import { useMemo, useState } from "react";
import { states } from "@/lib/states";

function mapsSearch(query: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}

export default function Finder() {
  const [stateSlug, setStateSlug] = useState("");
  const [city, setCity] = useState("");

  const selectedState = useMemo(
    () => states.find((s) => s.slug === stateSlug),
    [stateSlug]
  );

  // Build the destination map query from the current selection.
  const query = useMemo(() => {
    if (!selectedState) return "";
    if (city) return `karaoke near ${city}, ${selectedState.name}`;
    return `karaoke in ${selectedState.name}`;
  }, [selectedState, city]);

  return (
    <div className="finder">
      <div className="field">
        <label htmlFor="near-me">Search from your current location</label>
        <a
          id="near-me"
          className="btn btn-primary"
          style={{ width: "100%", textAlign: "center" }}
          href={mapsSearch("karaoke near me")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Find Karaoke Near Me
        </a>
      </div>

      <hr style={{ margin: "1.6rem 0" }} />

      <p className="muted" style={{ marginTop: 0 }}>
        Or browse by location:
      </p>

      <div className="field">
        <label htmlFor="state-select">State</label>
        <select
          id="state-select"
          value={stateSlug}
          onChange={(e) => {
            setStateSlug(e.target.value);
            setCity("");
          }}
        >
          <option value="">Select a state</option>
          {states.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {selectedState && (
        <div className="field">
          <label htmlFor="city-select">City</label>
          <select
            id="city-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">All of {selectedState.name}</option>
            {selectedState.cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedState && (
        <div className="finder-result">
          <strong>Ready to search</strong>
          <p style={{ margin: "0.4rem 0 0.9rem" }}>
            Showing karaoke {city ? `near ${city}, ` : "across "}
            {selectedState.name} on Google Maps.
          </p>
          <a
            className="btn btn-primary"
            href={mapsSearch(query)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Map
          </a>
          <div className="chip-row" style={{ marginTop: "1.1rem" }}>
            {selectedState.cities.map((c) => (
              <button
                key={c}
                type="button"
                className="chip"
                onClick={() => setCity(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
