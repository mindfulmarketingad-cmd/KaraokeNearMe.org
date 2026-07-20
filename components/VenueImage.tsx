"use client";

import { useState } from "react";

// A plain <img> that falls back to a general stock photo if the primary
// source fails to load. Many venue photos are Google-hosted URLs that can
// expire, so this keeps a broken link from showing an empty box.
const FALLBACK = "/hero.jpg";

export default function VenueImage({
  src,
  alt,
  className,
  loading = "lazy",
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  const [current, setCurrent] = useState(src || FALLBACK);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK);
      }}
    />
  );
}
