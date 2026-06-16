"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { states } from "@/lib/states";

function goUrl(mapsQuery: string): string {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
  return `/go/?to=${encodeURIComponent(mapsUrl)}`;
}

export default function Finder() {
  const [stateSlug, setStateSlug] = useState("");
  const [city, setCity] = useState("");

  const selectedState = useMemo(
    () => states.find((s) => s.slug === stateSlug),
    [stateSlug]
  );

  const query = useMemo(() => {
    if (!selectedState) return "";
    if (city) return `karaoke near ${city}, ${selectedState.name}`;
    return `karaoke in ${selectedState.name}`;
  }, [selectedState, city]);

  return (
    <div className="finder">
      <div className="field">
        <label htmlFor="near-me">Search from your current location</label>
        <Link
          id="near-me"
          className="btn btn-primary"
          style={{ width: "100%", textAlign: "center" }}
          href={goUrl("karaoke near me")}
        >
          Find Karaoke Near Me
        </Link>
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
          <Link className="btn btn-primary" href={goUrl(query)}>
            View on Map
          </Link>
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
