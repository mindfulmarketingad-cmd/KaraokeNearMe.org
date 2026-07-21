"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

// Renders a clickable "City, State" span inside a listing card. Cards are
// already wrapped in a <Link> to the venue's own page, so this can't be a
// nested <a> — it navigates on click/Enter instead, stopping propagation so
// it doesn't also trigger the card's own link.
export default function CityLink({
  href,
  children,
  className = "venue-card-meta-link",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const go = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };
  return (
    <span
      role="link"
      tabIndex={0}
      className={className}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter") go(e);
      }}
    >
      {children}
    </span>
  );
}
