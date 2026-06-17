"use client";

import { useState, useMemo } from "react";
import { states } from "@/lib/states";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type KaraokeType = "any" | "bar" | "private" | "korean" | "family";
type GroupSize   = "any" | "solo" | "small" | "medium" | "large";
type ArrivalTime = "any" | "afternoon" | "evening" | "late";
type FoodPref    = "any" | "food" | "drinks-only";
type LocMode     = "geo" | "manual";
type GeoStatus   = "idle" | "locating" | "denied";

interface Coords { lat: number; lng: number }

/* ─── Config ─────────────────────────────────────────────────────────────── */

const TYPES: { value: KaraokeType; icon: string; label: string; sub: string }[] = [
  { value: "any",     icon: "🎤", label: "Any style",          sub: "Surprise me"              },
  { value: "bar",     icon: "🍺", label: "Bar / Open Mic",     sub: "Sign up & sing for crowd" },
  { value: "private", icon: "🚪", label: "Private Room",       sub: "KTV suite, just your group"},
  { value: "korean",  icon: "🎵", label: "Korean (Norebang)",  sub: "K-pop, norebang rooms"    },
  { value: "family",  icon: "👨‍👩‍👧", label: "Family Friendly",   sub: "All-ages, kids welcome"   },
];

const GROUP_SIZES: { value: GroupSize; label: string; hint: string }[] = [
  { value: "any",    label: "Any size",   hint: "" },
  { value: "solo",   label: "1–2",        hint: "Just us" },
  { value: "small",  label: "3–6",        hint: "Small group" },
  { value: "medium", label: "7–15",       hint: "Medium group" },
  { value: "large",  label: "16+",        hint: "Large group" },
];

const TIMES: { value: ArrivalTime; label: string; sub: string }[] = [
  { value: "any",       label: "Any time",        sub: "" },
  { value: "afternoon", label: "Afternoon",        sub: "Before 7 pm" },
  { value: "evening",   label: "Evening",          sub: "7 – 10 pm" },
  { value: "late",      label: "Late night",       sub: "After 10 pm" },
];

const FOOD: { value: FoodPref; label: string; sub: string }[] = [
  { value: "any",         label: "No preference",  sub: "" },
  { value: "food",        label: "Food + drinks",  sub: "Want to eat" },
  { value: "drinks-only", label: "Drinks only",    sub: "No food needed" },
];

/* ─── Query builder ──────────────────────────────────────────────────────── */

function buildQuery(
  type: KaraokeType,
  group: GroupSize,
  time: ArrivalTime,
  food: FoodPref
): string {
  const parts: string[] = [];

  // Base term
  if (type === "bar")     parts.push("karaoke bar");
  else if (type === "private") parts.push("private karaoke room KTV");
  else if (type === "korean")  parts.push("korean karaoke norebang KTV");
  else if (type === "family")  parts.push("family karaoke all ages");
  else                          parts.push("karaoke");

  // Group size context
  if (group === "large")  parts.push("large group party room");
  else if (group === "medium") parts.push("group karaoke room");
  else if (type === "private" && (group === "solo" || group === "small"))
    parts.push("small private room");

  // Food
  if (food === "food") parts.push("with food");

  // Time
  if (time === "late")      parts.push("open late night");
  else if (time === "afternoon") parts.push("open afternoon");

  return parts.join(" ");
}

/* ─── Redirect helpers ───────────────────────────────────────────────────── */

function mapsUrlByCoords(query: string, coords: Coords): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.lat},${coords.lng},13z`;
}

function mapsUrlByPlace(query: string, place: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query} near ${place}`)}`;
}

function go(mapsUrl: string) {
  window.location.href = `/go/?to=${encodeURIComponent(mapsUrl)}`;
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const CHIP_ACTIVE: React.CSSProperties = {
  background: "#ff8066",
  borderColor: "#ff8066",
  color: "#fff",
  fontWeight: 600,
};

const CHIP_BASE: React.CSSProperties = {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1.5px solid #d8d8d8",
  background: "#fff",
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.12s ease",
  lineHeight: 1.25,
  gap: 2,
  minWidth: 0,
};

function TypeCard({
  item,
  active,
  onClick,
}: {
  item: typeof TYPES[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...CHIP_BASE,
        ...(active ? CHIP_ACTIVE : {}),
        padding: "10px 14px",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
      aria-pressed={active}
    >
      <span style={{ fontSize: "1.3rem", lineHeight: 1 }} aria-hidden="true">
        {item.icon}
      </span>
      <span>
        <span style={{ display: "block", fontWeight: 600, fontSize: "0.92rem" }}>
          {item.label}
        </span>
        {item.sub && (
          <span
            style={{
              display: "block",
              fontSize: "0.78rem",
              opacity: active ? 0.9 : 0.55,
              fontWeight: 400,
            }}
          >
            {item.sub}
          </span>
        )}
      </span>
    </button>
  );
}

function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            style={{
              ...CHIP_BASE,
              ...(active ? CHIP_ACTIVE : {}),
              padding: "6px 13px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <span style={{ fontSize: "0.9rem", fontWeight: active ? 600 : 500 }}>
              {o.label}
            </span>
            {o.hint && (
              <span
                style={{
                  fontSize: "0.74rem",
                  opacity: active ? 0.9 : 0.5,
                  fontWeight: 400,
                }}
              >
                {o.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 8px",
        fontWeight: 600,
        fontSize: "0.88rem",
        color: "#161616",
        letterSpacing: "0.01em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return (
    <hr style={{ border: "none", borderTop: "1px solid #e9e9e9", margin: "20px 0" }} />
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function Finder() {
  // Filters
  const [karaokeType, setKaraokeType] = useState<KaraokeType>("any");
  const [groupSize,   setGroupSize]   = useState<GroupSize>("any");
  const [arrivalTime, setArrivalTime] = useState<ArrivalTime>("any");
  const [foodPref,    setFoodPref]    = useState<FoodPref>("any");

  // Location
  const [locMode,    setLocMode]    = useState<LocMode>("geo");
  const [geoStatus,  setGeoStatus]  = useState<GeoStatus>("idle");
  const [stateSlug,  setStateSlug]  = useState("");
  const [city,       setCity]       = useState("");

  const selectedState = useMemo(
    () => states.find((s) => s.slug === stateSlug),
    [stateSlug]
  );

  const query = useMemo(
    () => buildQuery(karaokeType, groupSize, arrivalTime, foodPref),
    [karaokeType, groupSize, arrivalTime, foodPref]
  );

  // Summary label for the CTA
  const summaryLabel = useMemo(() => {
    const type = TYPES.find((t) => t.value === karaokeType)!;
    const group = GROUP_SIZES.find((g) => g.value === groupSize)!;
    const time  = TIMES.find((t) => t.value === arrivalTime)!;
    const food  = FOOD.find((f) => f.value === foodPref)!;
    const parts = [type.label];
    if (groupSize !== "any") parts.push(`for ${group.label}`);
    if (arrivalTime !== "any") parts.push(time.label.toLowerCase());
    if (foodPref === "food") parts.push("with food");
    return parts.join(" · ");
  }, [karaokeType, groupSize, arrivalTime, foodPref]);

  function handleGeoSearch() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocMode("manual");
      return;
    }
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => go(mapsUrlByCoords(query, { lat: pos.coords.latitude, lng: pos.coords.longitude })),
      () => { setGeoStatus("denied"); setLocMode("manual"); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function handleManualSearch() {
    if (!selectedState) return;
    const place = city ? `${city}, ${selectedState.name}` : selectedState.name;
    go(mapsUrlByPlace(query, place));
  }

  const canManualSearch = !!selectedState;

  return (
    <div className="finder">
      {/* ── Type ─────────────────────────────────────────────────────────── */}
      <FieldLabel>What type of karaoke?</FieldLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {TYPES.map((t) => (
          <TypeCard
            key={t.value}
            item={t}
            active={karaokeType === t.value}
            onClick={() => setKaraokeType(t.value)}
          />
        ))}
      </div>

      <Divider />

      {/* ── Group size ────────────────────────────────────────────────────── */}
      <FieldLabel>Group size</FieldLabel>
      <PillGroup
        options={GROUP_SIZES}
        value={groupSize}
        onChange={setGroupSize}
      />

      <Divider />

      {/* ── Arrival time ─────────────────────────────────────────────────── */}
      <FieldLabel>When do you want to arrive?</FieldLabel>
      <PillGroup
        options={TIMES.map((t) => ({
          value: t.value,
          label: t.label,
          hint: t.sub,
        }))}
        value={arrivalTime}
        onChange={setArrivalTime}
      />

      <Divider />

      {/* ── Food ─────────────────────────────────────────────────────────── */}
      <FieldLabel>Food &amp; drinks</FieldLabel>
      <PillGroup
        options={FOOD.map((f) => ({
          value: f.value,
          label: f.label,
          hint: f.sub,
        }))}
        value={foodPref}
        onChange={setFoodPref}
      />

      <Divider />

      {/* ── Location ─────────────────────────────────────────────────────── */}
      <FieldLabel>Where are you?</FieldLabel>
      <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
        {(["geo", "manual"] as LocMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setLocMode(m)}
            aria-pressed={locMode === m}
            style={{
              ...CHIP_BASE,
              ...(locMode === m ? CHIP_ACTIVE : {}),
              padding: "7px 14px",
              flexDirection: "row",
              gap: 6,
              fontSize: "0.88rem",
              fontWeight: locMode === m ? 600 : 500,
            }}
          >
            {m === "geo" ? "📍 Use my location" : "🔍 Enter a city"}
          </button>
        ))}
      </div>

      {locMode === "geo" ? (
        <div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "100%", textAlign: "center" }}
            onClick={handleGeoSearch}
            disabled={geoStatus === "locating"}
          >
            {geoStatus === "locating"
              ? "Detecting your location…"
              : "Find Karaoke Near Me"}
          </button>
          <p className="muted" style={{ margin: "0.5rem 0 0", fontSize: "0.82rem" }}>
            Your browser will ask permission to share your location.
            Nothing is stored.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="finder-state" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
              State
            </label>
            <select
              id="finder-state"
              value={stateSlug}
              onChange={(e) => { setStateSlug(e.target.value); setCity(""); }}
            >
              <option value="">Select a state</option>
              {states.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>
          {selectedState && (
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="finder-city" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                City <span style={{ fontWeight: 400, opacity: 0.5 }}>(optional)</span>
              </label>
              <select
                id="finder-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">All of {selectedState.name}</option>
                {selectedState.cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "100%", textAlign: "center" }}
            onClick={handleManualSearch}
            disabled={!canManualSearch}
          >
            Find Karaoke Near Me
          </button>
        </div>
      )}

      {/* ── Summary ──────────────────────────────────────────────────────── */}
      <div
        className="finder-result"
        style={{
          marginTop: 16,
          fontSize: "0.88rem",
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <span style={{ fontSize: "1rem", marginTop: 1 }}>🔎</span>
        <span>
          <strong>Searching for:</strong>{" "}
          <span style={{ color: "#e8624a" }}>{summaryLabel}</span>
        </span>
      </div>
    </div>
  );
}
