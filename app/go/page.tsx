"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function GoPageContent() {
  const searchParams = useSearchParams();
  const to = searchParams.get("to") ?? "";
  const [dotCount, setDotCount] = useState(1);
  const redirected = useRef(false);

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDotCount((n) => (n % 3) + 1);
    }, 450);

    const redirectTimer = setTimeout(() => {
      if (!redirected.current && to) {
        redirected.current = true;
        window.location.href = to;
      }
    }, 2400);

    return () => {
      clearInterval(dotTimer);
      clearTimeout(redirectTimer);
    };
  }, [to]);

  const dots = ".".repeat(dotCount);

  return (
    <>
      <style>{`
        @keyframes kn-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          40%       { transform: scale(1.18) rotate(-8deg); }
          60%       { transform: scale(1.12) rotate(4deg); }
        }
        @keyframes kn-ring {
          0%   { transform: scale(0.85); opacity: 0.7; }
          70%  { transform: scale(1.6);  opacity: 0; }
          100% { transform: scale(1.6);  opacity: 0; }
        }
        .kn-go-mic   { animation: kn-pulse 1.4s ease-in-out infinite; }
        .kn-go-ring  {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.55);
          animation: kn-ring 1.6s ease-out infinite;
        }
        .kn-go-ring2 { animation-delay: 0.55s; }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #ff8066 0%, #d95f47 100%)",
          color: "#fff",
          textAlign: "center",
          padding: "2rem",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Pulsing mic with ripple rings */}
        <div
          style={{
            position: "relative",
            width: 88,
            height: 88,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <div className="kn-go-ring" />
          <div className="kn-go-ring kn-go-ring2" />
          <span
            className="kn-go-mic"
            style={{ fontSize: "3rem", lineHeight: 1, display: "block" }}
            aria-hidden="true"
          >
            🎤
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(1.35rem, 4vw, 1.9rem)",
            fontWeight: 700,
            margin: "0 0 0.6rem",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Finding Karaoke Spots Near You{dots}
        </h1>

        <p
          style={{
            fontSize: "0.95rem",
            opacity: 0.8,
            margin: 0,
            fontWeight: 400,
          }}
        >
          Opening Google Maps
        </p>
      </div>
    </>
  );
}

export default function GoPage() {
  return (
    <Suspense>
      <GoPageContent />
    </Suspense>
  );
}
