"use client";

import { useState } from "react";
import BookingModal, { BookingVenue } from "@/components/BookingModal";

// A self-contained "Inquire / book" button + its booking modal. Used on the
// individual partner page, where a single island is all that's needed.
export default function InquireButton({
  venue,
  className = "btn btn-primary",
  label = "Inquire / Book Event",
}: {
  venue: BookingVenue;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>
      <BookingModal venue={open ? venue : null} onClose={() => setOpen(false)} />
    </>
  );
}
