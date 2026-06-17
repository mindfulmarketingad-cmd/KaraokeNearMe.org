"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Review {
  name: string;
  location: string;
  text: string;
}

const REVIEWS: Review[] = [
  {
    name: "Marissa T.",
    location: "Atlanta, GA",
    text: "I needed a private room for my sister's birthday — 12 of us, food included. The finder matched me to the perfect KTV spot in minutes instead of scrolling through random Google results. We had the best night.",
  },
  {
    name: "Devin R.",
    location: "Orlando, FL",
    text: "Filtered for family karaoke that was open in the afternoon so I could bring my kids. Found an all-ages spot two miles away that I never knew existed. This site is exactly what I'd been looking for.",
  },
  {
    name: "Jenny K.",
    location: "Los Angeles, CA",
    text: "As someone who loves norebang, being able to filter specifically for Korean karaoke is a game changer. It found three authentic spots near me with huge K-pop catalogs. Saved me so much time.",
  },
  {
    name: "Carlos M.",
    location: "Houston, TX",
    text: "My friends wanted a karaoke bar with a real open-mic vibe, late night, drinks only. Picked those filters, hit the location button, and it dropped us right onto a map of the best spots nearby. Flawless.",
  },
  {
    name: "Priya S.",
    location: "Chicago, IL",
    text: "What I love is how precise it is. I told it I wanted a private room for a small group with food, and every result actually matched. No more calling around to ask if they take groups. Highly recommend.",
  },
  {
    name: "Tyler B.",
    location: "Seattle, WA",
    text: "Visiting a new city and had no idea where to sing. Used the near-me search, picked private rooms for a medium group, and was booked within ten minutes. The best karaoke finder I've used, hands down.",
  },
];

function Stars() {
  return (
    <div style={{ color: "#ffb400", fontSize: "1rem", letterSpacing: 1 }} aria-label="5 out of 5 stars">
      {"★★★★★"}
    </div>
  );
}

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Responsive cards-per-view
  useEffect(() => {
    function update() {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1000) setPerView(2);
      else setPerView(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pageCount = Math.max(1, REVIEWS.length - perView + 1);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % pageCount);
  }, [pageCount]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + pageCount) % pageCount);
  }, [pageCount]);

  // Clamp index when perView changes
  useEffect(() => {
    setIndex((i) => Math.min(i, pageCount - 1));
  }, [pageCount]);

  // Auto-advance
  useEffect(() => {
    timer.current = setInterval(next, 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [next]);

  function handleManualNav(fn: () => void) {
    if (timer.current) clearInterval(timer.current);
    fn();
  }

  return (
    <div>
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            transition: "transform 0.5s ease",
            transform: `translateX(-${index * (100 / perView)}%)`,
          }}
        >
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              style={{
                flex: `0 0 ${100 / perView}%`,
                boxSizing: "border-box",
                padding: "0 10px",
              }}
            >
              <figure
                style={{
                  margin: 0,
                  height: "100%",
                  background: "#fff",
                  border: "1px solid #e9e9e9",
                  borderRadius: 12,
                  padding: "26px 24px",
                  boxShadow: "0 10px 30px rgba(20,20,20,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <Stars />
                <blockquote
                  style={{
                    margin: 0,
                    fontSize: "0.96rem",
                    lineHeight: 1.6,
                    color: "#161616",
                    flex: 1,
                  }}
                >
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderTop: "1px solid #f0f0f0",
                    paddingTop: 14,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(145deg, #ff8066, #e8624a)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    {r.name.charAt(0)}
                  </span>
                  <span>
                    <span style={{ display: "block", fontWeight: 600, fontSize: "0.92rem" }}>
                      {r.name}
                    </span>
                    <span style={{ display: "block", fontSize: "0.82rem", opacity: 0.6 }}>
                      {r.location}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          marginTop: 24,
        }}
      >
        <button
          type="button"
          onClick={() => handleManualNav(prev)}
          aria-label="Previous reviews"
          style={navBtnStyle}
        >
          ‹
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleManualNav(() => setIndex(i))}
              aria-label={`Go to review set ${i + 1}`}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                padding: 0,
                background: i === index ? "#ff8066" : "#d8d8d8",
                transition: "background 0.2s ease",
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => handleManualNav(next)}
          aria-label="Next reviews"
          style={navBtnStyle}
        >
          ›
        </button>
      </div>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1.5px solid #d8d8d8",
  background: "#fff",
  cursor: "pointer",
  fontSize: "1.4rem",
  lineHeight: 1,
  color: "#161616",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
